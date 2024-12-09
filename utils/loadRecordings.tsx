import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadRecordingById = async (id) => {
  try {
    const recordingsJson = await AsyncStorage.getItem("recordings");
    if (!recordingsJson) {
      return null; // No recordings found
    }

    const savedRecordings = JSON.parse(recordingsJson);
    const recording = savedRecordings.find((rec) => rec.id.toString() === id.toString());

    if (!recording) {
      throw new Error("Recording not found");
    }

    return recording;
  } catch (error) {
    console.error("Error loading recording by ID:", error);
    return null; // Return null on errors
  }
};

export const loadRecordings = async () => {
  try {
    const recordingsJson = await AsyncStorage.getItem("recordings");
    if (!recordingsJson) {
      return []; // No recordings found
    }

    const savedRecordings = JSON.parse(recordingsJson);
    return savedRecordings;
  } catch (error) {
    console.error("Error loading recordings:", error);
    return []; // Return empty array on errors
  }
};