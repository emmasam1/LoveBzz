import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  useColorScheme,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import HomeScreen from "@/screens/HomeScreen";
import PairDevice from "@/screens/PairDevice";
import SettingsScreen from "@/screens/SettingsScreen";

// Drawer Navigator
const Drawer = createDrawerNavigator();

function DrawerNav() {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;
  const colorScheme = useColorScheme();
  const dynamicStyles = colorScheme === "dark" ? darkStyles : lightStyles;

  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        drawerType: isLargeScreen ? "permanent" : "back",
        drawerStyle: isLargeScreen ? null : { width: "50%" },
        overlayColor: "transparent",
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Settings")} // Navigate to Settings
            // style={{ marginRight: 15 }}
            style={[styles.icon, dynamicStyles.icon]}
          >
            <AntDesign
              name="user" // Correct icon name for AntDesign
              size={24}
              style={[styles.settings, dynamicStyles.settings]} // Apply dynamic styles
            />
          </TouchableOpacity>
        ),
      })}
    >
      {/* Add screens here */}
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Drawer.Screen
        name="Pair Device"
        component={PairDevice}
        options={{ title: "Pair Device" }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings" }} // Include SettingsScreen
      />
    </Drawer.Navigator>
  );
}

// Base styles
const styles = StyleSheet.create({
  settings: {
    fontSize: 24,
  },
  icon: {
    marginHorizontal: 15,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: "black",
  },
});

// Light mode styles
const lightStyles = StyleSheet.create({
  settings: {
    color: "black",
  },
  icon: {
    borderColor: "black",
  },
});

// Dark mode styles
const darkStyles = StyleSheet.create({
  settings: {
    color: "white",
  },
  icon: {
    borderColor: "white",
  },
});

export default DrawerNav;
