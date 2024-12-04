import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { createContext, useState } from "react";
import RecordingProvider from "@/context/RecordingsContext";

// Context to share recordings state
// export const RecordingsContext = createContext();

export default function Layout() { 

  return (

    <RecordingProvider>
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
            name="[recordings]/index"
            options={{
              drawerLabel: "📼 Recordings",
              title: "Recordings",
            }}
          />
          <Drawer.Screen
            name="[playback]/index"
            options={{
              drawerLabel: "🎧 Playback",
              title: "Playback",
            }}
          />
          <Drawer.Screen
            name="settings"
            options={{
              drawerLabel: "⚙ Settings",
              title: "Playback",
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    </RecordingProvider>
      
    
  );
}
