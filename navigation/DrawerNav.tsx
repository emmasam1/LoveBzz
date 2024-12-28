import React, { useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import HomeScreen from "@/screens/HomeScreen";
import PairDevice from "@/screens/PairDevice";
import SettingsScreen from "@/screens/SettingsScreen";
import { ThemeContext } from "@/context/ThemeContext"; // Import the useTheme hook

// Drawer Navigator
const Drawer = createDrawerNavigator();

function DrawerNav() {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;

  // Access theme from ThemeContext
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("ThemeContext must be used within a ThemeProvider");
  }

  const { theme } = context; // Destructure theme from context

  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        drawerType: isLargeScreen ? "permanent" : "back",
        drawerStyle: isLargeScreen ? null : { width: "50%" },
        overlayColor: "transparent",
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Settings")} // Navigate to Settings
            style={[styles.icon, theme.icon]}
          >
            <AntDesign
              name="user" // Correct icon name for AntDesign
              size={24}
              style={[styles.settings, theme.settings]} // Apply dynamic styles
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

// // Light mode styles
// const lightStyles = StyleSheet.create({
//   settings: {
//     color: "black",
//   },
//   icon: {
//     borderColor: "black",
//   },
// });

// // Dark mode styles
// const darkStyles = StyleSheet.create({
//   settings: {
//     color: "white",
//   },
//   icon: {
//     borderColor: "white",
//   },
// });

export default DrawerNav;
