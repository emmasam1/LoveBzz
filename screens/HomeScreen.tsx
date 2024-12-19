import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useColorScheme,
} from "react-native";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";

export default function App() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPaired, setIsPaired] = useState(false); // Track pairing status
  const navigation = useNavigation(); // Access navigation object
  const colorScheme = useColorScheme(); // Get system color scheme (light/dark)

  // Function to play sound
  const playSound = async () => {
    if (!isPaired) {
      // If not paired, navigate to pairing screen
      navigation.navigate("Pair Device");
      return;
    }

    if (!sound) {
      try {
        // Load the sound if not already loaded
        const { sound: newSound } = await Audio.Sound.createAsync(
          require("../assets/sounds/heart-beat.mp3")
        );
        setSound(newSound);

        // Play the sound
        await newSound.playAsync();

        // Unload the sound after it finishes playing
        newSound.setOnPlaybackStatusUpdate(async (status) => {
          if (status.isLoaded && status.didJustFinish) {
            await newSound.unloadAsync();
            setSound(null);
          }
        });
      } catch (error) {
        console.error("Error loading or playing sound:", error);
      }
    } else {
      try {
        // Replay the sound if it was already loaded
        await sound.replayAsync();
      } catch (error) {
        console.error("Error replaying sound:", error);
      }
    }
  };

  // Styles for light and dark mode
  const dynamicStyles = colorScheme === "dark" ? darkStyles : lightStyles;

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <TouchableOpacity
        onPress={playSound}
        style={[styles.btn, dynamicStyles.btn]}
      >
        <Text style={[styles.heart, dynamicStyles.heart]}>❤️</Text>
      </TouchableOpacity>
      <Text style={[styles.text, dynamicStyles.text]}>
        {isPaired
          ? "Tap the heart to play sound!"
          : "Please pair your device to send a buzz."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heart: {
    fontSize: 100,
  },
  text: {
    fontSize: 20,
    marginTop: 20,
  },
  btn: {
    borderRadius: 100, // Fixed border radius syntax
    padding: 20,
  },
});

// Light mode styles
const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  heart: {
    color: "red",
  },
  text: {
    color: "#000",
  },
  btn: {
    backgroundColor: "#f2f2f2",
  },
});

// Dark mode styles
const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
  },
  heart: {
    color: "#ff6b6b",
  },
  text: {
    color: "#fff",
  },
  btn: {
    backgroundColor: "#333",
  },
});
