import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AnimatedGradientBackground from "@/utils/AnimatedGradientBackground";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const changeScreen = () => {
    router.replace("/dashboard");
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
      Toast.show({
        type: "success",
        text1: "Inicio de sesión exitoso",
        text2: "Bienvenido de nuevo",
      });
      setTimeout(() => {
        changeScreen();
      }, 1500);
    } catch (error: any) {
      console.log({ error });
      Toast.show({
        type: "error",
        text1: "Error al iniciar sesión",
        text2: error.message || "Ocurrió un error durante el inicio de sesión.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <View style={{ flex: 1 }}>
        <AnimatedGradientBackground />
        <View style={styles.container}>
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="white"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <TextInput
              secureTextEntry
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="white"
              textContentType="password"
              value={password}
              onChangeText={setPassword}
            />

            <View style={styles.divider} />

            <TouchableOpacity
              style={[styles.logInButton, loading && { opacity: 0.6 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.logInText}>Log in</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Toast />
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
    gap: 15,
  },
  input: {
    width: "90%",
    height: 45,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: "#333",
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
