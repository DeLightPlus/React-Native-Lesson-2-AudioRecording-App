import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { createContext, useState } from "react";

// Context to share recordings state
export const RecordingsContext = createContext();

export default function Layout() {
  const [recordings, setRecordings] = useState([]); // List of all recordings
  const [currentRecording, setCurrentRecording] = useState(null); // Current recording in progress

  return (
    <RecordingsContext.Provider
      value={{ recordings, setRecordings, currentRecording, setCurrentRecording }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer>
          <Drawer.Screen
            name="index"
            options={{
              drawerLabel: "🎙️ Audio Recorder",
              title: "Audio Recorder",
            }}
          />
          <Drawer.Screen
            name="recordings"
            options={{
              drawerLabel: "📃 Recordings",
              title: "Recordings",
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    </RecordingsContext.Provider>
  );
}
