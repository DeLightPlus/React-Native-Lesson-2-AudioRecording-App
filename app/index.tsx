import AudioRecordingScreen from "@/components/AudioRecordingScreen";
import { Redirect } from "expo-router";
import { Button } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";

const Home = () => {
    return (
      <>
        <AudioRecordingScreen />
      </>
    )
  }

export default Home;