import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "@/context/ThemeContext"; // Import your ThemeContext

export default function App() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPaired, setIsPaired] = useState(false); // Track pairing status
  const navigation = useNavigation(); // Access navigation object

  // Access theme from ThemeContext
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("ThemeContext must be used within a ThemeProvider");
  }

  const { theme } = context; // Destructure theme from context

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

  return (
    <View style={[styles.container, theme.container]}>
      <TouchableOpacity onPress={playSound} style={[styles.btn, theme.btn]}>
        <Text style={[styles.heart, theme.heart]}>❤️</Text>
      </TouchableOpacity>
      <Text style={[styles.text, theme.text]}>
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
    backgroundColor: "#fff", // Default background, will be overwritten by theme.container
  },
  heart: {
    fontSize: 100,
  },
  text: {
    fontSize: 20,
    marginTop: 20,
  },
  btn: {
    borderRadius: 100,
    padding: 20,
  },
});
