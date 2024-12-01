import React, { useState, useRef, useEffect, useContext, useCallback } from "react";
import { View, Text, StyleSheet, Button, Pressable, Platform, Alert } from "react-native";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For native storage
import { RecordingsContext } from "../app/_layout";

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
        <View>
          <Text style={styles.title}>Recording in Progress</Text>
          <Text>Duration: {formatTime(recordingTime)}</Text>
          <Button title="Stop Recording" onPress={stopRecording} />
        </View>
      ) : currentRecording ? (
        <View>
          <Text style={styles.title}>Recorded Audio</Text>
          <Text>Name: {currentRecording.name}</Text>
          <Text>Duration: {currentRecording.duration}</Text>
          {isPlaying ? (
            <View>
              <Text>Playback: {formatTime(playbackTime)} / {formatTime(totalPlaybackTime)}</Text>
              <Button title="Stop Playback" onPress={stopPlayback} />
            </View>
          ) : (
            <Button title="Play Recording" onPress={playRecording} />
          )}
          <Button title="Discard" onPress={discardRecording} />
          <Button title="Save" onPress={saveRecording} />
        </View>
      ) : (
        <View>
          <Text style={styles.title}>No Recording Available</Text>
          <Button title="Start Recording" onPress={startRecording} />
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
});
