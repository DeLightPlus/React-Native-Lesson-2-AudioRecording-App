import React, { useState, useRef, useEffect, useContext, useCallback } from "react";
import { View, Text, StyleSheet, Button, Pressable, Platform, Alert } from "react-native";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For native storage
import { RecordingsContext } from "../app/_layout";
import Svg, { Path } from "react-native-svg";
// import { MicIcon } from "@/utils/icons";

const micIcon1 = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 32 32" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M 13 4 C 11.90625 4 11 4.90625 11 6 L 11 18 C 11 19.09375 11.90625 20 13 20 L 19 20 C 20.09375 20 21 19.09375 21 18 L 21 6 C 21 4.90625 20.09375 4 19 4 Z M 13 6 L 19 6 L 19 18 L 13 18 Z M 7 14 L 7 18 C 7 21.300781 9.699219 24 13 24 L 15 24 L 15 26 L 11 26 L 11 28 L 21 28 L 21 26 L 17 26 L 17 24 L 19 24 C 22.300781 24 25 21.300781 25 18 L 25 14 L 23 14 L 23 18 C 23 20.21875 21.21875 22 19 22 L 13 22 C 10.78125 22 9 20.21875 9 18 L 9 14 Z"></path></svg>`

// Utility function to format time to HH:MM:SS
const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default function AudioRecordingScreen() {
  const { currentRecording, setCurrentRecording, recordings, setRecordings } = useContext(RecordingsContext);
  const [audioRecording, setAudioRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [totalPlaybackTime, setTotalPlaybackTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const playbackRef = useRef<Audio.Sound | null>(null);
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access microphone is required!");
      }
    };
    requestPermissions();
    return cleanup;
  }, []);

  const cleanup = useCallback(() => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    if (playbackRef.current) {
      playbackRef.current.unloadAsync();
      playbackRef.current = null;
    }
  }, []);

  const startRecording = async () => {
    try {
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setAudioRecording(recording);
      setIsRecording(true);
      setRecordingTime(0);

      const newRecording = {
        id: Date.now(),
        name: `Recording ${Date.now()}`,
        duration: "00:00",
      };
      setCurrentRecording(newRecording);

      recordingTimerRef.current = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = async () => {
    if (!audioRecording) return;

    try {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);

      await audioRecording.stopAndUnloadAsync();
      const { sound, status } = await audioRecording.createNewLoadedSoundAsync();
      const formattedDuration = formatTime(Math.floor(status.durationMillis / 1000));

      setIsRecording(false);
      setCurrentRecording({
        id: Date.now(),
        name: `Recording ${Date.now()}`,
        duration: formattedDuration,
        sound,
        fileUri: audioRecording.getURI(),
      });
      setAudioRecording(null);

      // Show options to save or discard the recording
      Alert.alert("Save or Discard", "Do you want to save this recording?", [
        {
          text: "Discard",
          onPress: discardRecording,
        },
        {
          text: "Save",
          onPress: saveRecording,
        },
      ]);
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  const saveRecording = async () => {
    if (Platform.OS === "web") {
      try {
        const fileKey = `recording_${currentRecording?.id}`;
        localStorage.setItem(fileKey, currentRecording?.fileUri || "");
        setRecordings((prev) => [...prev, currentRecording!]);
        setCurrentRecording(null);
      } catch (error) {
        console.error("Error saving recording to localStorage:", error);
      }
    } else {
      try {
        const fileKey = `recording_${currentRecording?.id}`;
        await AsyncStorage.setItem(fileKey, currentRecording?.fileUri || "");
        setRecordings((prev) => [...prev, currentRecording!]);
        setCurrentRecording(null);
      } catch (error) {
        console.error("Error saving recording to AsyncStorage:", error);
      }
    }
  };

  const discardRecording = () => {
    setCurrentRecording(null); // Discard the current recording
  };

  const playRecording = async () => {
    if (playbackRef.current) await stopPlayback();

    if (!currentRecording?.sound) return;

    try {
      playbackRef.current = currentRecording.sound;
      const status = await playbackRef.current.getStatusAsync();
      setTotalPlaybackTime(Math.floor(status.durationMillis / 1000));
      setPlaybackTime(0);
      setIsPlaying(true);

      await playbackRef.current.playAsync();

      playbackTimerRef.current = setInterval(async () => {
        const status = await playbackRef.current!.getStatusAsync();
        if (status.isPlaying) {
          setPlaybackTime(Math.floor(status.positionMillis / 1000));
        } else {
          clearInterval(playbackTimerRef.current!);
          setIsPlaying(false);
        }
      }, 1000);
    } catch (error) {
      console.error("Error playing recording:", error);
    }
  };

  const stopPlayback = useCallback(async () => {
    if (playbackRef.current) {
      await playbackRef.current.stopAsync();
      clearInterval(playbackTimerRef.current!);
      playbackRef.current = null;
      setPlaybackTime(0);
      setIsPlaying(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      {isRecording ? (
        <View style={styles.recorder}>
          {/* <Text style={styles.title}>Recording in Progress</Text> */}
          <Text>{formatTime(recordingTime)}</Text>
          <Pressable style={styles.recNstopBtn}
            onPress={stopRecording}>
            <Svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="32px" width="32px">
              <Path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z"></Path>
            </Svg>
          </Pressable> 
        </View>
      ) : currentRecording ? (
        <View style={styles.recorder}>
          <Text style={styles.title}>Recorded Audio</Text>
          <Text>{currentRecording.name}</Text>
          <Text>Duration: {currentRecording.duration}</Text>
          {isPlaying ? (
            <View>
              <Text>Playback: {formatTime(playbackTime)} / {formatTime(totalPlaybackTime)}</Text>
              <Pressable style={styles.recNstopBtn}
                onPress={stopPlayback}>
                  <Svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="32px" width="32px">
                    <Path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z"></Path>
                  </Svg>
              </Pressable>  
            </View>
          ) : (
            <Pressable style={styles.playIcnBtn} onPress={playRecording} >
              <Svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="32px" width="32px">
                <Path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></Path>
              </Svg>
            </Pressable>
          )}
          <View style={{ display:"flex", flexDirection:"row", gap: 16 }}>
            <Pressable style={styles.deleteBtn}
              onPress={discardRecording}>
              <Text>Discard</Text>
            </Pressable> 
              
            <Pressable style={styles.saveBtn}
              onPress={saveRecording} >
              <Text>Save</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.recorderMin}>
          {/* <Text style={styles.title}>No Recording Available</Text> */}
         
          <Pressable 
            style={styles.recNstopBtn}
            onPress={startRecording}
          >
             <Svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 32 32" height="32px" width="32px">
              <Path d="M 13 4 C 11.90625 4 11 4.90625 11 6 L 11 18 C 11 19.09375 
              11.90625 20 13 20 L 19 20 C 20.09375 20 21 19.09375 21 18 L 21 6 C 21 4.90625 20.09375 4 19 4 Z M 13 6 L 19 6 L 19 18 L 13 18 Z M 7 14 L 7 18 C 7 21.300781 9.699219 24 13 24 L 15 24 L 15 26 L 11 26 L 11 28 L 21 28 L 21 26 L 17 26 L 17 24 L 19 24 C 22.300781 24 25 21.300781 25 18 L 25 14 L 23 14 L 23 18 C 23 20.21875 21.21875 22 19 22 L 13 22 C 10.78125 22 9 20.21875 9 18 L 9 14 Z"></Path></Svg>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  saveBtn:{
    padding: 4,
    backgroundColor: "#4CAF50",
    width: 64,
    height: 32,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },

  deleteBtn:{
    padding: 4,
    backgroundColor: "red",
    width: 64,
    height: 32,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },

  recNstopBtn:{
    width: 86,
    height: 86,
    backgroundColor: "skyblue",
    borderRadius: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  playIcnBtn: {
    width: 86,
    height: 86,
    backgroundColor: "skyblue",
    borderRadius: "100%",
    justifyContent: "center",
    alignItems: "center"
  },

  recorder:{
    flex: 1,
    display: "flex",
    alignItems:"center",
    justifyContent:"center"    
  },

  recorderMin:{
    position: "fixed",
    padding: 8,
    bottom: 0,
    height: 97,
    width: "100%",
    backgroundColor: "lightgrey",   
    display: "flex",
    alignItems:"center",
    justifyContent:"center"    
  }
});
