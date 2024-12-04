import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, Platform, StyleSheet, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { RecordingsContext } from "@/context/RecordingsContext.jsx";
import { useRouter } from "expo-router";

const RecordingsScreen = () => {
  
  const router = useRouter();
  const { recordings, setRecordings } = useContext(RecordingsContext);

  // Helper function to load saved recordings
  const loadRecordings = async () => {
    try 
    {
      let savedRecordings = [];

      if (Platform.OS === "web") 
      {
        // Web: Using localStorage
        const savedData = localStorage.getItem("recordings");
        if (savedData) {
          savedRecordings = JSON.parse(savedData); // Parse the saved JSON string to an array
        }
      } 
      else 
      {
        // Mobile: Using AsyncStorage
        const recordingsJson = await AsyncStorage.getItem("recordings");

        // If recordingsJson is not null, parse the JSON string
        if (recordingsJson) {
          savedRecordings = JSON.parse(recordingsJson);
        }
      }
      
      setRecordings(savedRecordings);  // Update the state with the loaded recordings
    } 
    catch (error) { console.error("Error loading recordings:", error); }
  };

  useEffect(() => {
    loadRecordings();
  }, []);

  const navigateToPlayback  = async (uri) => {
    router.push(`/playback?uri=${uri}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Recordings</Text>
      <FlatList
        style={styles.listContainer}
        data={recordings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recording}>
            <Text>{item.name }</Text>
            {/* <Text>{item.fileUri }</Text> */}
             
            <Pressable
              style={styles.recPlyBtn}
              onPress={() => navigateToPlayback(item.fileUri)}
            >
              <Text>`Play ▶`</Text>
            </Pressable>

            {/* <Pressable
              style={styles.recPlyBtn}
              onPress={() => playRecording(item.uri)}
            >
              <Text>Play</Text>
            </Pressable> */}
          </View>
        )}
      />
    </View>
  );
};

export default RecordingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listContainer: {
    flex:1,
    gap: 8,
  },
  recording: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 8,
  },
  recPlyBtn: {
    backgroundColor: "skyblue",
    padding: 8,
  },
});
