import { View, Text, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";

export default function Index() {
  const router = useRouter();

  const changeScreen = () => {
    router.push("/navbuttons");
  };

  const [loaded] = useFonts({
    RalewayBold: require("../assets/fonts/raleway.bold.ttf"),
  });

  const spinValue = useRef(new Animated.Value(0)).current;

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    setTimeout(() => {
      changeScreen();
    }, 2000);
  }, []);

  return (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#202123",
          gap: 20,
        }}
      >
        <Animated.Image
          source={require("../assets/images/chat-icon.png")}
          style={{
            transform: [{ rotate: spin }],
          }}
        />
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 42,
            fontFamily: "RalewayBold",
          }}
        >
          ChatGPT
        </Text>
      </View>
    </>
  );
}
