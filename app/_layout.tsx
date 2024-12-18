import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";
import DrawerNav from "@/navigation/DrawerNav";
import OnboardingScreen from "@/screens/OnboardingScreen";

export default function RootLayout() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const completed = await AsyncStorage.getItem("onboardingComplete");
      setIsOnboardingComplete(completed === "true");
    };
    checkOnboardingStatus();
  }, []);

  const handleOnboardingComplete = () => {
    setIsOnboardingComplete(true); // Mark onboarding as complete
  };

  if (isOnboardingComplete === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#304FFE" />
      </View>
    );
  }

  return isOnboardingComplete ? (
    <DrawerNav />
  ) : (
    <OnboardingScreen onComplete={handleOnboardingComplete} />
  );
}
