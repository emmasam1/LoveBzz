import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { CameraView, useCameraPermissions } from "expo-camera";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

const PairDevice = () => {
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showCodeOptionModal, setShowCodeOptionModal] = useState(false);
  const [pairCode, setPairCode] = useState(null);
  const [enterCode, setEnterCode] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCopied, setIsCopied] = useState(false);
  const [showTapToCopy, setShowTapToCopy] = useState(true);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);

  const handleOtpChange = (value, index) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Automatically move to the next field when a character is entered
    if (value && index < otp.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpSubmit = () => {
    const enteredOtp = otp.join(""); // Combine OTP inputs into a single string
    if (enteredOtp.length === otp.length) {
      Alert.alert("OTP Entered", enteredOtp);
    } else {
      Alert.alert("Error", "Please fill all the fields.");
    }
  };

  const handleCopyToClipboard = async () => {
    await Clipboard.setStringAsync(pairCode); // Copy the code to clipboard

    // Hide "Tap to Copy" and show "Copied"
    setShowTapToCopy(false);
    setIsCopied(true);

    // Reset the states after a delay
    setTimeout(() => {
      setShowTapToCopy(true); // Show "Tap to Copy" again for future interactions
      setIsCopied(false);
    }, 1500); // 1.5 seconds delay
  };

  const { width } = Dimensions.get("window");

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setPairCode(code);
  };

  const handleRequestPermission = async () => {
    if (!permission || permission.status !== "granted") {
      const response = await requestPermission();
      if (response.status === "granted") {
        setShowCamera(true);
      } else {
        Alert.alert(
          "Permission Denied",
          "Camera access is required to scan the QR code."
        );
      }
    } else {
      setShowCamera(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pair Your Device</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setShowPairingModal(true)}
        >
          <AntDesign name="qrcode" size={20} color="#fff" />
          <Text style={styles.buttonText}>Pair with QR Code</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setShowCodeOptionModal(true)}
        >
          <AntDesign name="key" size={20} color="#fff" />
          <Text style={styles.buttonText}>Pair With Code</Text>
        </TouchableOpacity>
      </View>

      {/* QR Code Options Modal */}
      <Modal
        visible={showPairingModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPairingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Pairing Option</Text>

            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setShowPairingModal(false)}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  generateCode();
                  setShowPairingModal(false);
                  setShowQRModal(true);
                }}
              >
                <AntDesign name="qrcode" size={20} color="#fff" />
                <Text style={styles.buttonText}>Generate QR Code</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  setShowPairingModal(false);
                  setShowCamera(true);
                  handleRequestPermission();
                }}
              >
                <AntDesign name="scan1" size={20} color="#fff" />
                <Text style={styles.buttonText}>Scan Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Code Options Modal */}
      <Modal
        visible={showCodeOptionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCodeOptionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Pairing Option</Text>

            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setShowCodeOptionModal(false)}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  generateCode();
                  setShowCodeOptionModal(false);
                  setShowCodeModal(true);
                }}
              >
                <MaterialIcons name="text-fields" size={20} color="#fff" />
                <Text style={styles.buttonText}>Generate Code</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  setShowCodeOptionModal(false);
                  setEnterCode(true);
                }}
              >
                <AntDesign name="form" size={20} color="#fff" />
                <Text style={styles.buttonText}>Enter Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* QR Modal */}
      <Modal
        visible={showQRModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setShowQRModal(false)}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Your QR Code</Text>
            {pairCode ? (
              <QRCode value="https://example.com/pair" size={width * 0.6} />
            ) : (
              <Text>Generating QR Code...</Text>
            )}
          </View>
        </View>
      </Modal>

      {/* OTP Modal */}
      <Modal
        visible={enterCode}
        transparent
        animationType="slide"
        onRequestClose={() => setEnterCode(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setEnterCode(false)}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Enter Code</Text>

            <View style={styles.otpContainer}>
              {otp.map((value, index) => (
                <TextInput
                  key={index}
                  style={styles.otpInput}
                  value={value}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  maxLength={1} // Restrict each field to 1 character
                  keyboardType="default" // Allow alphanumeric input
                  autoCapitalize="characters" // Automatically capitalize input
                  ref={(ref) => (otpRefs.current[index] = ref)} // Assign ref to each input
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleOtpSubmit}
            >
              <MaterialIcons name="send" size={20} color="#fff" />
              <Text style={styles.buttonText}>Send OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Generate Code Modal */}
      <Modal
        visible={showCodeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCodeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setShowCodeModal(false)}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Your Code</Text>

            <TouchableOpacity onPress={handleCopyToClipboard}>
              <Text style={styles.generatedCode}>
                {pairCode || "Generating..."}
              </Text>
            </TouchableOpacity>

            {/* Show "Tap to Copy" or "Copied" */}
            {showTapToCopy && (
              <Text style={styles.copiedTooltip}>Tap to Copy</Text>
            )}
            {isCopied && (
              <View style={styles.copiedTooltip}>
                <Text style={styles.tooltipText}>Copied</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Enter Code Modal */}
      <Modal
        visible={showCodeInput}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCodeInput(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setShowCodeInput(false)}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Enter Pairing Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter code"
              value={inputCode}
              onChangeText={setInputCode}
            />
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                Alert.alert("Code Entered", inputCode);
                setShowCodeInput(false);
              }}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Camera Modal */}
      <Modal
        visible={showCamera}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCamera(false)}
      >
        <View style={styles.modalContainer}>
          {Platform.OS === "android" ? <StatusBar hidden /> : null}
          <CameraView
            style={styles.camera}
            onBarcodeScanned={({ data }) => {
              Alert.alert("QR Code Scanned", data);
              setShowCamera(false);
            }}
          >
            <View style={styles.overlayContainer}>
              <View style={styles.overlay} />
              <View style={styles.middleRow}>
                <View style={styles.overlay} />
                <View style={styles.scanArea} />
                <View style={styles.overlay} />
              </View>
              <View style={styles.overlay} />
            </View>
          </CameraView>
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => setShowCamera(false)}
          >
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#2c3e50",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1abc9c",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    color: "#2c3e50",
  },
  generatedCode: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#34495e",
    marginBottom: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: "100%",
    marginVertical: 10,
    fontSize: 16,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  overlayContainer: {
    flex: 1,
    position: "relative",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  middleRow: {
    flexDirection: "row",
  },
  scanArea: {
    width: "70%",
    height: 350,
    borderColor: "white",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  copiedTooltip: {
    position: "absolute",
    bottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  tooltipText: {
    fontSize: 12,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  otpInput: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "center",
    fontSize: 18,
    marginHorizontal: 5,
    color: "#2c3e50",
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1abc9c",
    padding: 10,
    borderRadius: 8,
    // flex: 1,
    // marginHorizontal: 2,
  },
});

export default PairDevice;
