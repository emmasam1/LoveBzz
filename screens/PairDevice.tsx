import React, { useRef, useState, useContext } from "react";
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
import { ThemeContext } from "@/context/ThemeContext"; // import ThemeContext

const PairDevice = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("ThemeContext must be used within a ThemeProvider");
  }

  const { theme } = context; // get the current theme from context
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

    if (value && index < otp.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpSubmit = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length === otp.length) {
      Alert.alert("OTP Entered", enteredOtp);
    } else {
      Alert.alert("Error", "Please fill all the fields.");
    }
  };

  const handleCopyToClipboard = async () => {
    await Clipboard.setStringAsync(pairCode);
    setShowTapToCopy(false);
    setIsCopied(true);

    setTimeout(() => {
      setShowTapToCopy(true);
      setIsCopied(false);
    }, 1500);
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
    <View style={[styles.container, theme.container]}>
      <Text style={[styles.title, theme.text]}>Pair Your Device</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.primaryButton, theme.primaryButton]}
          onPress={() => setShowPairingModal(true)}
        >
          <AntDesign name="qrcode" size={20} color="#fff" />
          <Text style={styles.buttonText}>Pair with QR Code</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, theme.secondaryButton]}
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
        <View style={[styles.modalOverlay, theme.modalOverlay]}>
          <View style={[styles.modalContent, theme.modalContent]}>
            <Text style={[styles.modalTitle, theme.text]}>
              Select Pairing Option
            </Text>

            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setShowPairingModal(false)}
            >
              <AntDesign name="close" size={24} style={theme.text} />
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.primaryButton, theme.primaryButton]}
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
                style={[styles.secondaryButton, theme.secondaryButton]}
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
        <View style={[styles.modalOverlay, theme.modalOverlay]}>
          <View style={[styles.modalContent, theme.modalContent]}>
            <Text style={[styles.modalTitle, theme.text]}>
              Select Pairing Option
            </Text>

            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setShowCodeOptionModal(false)}
            >
              <AntDesign name="close" size={24} style={theme.text} />
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.primaryButton, theme.primaryButton]}
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
                style={[styles.secondaryButton, theme.secondaryButton]}
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
        <View style={[styles.modalOverlay, theme.modalOverlay]}>
          <View style={[styles.modalContent, theme.modalContent]}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setShowQRModal(false)}
            >
              <AntDesign name="close" size={24} style={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, theme.text]}>Your QR Code</Text>
            {pairCode ? (
              <QRCode value="https://example.com/pair" size={width * 0.5} />
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
        style={styles.modalColor}
      >
        <View style={[styles.modalOverlay, theme.modalOverlay]}>
          <View style={[styles.modalContent, theme.modalContent]}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setEnterCode(false)}
            >
              <AntDesign name="close" size={24} style={theme.text} />
            </TouchableOpacity>

            <Text style={[styles.modalTitle, theme.text]}>Enter Code</Text>

            <View style={styles.otpContainer}>
              {otp.map((value, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (otpRefs.current[index] = ref)}
                  style={[styles.otpInput, theme.inputBackground]}
                  maxLength={1}
                  keyboardType="numeric"
                  value={value}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  autoFocus={index === 0}
                />
              ))}
            </View>
            <TouchableOpacity
              style={[styles.submitButton, theme.submitButton]}
              onPress={handleOtpSubmit}
            >
              <Text style={styles.buttonText}>Submit OTP</Text>
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
        <View style={[styles.modalOverlay, theme.modalOverlay]}>
          <View style={[styles.modalContent, theme.modalContent]}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setShowCodeModal(false)}
            >
              <AntDesign name="close" size={24} style={theme.text} />
            </TouchableOpacity>

            <Text style={[styles.modalTitle, theme.text]}>Your Code</Text>

            <TouchableOpacity onPress={handleCopyToClipboard}>
              <Text style={[styles.generatedCode, theme.text]}>
                {pairCode || "Generating..."}
              </Text>
            </TouchableOpacity>

            {/* Show "Tap to Copy" or "Copied" */}
            {showTapToCopy && (
              <Text style={[styles.copiedTooltip, theme.text]}>
                Tap to Copy
              </Text>
            )}
            {isCopied && (
              <View style={styles.copiedTooltip}>
                <Text style={[styles.tooltipText, theme.text]}>Copied</Text>
              </View>
            )}
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
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#3498db",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#2ecc71",
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(0, 0, 0, 0.7)",
    // position: "absolute",
    // top: 0, // Adjust top for status bar height
    // left: 0,
    // right: 0,
    // bottom: 0,
    // zIndex: 9999,
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    borderWidth: 1,
    margin: 5,
  },
  submitButton: {
    backgroundColor: "#3498db",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  camera: {
    flex: 1,
    width: "100%",
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
  copiedTooltip: {
    position: "absolute",
    bottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  tooltipText: {
    fontSize: 12,
  },
  // otpContainer: {
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   marginBottom: 20,
  // },
  // otpInput: {
  //   width: 40,
  //   height: 50,
  //   borderWidth: 1,
  //   borderColor: "#ccc",
  //   borderRadius: 5,
  //   textAlign: "center",
  //   fontSize: 18,
  //   marginHorizontal: 5,
  //   color: "#2c3e50",
  //},
  generatedCode: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#34495e",
    marginBottom: 50,
  },
  modalColor: {
    backgroundColor: "red",
  },
});

export default PairDevice;
