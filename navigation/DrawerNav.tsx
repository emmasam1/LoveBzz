import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import HomeScreen from "@/screens/HomeScreen";
import PairDevice from "@/screens/PairDevice";


// Drawer Navigator
const Drawer = createDrawerNavigator();

function DrawerNav() {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: isLargeScreen ? "permanent" : "back",
        drawerStyle: isLargeScreen ? null : { width: "50%" },
        overlayColor: "transparent",
      }}
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
    </Drawer.Navigator>
  );
}

// Basic styles
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default DrawerNav;
