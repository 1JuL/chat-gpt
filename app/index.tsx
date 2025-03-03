import { View, Text, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";

export default function Index() {
  const router = useRouter();

  const changeScreen = () => {
    router.push("/home");
  };

  const [loaded] = useFonts({
    RalewayBold: require("../assets/fonts/raleway.bold.ttf"),
  });

  // Valor de animación para la rotación
  const spinValue = useRef(new Animated.Value(0)).current;

  // Interpolamos el valor para generar grados
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    // Animación de rotación continua
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000, // Duración de un giro completo (ajustable)
        useNativeDriver: true,
      })
    ).start();

    // Cambio de pantalla después de 2 segundos
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
      {/* Usamos Animated.Image para aplicar la transformación */}
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
  );
}
