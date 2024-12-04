import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const loadRecordingById = async (id) => {
  try 
  {
    let savedRecordings = [];

    // Platform-specific storage
    if (Platform.OS === "web") 
    {
      const savedData = localStorage.getItem("recordings");
      if (savedData) {
        savedRecordings = JSON.parse(savedData);
      }
    } 
    else 
    {
      // For mobile: AsyncStorage
      const recordingsJson = await AsyncStorage.getItem("recordings");
      if (recordingsJson) {
        savedRecordings = JSON.parse(recordingsJson);
      }
    }

    // Find the recording by id
    const recording = savedRecordings.find((rec) => rec.id.toString() === id.toString());

    if (!recording) 
    {
      throw new Error("Recording not found");
    }

    return recording;
  } 
  catch (error) 
  {
    console.error("Error loading recording by ID:", error);
    return null; // Return null if an error occurs or if the recording is not found
  }
};

// Helper function to load saved recordings
export const loadRecordings = async () => {
    try 
    {
        let savedRecordings = [];
    
        if (Platform.OS === "web") 
        {
            // Web: Using localStorage
            const savedData = localStorage.getItem("recordings");
            if (savedData) 
            {
                savedRecordings = JSON.parse(savedData); // Parse the saved JSON string to an array
            }
        }
        else 
        {
            // Mobile: Using AsyncStorage
            const recordingsJson = await AsyncStorage.getItem("recordings");
    
            if (recordingsJson) 
            {
                savedRecordings = JSON.parse(recordingsJson);
            }
        }
    
        return savedRecordings;  // Return the loaded recordings
    } 
    catch (error) 
    {
      console.error("Error loading recordings:", error);
      return [];  // Return empty array if an error occurs
    }
  };
