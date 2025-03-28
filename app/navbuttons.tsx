import { useRouter } from "expo-router";
import { View, Button } from "react-native";
import React from "react";

export default function Navbuttons() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#343541",
        gap: 20,
      }}
    >
      <Button title="Dashboard" onPress={() => router.push("/dashboard")} />
      <Button title="Welcome" onPress={() => router.push("/welcome")} />
      <Button title="SplashScreen" onPress={() => router.push("/")} />
      <Button title="Chat" onPress={() => router.push("/chat")} />
      <Button title="Login" onPress={() => router.push("/login")} />
      <Button title="Signup" onPress={() => router.push("/signup")} />
      <Button title="Home" onPress={() => router.push("/home")} />
    </View>
  );
}
