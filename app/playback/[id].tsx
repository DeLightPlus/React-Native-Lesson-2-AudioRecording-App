import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { useRoute } from '@react-navigation/native';
import { loadRecordingById } from '@/utils/loadRecordings';

const AudioPlaybackScreen = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [recording, setRecording] = useState<any>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const route = useRoute();
  const { id } = route.params;

  // Flag to prevent rapid multiple presses
  const [isButtonPressing, setIsButtonPressing] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);

  // Combined asynchronous function for cleaner code
  const asyncInitSound = async (uri: string) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri }, 
        { shouldPlay: false, progressUpdateIntervalMillis: 500 }); // Set shouldPlay to false

      soundRef.current = sound;
      setSound(sound);

      const status = await sound.getStatusAsync();
      if (status.isLoaded) 
      {
        setPlaybackDuration(status.durationMillis / 1000);
      }

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) 
        {
          setPlaybackPosition(status.positionMillis / 1000);
          if (status.didJustFinish) 
          {
            setIsPlaying(false);

            isRepeating ?
              soundRef.current?.setPositionAsync(0)// Reset playback position
              : handleStop()

          }
        }
      });
    } catch (error) {
      console.error('Error loading sound:', error);
      Alert.alert('Playback Error', 'There was an error loading the audio file.');
    }
  };

  const handlePlayPause = async () => {
    if (isButtonPressing) return;

    setIsButtonPressing(true);

    try 
    {
      if (isPlaying) 
      {
        await soundRef.current?.pauseAsync();
      } 
      else 
      {
        if (!sound)  // Check if sound is initialized before playing
        {
          await asyncInitSound(recording.uri);
        }

        await soundRef.current?.playAsync();
      }

      setIsPlaying(!isPlaying);
    } 
    catch (error) 
    {
      Alert.alert('Playback Error', 'There was an error toggling playback.');
    }

    setTimeout(() => setIsButtonPressing(false), 500);
  };

  const handleStop = async () => {
    if (isButtonPressing) return;

    setIsButtonPressing(true);
    try 
    {
      await soundRef.current?.stopAsync();
      await soundRef.current?.setPositionAsync(0);

      setIsPlaying(false);
      setPlaybackPosition(0);
    } 
    catch (error) 
    {
      Alert.alert('Playback Error', 'There was an error stopping the audio.');
    }
    setTimeout(() => setIsButtonPressing(false), 500);
  };

  const fetchRecording = async () => {
    try 
    {
      const recordingData = await loadRecordingById(id);
      if (recordingData)
      {
        setRecording(recordingData);
      } else {
        Alert.alert('Error', 'Recording not found');
      }
    } 
    catch (error) 
    {
      Alert.alert('Error', 'Failed to load recording');
    }
  };

  useEffect(() => {
    if (id) {
      fetchRecording();
    }

    return () => {
      soundRef.current?.unloadAsync();
    };
  }, [id]);

  // Format time in mm:ss or hh:mm:ss format
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Playback</Text>
      {
      recording &&
       (
        <>
          <Text>
            {isPlaying && "Playing:"} 
            {recording.name}</Text>
          <Text>URI: {recording.uri}</Text>
          <View style={styles.timeContainer}>
            <Text>{formatTime(playbackPosition)}</Text>
            <Text>{formatTime(playbackDuration)}</Text>
          </View>
          <View style={styles.controlsContainer}>
            {isPlaying ? (
              <>
                <Pressable onPress={handlePlayPause} style={styles.button}>
                  <Text style={styles.buttonText}>Pause</Text>
                </Pressable>
                <Pressable onPress={handleStop} style={styles.button}>
                  <Text style={styles.buttonText}>Stop</Text>
                </Pressable>
              </>
            ) : (

              <>
                {/* <Pressable onPress={() => setIsRepeating(!isRepeating)} style={styles.button}>
                  <Text style={styles.buttonText}>{isRepeating ? "Repeat 🟢" : "Repeat 🔴"}</Text>
                </Pressable> */}

                <Pressable onPress={()=> {                  
                  handlePlayPause()
                  }} style={styles.button}>
                  <Text style={styles.buttonText}>Play</Text>
                </Pressable>
              </>
              
            )}
          </View>
        </>
      )}
    </View>
  );
};

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
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  button: {
    backgroundColor: "#6200ee",
    paddingVertical: 64,
    paddingHorizontal: 64,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AudioPlaybackScreen;
