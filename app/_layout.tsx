import React, { useState, useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import DrawerNav from "@/navigation/DrawerNav";
import OnboardingScreen from "@/screens/OnboardingScreen";
import { useColorScheme } from "@/hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Quicksand: require("../assets/fonts/Quicksand-VariableFont_wght.ttf"),
  });

  // Onboarding state
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<
    null | boolean
  >(null);

  // Handle Splash Screen
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {
        console.warn("SplashScreen.hideAsync failed");
      });
    }
  }, [fontsLoaded]);

  // Check onboarding status
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const completed = await AsyncStorage.getItem("onboardingComplete");
      setIsOnboardingComplete(completed === "true");
    };
    checkOnboardingStatus();
  }, []);

  // Onboarding complete handler
  const handleOnboardingComplete = () => {
    setIsOnboardingComplete(true);
  };

  // If fonts are not loaded, show nothing
  if (!fontsLoaded || isOnboardingComplete === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#304FFE" />
      </View>
    );
  }

  // Render App
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {/* StatusBar always rendered */}
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      {/* Conditional navigation */}
      {isOnboardingComplete ? (
        <DrawerNav />
      ) : (
        <OnboardingScreen
          onComplete={handleOnboardingComplete}
          theme={colorScheme === "dark" ? DarkTheme : DefaultTheme} // Pass theme to OnboardingScreen
        />
      )}
    </ThemeProvider>
  );
}
