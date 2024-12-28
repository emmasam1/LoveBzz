// ThemeContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: typeof Colors.light | typeof Colors.dark;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("isDarkMode");
      if (storedTheme !== null) {
        setIsDarkMode(storedTheme === "true");
      } else {
        const systemTheme = Appearance.getColorScheme();
        setIsDarkMode(systemTheme === "dark");
      }
    };

    const handleAppearanceChange = (
      preferences: Appearance.AppearancePreferences
    ) => {
      if (!AsyncStorage.getItem("isDarkMode")) {
        // Only update if no user preference is set
        setIsDarkMode(preferences.colorScheme === "dark");
      }
    };

    loadTheme();
    const subscription = Appearance.addChangeListener(handleAppearanceChange);

    return () => {
      subscription.remove();
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      AsyncStorage.setItem("isDarkMode", newTheme.toString());
      return newTheme;
    });
  };

  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
