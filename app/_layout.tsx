import React from 'react';
import { Stack } from 'expo-router';
import RecordingProvider from '@/context/RecordingsContext';  // Import your context provider
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DrawerLayout from './(app)/_layout';

export default function AppLayout() {
  return (
    <RecordingProvider> {/* Make sure to wrap your app with the provider */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>        
            <Stack.Screen name="(app)" 
              options={{ headerShown: false,  title: "🎙️ Recorder " }}  /> 
            <Stack.Screen name="playback/[id]" 
              options={{ headerShown: true, title:`🎧`}}  />
        </Stack>
      </GestureHandlerRootView>
    </RecordingProvider>
  );
}
