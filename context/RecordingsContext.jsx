import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react"

export const RecordingsContext = createContext({
  recordings: [],
  setRecordings: () => {},
  currentRecording: "",
  setCurrentRecording: () => {},
});

export default function RecordingProvider({ children })
{
    const [recordings, setRecordings] = useState([]);
    const [currentRecording, setCurrentRecording] = useState("");

    useEffect(() => {
        const fetchRecordings = async () => {
          try 
          {
            const storedRecordings = await AsyncStorage.getItem("recordings");
            if (storedRecordings) {
              setRecordings(JSON.parse(storedRecordings));
            }
          } 
          catch (error) 
          {
            console.error("Error fetching recordings:", error);
          }
        };
    
        fetchRecordings();
      }, []);

    return (
        <RecordingsContext.Provider value={{ currentRecording, setCurrentRecording, recordings, setRecordings }}>
            {children}
        </RecordingsContext.Provider>
    )

}