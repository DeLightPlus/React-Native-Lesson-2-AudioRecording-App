import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Audio } from "expo-av"; // Import Audio component from expo-av
import { useRoute } from "@react-navigation/native"; // To get the URI from route params

const AudioPlaybackScreen = () => {
  const [sound, setSound] = useState();
  const route = useRoute();
  const { uri } = route.params; // Get URI from the route params

  // Function to load and play sound
  const playRecording = async () => {
    try 
    {
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      setSound(sound);
    } 
    catch (error) { console.error("Error loading sound:", error); }
  };

  useEffect(() => {
    playRecording(); // Play the recording when the screen mounts
    return () => {
      sound?.unloadAsync(); // Unload the sound when the component unmounts
    };
  }, [uri]); // Re-run when the URI changes

  return (
    <View style={styles.container}>
        { alert("trying to play: ", uri) }
      <Text style={styles.title}>Audio Playback</Text>
      <Text>Playing from: {uri}</Text>
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
