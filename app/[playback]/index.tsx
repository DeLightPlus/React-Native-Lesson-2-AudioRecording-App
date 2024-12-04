import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Audio } from "expo-av"; // Import Audio component from expo-av
import { useRoute } from "@react-navigation/native"; // To get the URI from route params
import { loadRecordingById } from "@/utils/loadRecordings"; // Your utility to load recording by ID

const AudioPlaybackScreen = () => {
  const [sound, setSound] = useState();
  const [recording, setRecording] = useState(null); // To store the fetched recording data
  const [loading, setLoading] = useState(true); // For loading state
  const route = useRoute();
  const { id } = route.params; // Get ID from route params

  // Function to load and play sound
  const playRecording = async (uri) => {
    try 
    {     
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      setSound(sound);
    } catch (error) { console.error("Error loading sound:", error); }
  };

  // Load the recording details by ID
  const fetchRecordingById = async (id) => {
    setLoading(true);
    const fetchedRecording = await loadRecordingById(id);

    if (fetchedRecording) 
    {
      console.log("recording:", fetchedRecording);
      const cleanedUri = fetchedRecording.uri.replace(/^blob:/, '');
      console.log(cleanedUri);
      
      setRecording(fetchedRecording); // Set the recording data
      playRecording(cleanedUri); // Play the recording after loading
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) {  fetchRecordingById(id); }// Fetch recording by ID when the component mounts

    return () => { sound?.unloadAsync(); }; // Unload sound when component unmounts
  }, [id]); // Re-run when `id` changes

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
          <Text>Playing from: {recording.name}</Text>
          <Text>Duration: {recording.duration}</Text>
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
