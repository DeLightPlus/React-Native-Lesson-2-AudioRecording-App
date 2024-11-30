// app/AudioRecordingScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

export default function AudioRecordingScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<{ uri: string; date: Date }[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Request permission for audio recording on mount
  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access microphone is required!');
      }
    };

    getPermissions();
  }, []);

  // Start recording
  const startRecording = async () => {
    try {
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  // Stop recording and save the file
  const stopRecording = async () => {
    try {
      await recording?.stopAndUnloadAsync();
      const uri = recording?.getURI();
      setRecordings((prev) => [...prev, { uri: uri!, date: new Date() }]);
      setRecording(null);
      setIsRecording(false);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  // Play recording
  const playRecording = async (uri: string) => {
    const { sound } = await Audio.Sound.createAsync({ uri });
    setSound(sound);
    await sound.playAsync();
  };

  return (
    <View style={styles.container}>    
      <Button title="Recordings" onPress={() => navigation.navigate("recordings")}/>
          
      <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? stopRecording : startRecording}
      />
      
      <View style={styles.recordingsList}>
        {recordings.map((recording, index) => (
          <View key={index} style={styles.recordingItem}>
            <Text>{recording.date.toLocaleString()}</Text>
            <Button title="Play" onPress={() => playRecording(recording.uri)} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  recordingsList: {
    marginTop: 20,
  },
  recordingItem: {
    marginBottom: 10,
  },
});
