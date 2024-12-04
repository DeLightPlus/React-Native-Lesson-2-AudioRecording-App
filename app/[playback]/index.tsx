import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Button, StyleSheet, Platform } from "react-native";
import { Audio } from "expo-av"; // Import Audio component from expo-av for native
import { useRoute } from "@react-navigation/native"; // To get the URI from route params
import { loadRecordingById } from "@/utils/loadRecordings"; // Your utility to load recording by ID

const AudioPlaybackScreen = () => {
  const [sound, setSound] = useState();
  const [recording, setRecording] = useState(null); // To store the fetched recording data
  const [loading, setLoading] = useState(true); // For loading state
  const [isPlaying, setIsPlaying] = useState(false); // To track if audio is playing
  const [playbackPosition, setPlaybackPosition] = useState(0); // Current playback position in seconds
  const [totalDuration, setTotalDuration] = useState(0); // Total duration of the recording in seconds
  const route = useRoute();
  const { id } = route.params; // Get ID from route params

  // Function to load and play sound for Native (using expo-av)
  const playRecordingNative = async (uri) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      setSound(sound);

      // Set playback duration and start playing
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isPlaying) {
          setIsPlaying(true);
          setPlaybackPosition(Math.floor(status.positionMillis / 1000));
          setTotalDuration(Math.floor(status.durationMillis / 1000));
        } else {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error("Error loading sound:", error);
    }
  };

  // Function to load and play sound for Web (using HTML5 Audio)
  const playRecordingWeb = (uri) => {
    const audioElement = new Audio(uri);
    audioElement.play();

    audioElement.onplay = () => {
      setIsPlaying(true);
    };

    audioElement.onpause = () => {
      setIsPlaying(false);
    };

    audioElement.onended = () => {
      setIsPlaying(false);
      setPlaybackPosition(0); // Reset playback position when finished
    };

    // Track the playback position and duration
    setInterval(() => {
      setPlaybackPosition(Math.floor(audioElement.currentTime));
      setTotalDuration(Math.floor(audioElement.duration));
    }, 1000);
  };

  // Load the recording details by ID
  const fetchRecordingById = async (id) => {
    setLoading(true);
    const fetchedRecording = await loadRecordingById(id);

    if (fetchedRecording) {
      console.log("recording:", fetchedRecording);
      const cleanedUri = fetchedRecording.uri.replace(/^blob:/, ''); // Clean the URI if needed
      console.log("Cleaned URI:", cleanedUri);
      
      setRecording(fetchedRecording); // Set the recording data
      if (Platform.OS === 'web') {
        playRecordingWeb(cleanedUri); // Play the recording for Web
      } else {
        playRecordingNative(cleanedUri); // Play the recording for Native
      }
    }
    setLoading(false);
  };

  // Effect to fetch and play the recording when the component mounts
  useEffect(() => {
    if (id) {
      fetchRecordingById(id); // Fetch recording by ID
    }

    return () => {
      if (sound) {
        sound.unloadAsync(); // Cleanup the sound resource when the component unmounts
      }
    };
  }, [id, sound]); // Re-run when `id` or `sound` changes

  // Pause or resume playback (for both Web and Native)
  const togglePlayback = async () => {
    if (Platform.OS !== 'web' && sound) {
      if (isPlaying) {
        await sound.pauseAsync(); // Pause playback
        setIsPlaying(false);
      } else {
        await sound.playAsync(); // Resume playback
        setIsPlaying(true);
      }
    } else if (Platform.OS === 'web') {
      const audioElement = document.querySelector('audio');
      if (audioElement) {
        if (isPlaying) {
          audioElement.pause(); // Pause playback
        } else {
          audioElement.play(); // Resume playback
        }
        setIsPlaying(!isPlaying);
      }
    }
  };

  // Stop the playback (for both Web and Native)
  const stopPlayback = async () => {
    if (Platform.OS !== 'web' && sound) {
      await sound.stopAsync(); // Stop playback
      setIsPlaying(false);
      setPlaybackPosition(0); // Reset playback position
    } else if (Platform.OS === 'web') {
      const audioElement = document.querySelector('audio');
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
        setIsPlaying(false);
        setPlaybackPosition(0);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {recording ? (
        <>
          <Text style={styles.title}>Audio Playback</Text>
          <Text>Playing: {recording.name}</Text>
          <Text>Duration: {recording.duration}</Text>
          <Text>Current Time: {playbackPosition}s</Text>
          <Text>Total Duration: {totalDuration}s</Text>

          <Button 
            title={isPlaying ? "Pause" : "Play"}
            onPress={togglePlayback} 
          />
          <Button 
            title="Stop"
            onPress={stopPlayback}
            disabled={!isPlaying}
          />
        </>
      ) : (
        <Text>No recording found.</Text>
      )}
    </View>
  );
};

export default AudioPlaybackScreen;

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
