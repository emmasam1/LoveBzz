import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";

export default function App() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPaired, setIsPaired] = useState(false); // Track pairing status
  const navigation = useNavigation(); // Access navigation object

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
    <View style={styles.container}>
      <TouchableOpacity onPress={playSound} style={styles.btn}>
        <Text style={styles.heart}>❤️</Text>
      </TouchableOpacity>
      <Text style={styles.text}>
        {isPaired
          ? "Tap the heart to play sound!"
          : "Please pair your device to play the sound."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  heart: {
    fontSize: 100,
    color: "red",
  },
  text: {
    fontSize: 20,
    marginTop: 20,
  },
  btn: {
    borderRadius: 100, // Fixed border radius syntax
    backgroundColor: "#f2f2f2",
    padding: 20,
  },
});
