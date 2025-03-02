import { View, Image, Text } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";

export default function splashscreen() {
  const router = useRouter();

  const changeScreen = () => {
    router.push("/");
  };

  const [loaded] = useFonts({
    Raleway: require("../assets/fonts/raleway.semibold.ttf"),
  });

  useEffect(() => {
    setTimeout(() => {
      changeScreen();
    }, 2000);
  }, []);

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
      <Image source={require("../assets/images/chat-icon.png")} />
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 42,
          fontFamily: "Raleway",
        }}
      >
        ChatGPT
      </Text>
    </View>
  );
}
