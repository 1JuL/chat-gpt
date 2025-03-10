import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import AnimatedGradientBackground from "@/utils/AnimatedGradientBackground";

export default function Home() {
  const router = useRouter();
  const goto_signup = () => {
    router.push("/signup");
  };

  const goto_login = () => {
    router.push("/login");
  };

  return (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      <View style={{ flex: 1 }}>
        <AnimatedGradientBackground />

        <View style={styles.container}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.googleButton}>
              <FontAwesome name="google" size={18} color="black" style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signUpButton} onPress={goto_signup}>
              <Text style={styles.signUpText}>Sign up</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.logInButton} onPress={goto_login}>
              <Text style={styles.logInText}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#000",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 20,
    alignItems: "center",
    paddingHorizontal: 20,
    position: "absolute",
    bottom: 0,
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  signUpButton: {
    backgroundColor: "#333",
    paddingVertical: 12,
    borderRadius: 25,
    width: "90%",
    alignItems: "center",
    marginTop: 15,
  },
  signUpText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  divider: {
    width: "80%",
    height: 1,
    backgroundColor: "#777",
    marginVertical: 15,
  },
  logInButton: {
    width: "90%",
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#fff",
    alignItems: "center",
  },
  logInText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
