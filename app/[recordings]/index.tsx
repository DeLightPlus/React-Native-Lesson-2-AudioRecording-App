import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, Platform, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

import { RecordingsContext } from "@/context/RecordingsContext.jsx";
import { loadRecordings } from "@/utils/loadRecordings";


const RecordingsScreen = () => {
  
  const router = useRouter();
  const { recordings, setRecordings } = useContext(RecordingsContext);

  

  useEffect(() => {
    const fetchData = async () =>{
      const allRecs = await loadRecordings();
      setRecordings(allRecs);
      console.log(allRecs);
      
    }
    fetchData();
  }, []);

  const navigateToPlayback  = async (id) => {
    router.push(`/playback?id=${id}`);
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
              onPress={() => navigateToPlayback(item.id)}
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
