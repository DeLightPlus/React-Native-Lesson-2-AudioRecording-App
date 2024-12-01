import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const RecordingsScreen = () => {
  const [recordings, setRecordings] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadRecordings = async () => {
      try {
        const keys = await (Platform.OS === "web"
          ? Object.keys(localStorage)
          : AsyncStorage.getAllKeys());
        const savedRecordings = [];

        for (const key of keys) {
          const uri = Platform.OS === "web" ? localStorage.getItem(key) : await AsyncStorage.getItem(key);
          if (uri) {
            savedRecordings.push({ id: key, uri });
          }
        }

        setRecordings(savedRecordings);
      } catch (error) {
        console.error("Error loading recordings:", error);
      }
    };

    loadRecordings();
  }, []);

  return (
    <View>
      <Text>Saved Recordings</Text>
      <FlatList
        data={recordings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.id}</Text>
            <Button title="Play" onPress={() => navigation.navigate('AudioPlayback', { uri: item.uri })} />
          </View>
        )}
      />
    </View>
  );
};

export default RecordingsScreen;
