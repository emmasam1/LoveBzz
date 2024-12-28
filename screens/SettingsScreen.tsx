import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useTheme } from "@/context/ThemeContext";

// const useThemeColor = () => {
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const toggleTheme = () => setIsDarkMode((prev) => !prev);

//   return { isDarkMode, toggleTheme };
// };

const SettingsScreen = () => {
  // const { isDarkMode, toggleTheme } = useThemeColor(); // Access theme state and toggle function
  // const dynamicStyles = isDarkMode ? darkStyles : lightStyles;

  const { isDarkMode, toggleTheme } = useTheme();
  const dynamicStyles = isDarkMode ? darkStyles : lightStyles;

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] =
    useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] =
    useState(false);
  const [promotionalNotificationsEnabled, setPromotionalNotificationsEnabled] =
    useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleLoginSignup = () => {
    console.log("Navigate to Login or Sign Up screen");
    // Add your navigation logic here
  };

  const handleRemoveAds = () => {
    console.log("Remove Ads clicked");
    // Implement functionality for removing ads
  };

  const handleSubscribePremium = () => {
    console.log("Subscribe to Premium clicked");
    // Implement functionality for subscribing to premium
  };

  const handleFeedbackSubmit = () => {
    console.log("Feedback submitted:", feedback);
    setFeedbackModalVisible(false);
    setFeedback("");
  };

  return (
    <View style={[baseStyles.container, dynamicStyles.container]}>
      <TouchableOpacity
        style={[baseStyles.option, dynamicStyles.option]}
        onPress={handleRemoveAds}
      >
        <Text style={[baseStyles.optionText, dynamicStyles.text]}>
          Remove Ads
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[baseStyles.option, dynamicStyles.option]}
        onPress={handleSubscribePremium}
      >
        <Text style={[baseStyles.optionText, dynamicStyles.text]}>
          Subscribe to Premium
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[baseStyles.option, dynamicStyles.option]}
        onPress={() => setFeedbackModalVisible(true)}
      >
        <Text style={[baseStyles.optionText, dynamicStyles.text]}>
          Provide Feedback
        </Text>
      </TouchableOpacity>

      <View style={[baseStyles.option, dynamicStyles.option]}>
        <Text style={[baseStyles.optionText, dynamicStyles.text]}>
          Notifications
        </Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          thumbColor={isDarkMode ? "#4B9CD3" : "#FFFFFF"}
          trackColor={{ false: "#E5E5E5", true: "#4B9CD3" }}
        />
      </View>

      {notificationsEnabled && (
        <>
          <View style={[baseStyles.option, dynamicStyles.option]}>
            <Text style={[baseStyles.optionText, dynamicStyles.text]}>
              Push Notifications
            </Text>
            <Switch
              value={pushNotificationsEnabled}
              onValueChange={setPushNotificationsEnabled}
              thumbColor={isDarkMode ? "#4B9CD3" : "#FFFFFF"}
              trackColor={{ false: "#E5E5E5", true: "#4B9CD3" }}
            />
          </View>

          <View style={[baseStyles.option, dynamicStyles.option]}>
            <Text style={[baseStyles.optionText, dynamicStyles.text]}>
              Email Notifications
            </Text>
            <Switch
              value={emailNotificationsEnabled}
              onValueChange={setEmailNotificationsEnabled}
              thumbColor={isDarkMode ? "#4B9CD3" : "#FFFFFF"}
              trackColor={{ false: "#E5E5E5", true: "#4B9CD3" }}
            />
          </View>

          <View style={[baseStyles.option, dynamicStyles.option]}>
            <Text style={[baseStyles.optionText, dynamicStyles.text]}>
              Promotional Notifications
            </Text>
            <Switch
              value={promotionalNotificationsEnabled}
              onValueChange={setPromotionalNotificationsEnabled}
              thumbColor={isDarkMode ? "#4B9CD3" : "#FFFFFF"}
              trackColor={{ false: "#E5E5E5", true: "#4B9CD3" }}
            />
          </View>
        </>
      )}

      <TouchableOpacity
        style={[baseStyles.button, dynamicStyles.button]}
        onPress={handleLoginSignup}
      >
        <Text style={baseStyles.buttonText}>Login or Sign Up</Text>
      </TouchableOpacity>

      <Modal
        visible={feedbackModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFeedbackModalVisible(false)}
      >
        <View style={baseStyles.modalOverlay}>
          <View style={[baseStyles.modalContent, dynamicStyles.option]}>
            <TouchableOpacity
              style={baseStyles.closeButton}
              onPress={() => setFeedbackModalVisible(false)}
            >
              <Ionicons
                name="close"
                size={24}
                color={isDarkMode ? "#E5E5E5" : "#2A4D69"}
              />
            </TouchableOpacity>
            <Text style={[baseStyles.optionText, dynamicStyles.text]}>
              Your Feedback
            </Text>
            <TextInput
              style={[baseStyles.feedbackInput, dynamicStyles.text]}
              placeholder="Write your feedback here..."
              placeholderTextColor={isDarkMode ? "#E5E5E5" : "#999"}
              multiline
              value={feedback}
              onChangeText={setFeedback}
            />
            <TouchableOpacity
              style={[baseStyles.button, baseStyles.submitButton]}
              onPress={handleFeedbackSubmit}
            >
              <Text style={baseStyles.buttonText}>Submit Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={[baseStyles.option, dynamicStyles.option]}>
        <Text style={[baseStyles.optionText, dynamicStyles.text]}>
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme} // Use global toggle function
          thumbColor={isDarkMode ? "#4B9CD3" : "#FFFFFF"}
          trackColor={{ false: "#E5E5E5", true: "#4B9CD3" }}
        />
      </View>
    </View>
  );
};

const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    elevation: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
  },
  button: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#4B9CD3",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  feedbackInput: {
    height: 150,
    borderColor: "#E5E5E5",
    borderWidth: 1,
    marginVertical: 25,
    padding: 10,
    textAlignVertical: "top",
    width: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
  },
  text: {
    color: "#2A4D69",
  },
  option: {
    backgroundColor: "#F7F7F7",
    borderColor: "#E5E5E5",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#1abc9c",
  },
});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
  },
  text: {
    color: "#E5E5E5",
  },
  option: {
    backgroundColor: "#343131",
    borderColor: "#333333",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#343131",
  },
});

export default SettingsScreen;
