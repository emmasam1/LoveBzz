import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  TextInput,
  Modal,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for close button

const SettingsScreen = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
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

  const handleNotificationsToggle = (value: boolean) => {
    setNotificationsEnabled(value);
    console.log("Notifications toggled:", value);
    // Implement functionality for notifications toggle
  };

  const handlePushNotificationsToggle = (value: boolean) => {
    setPushNotificationsEnabled(value);
    console.log("Push Notifications toggled:", value);
    // Implement functionality for push notifications toggle
  };

  const handleEmailNotificationsToggle = (value: boolean) => {
    setEmailNotificationsEnabled(value);
    console.log("Email Notifications toggled:", value);
    // Implement functionality for email notifications toggle
  };

  const handlePromotionalNotificationsToggle = (value: boolean) => {
    setPromotionalNotificationsEnabled(value);
    console.log("Promotional Notifications toggled:", value);
    // Implement functionality for promotional notifications toggle
  };

  const handleFeedbackSubmit = () => {
    console.log("Feedback submitted:", feedback);
    // Here you can send the feedback to an API or store it locally
    setFeedbackModalVisible(false);
    setFeedback(""); // Clear the feedback text after submission
  };

  return (
    <View style={[baseStyles.container, dynamicStyles.container]}>
      {/* Remove Ads Option */}
      <TouchableOpacity
        style={[baseStyles.option, dynamicStyles.option]}
        onPress={handleRemoveAds}
      >
        <Text style={[baseStyles.optionText, dynamicStyles.text]}>
          Remove Ads
        </Text>
      </TouchableOpacity>

      {/* Subscribe to Premium */}
      <TouchableOpacity
        style={[baseStyles.option, dynamicStyles.option]}
        onPress={handleSubscribePremium}
      >
        <Text style={[baseStyles.optionText, dynamicStyles.text]}>
          Subscribe to Premium
        </Text>
      </TouchableOpacity>

      {/* Notification Settings */}
      <View style={[baseStyles.option, dynamicStyles.option]}>
        <Text style={[baseStyles.optionText, dynamicStyles.text]}>
          Notifications
        </Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleNotificationsToggle}
          thumbColor={isDarkMode ? "#4B9CD3" : "#FFFFFF"}
          trackColor={{ false: "#E5E5E5", true: "#4B9CD3" }}
        />
      </View>

      {/* Push Notifications */}
      {notificationsEnabled && (
        <View style={[baseStyles.option, dynamicStyles.option]}>
          <Text style={[baseStyles.optionText, dynamicStyles.text]}>
            Push Notifications
          </Text>
          <Switch
            value={pushNotificationsEnabled}
            onValueChange={handlePushNotificationsToggle}
            thumbColor={isDarkMode ? "#4B9CD3" : "#FFFFFF"}
            trackColor={{ false: "#E5E5E5", true: "#4B9CD3" }}
          />
        </View>
      )}

      {/* Email Notifications */}
      {notificationsEnabled && (
        <View style={[baseStyles.option, dynamicStyles.option]}>
          <Text style={[baseStyles.optionText, dynamicStyles.text]}>
            Email Notifications
          </Text>
          <Switch
            value={emailNotificationsEnabled}
            onValueChange={handleEmailNotificationsToggle}
            thumbColor={isDarkMode ? "#4B9CD3" : "#FFFFFF"}
            trackColor={{ false: "#E5E5E5", true: "#4B9CD3" }}
          />
        </View>
      )}

      {/* Promotional Notifications */}
      {notificationsEnabled && (
        <View style={[baseStyles.option, dynamicStyles.option]}>
          <Text style={[baseStyles.optionText, dynamicStyles.text]}>
            Promotional Notifications
          </Text>
          <Switch
            value={promotionalNotificationsEnabled}
            onValueChange={handlePromotionalNotificationsToggle}
            thumbColor={isDarkMode ? "#4B9CD3" : "#FFFFFF"}
            trackColor={{ false: "#E5E5E5", true: "#4B9CD3" }}
          />
        </View>
      )}

      {/* Feedback Button */}
      <TouchableOpacity
        style={[baseStyles.option, dynamicStyles.option]}
        onPress={() => setFeedbackModalVisible(true)}
      >
        <Text style={[baseStyles.optionText, dynamicStyles.text]}>
          Provide Feedback
        </Text>
      </TouchableOpacity>

      {/* Login or Sign Up */}
      <TouchableOpacity style={baseStyles.button} onPress={handleLoginSignup}>
        <Text style={baseStyles.buttonText}>Login or Sign Up</Text>
      </TouchableOpacity>

      {/* Feedback Modal */}
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
    </View>
  );
};

// Base styles shared by light and dark modes
const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  option: {
    flexDirection: "column", // This ensures vertical stacking of content
    justifyContent: "flex-start", // Aligns the elements to the top
    alignItems: "stretch", // Ensures elements take the full width
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
    backgroundColor: "#4B9CD3",
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
    position: "relative",
    bottom: 0,
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
    flexDirection: "column", // Ensure content inside modal is stacked vertically
    justifyContent: "flex-start",
    alignItems: "stretch", // Stretch elements to take the full width
  },
  feedbackInput: {
    height: 150,
    borderColor: "#E5E5E5",
    borderWidth: 1,
    marginVertical: 25,
    padding: 10,
    textAlignVertical: "top",
    width: "100%", // Ensures the input takes up full width
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

const lightStyles = StyleSheet.create({
  container: {
    ...baseStyles.container,
    backgroundColor: "#FFFFFF",
  },
  text: {
    color: "#2A4D69",
  },
  option: {
    ...baseStyles.option,
    backgroundColor: "#F7F7F7",
    borderColor: "#E5E5E5",
    borderWidth: 1,
  },
});

const darkStyles = StyleSheet.create({
  container: {
    ...baseStyles.container,
    backgroundColor: "#121212",
  },
  text: {
    color: "#E5E5E5",
  },
  option: {
    ...baseStyles.option,
    backgroundColor: "#1E1E1E",
    borderColor: "#333333",
    borderWidth: 1,
  },
});

export default SettingsScreen;
