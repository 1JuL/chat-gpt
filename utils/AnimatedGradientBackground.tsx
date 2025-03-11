import React, { useState, useRef, useEffect } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const COLOR_PAIRS = [
  ["#FFDEE9", "#B5FFFC"],
  ["#D5FFD5", "#FFC2E2"],
  ["#FBC2EB", "#A6C1EE"],
  ["#f6d365", "#fda085"],
  ["#667eea", "#764ba2"],
  ["#5A3F37", "#2C7744"],
];

export default function AnimatedGradientBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
    }).start(() => {
      setCurrentIndex(nextIndex);
      setNextIndex((nextIndex + 1) % COLOR_PAIRS.length);
      fadeAnim.setValue(0);
    });
  }, [currentIndex, nextIndex]);

  const currentColors = COLOR_PAIRS[currentIndex];
  const nextColors = COLOR_PAIRS[nextIndex];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[currentColors[0], currentColors[1]]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <Animated.View style={[StyleSheet.absoluteFill, { opacity: 1 }]}>
        <LinearGradient
          colors={[nextColors[0], nextColors[1]]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
