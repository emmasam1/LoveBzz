import React, { useState, useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import DrawerNav from "@/navigation/DrawerNav";
import OnboardingScreen from "@/screens/OnboardingScreen";
import { ThemeProvider, useTheme } from "@/context/ThemeContext"; // Custom ThemeContext
import AsyncStorage from "@react-native-async-storage/async-storage";
import { tokenCache } from "@/cache";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env");
  }

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

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <ThemeProvider>
          <RootApp
            isOnboardingComplete={isOnboardingComplete}
            handleOnboardingComplete={handleOnboardingComplete}
          />
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

function RootApp({
  isOnboardingComplete,
  handleOnboardingComplete,
}: {
  isOnboardingComplete: boolean;
  handleOnboardingComplete: () => void;
}) {
  const { theme, isDarkMode } = useTheme(); // Get theme and mode from ThemeContext

  return (
    <NavigationThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      {isOnboardingComplete ? (
        <DrawerNav />
      ) : (
        <OnboardingScreen onComplete={handleOnboardingComplete} theme={theme} />
      )}
    </NavigationThemeProvider>
  );
}
