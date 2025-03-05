import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import styles from "../styles/WelcomeStyles";

export default function Welcome() {
  const [loaded] = useFonts({
    Raleway: require("../assets/fonts/raleway.semibold.ttf"),
    RalewayBold: require("../assets/fonts/raleway.bold.ttf"),
  });

  const exampleSets = [
    {
      title: "Examples",
      examples: [
        '"Explain quantum computing in simple terms"',
        '"Got any creative ideas for a 10 year old’s birthday?"',
        '"How do I make an HTTP request in JavaScript?"',
      ],
    },
    {
      title: "Capabilities",
      examples: [
        "Remembers what user said earlier in the conversation",
        "Allows user to provide follow-up corrections",
        "Trained to decline inappropriate requests",
      ],
    },
    {
      title: "Limitations",
      examples: [
        "May occasionally generate incorrect information",
        "May occasionally produce harmful instructions or biased content",
        "Limited knowledge of world and events after 2021",
      ],
    },
  ];

  const exampleIcons: ("weather-sunny" | "lightning-bolt" | "alert-outline")[] = [
    "weather-sunny",
    "lightning-bolt",
    "alert-outline",
  ];

  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);

  const handleNext = () => {
    if (currentExampleIndex < exampleSets.length - 1) {
      setCurrentExampleIndex(currentExampleIndex + 1);
    } else {
      console.log("Let's Chat pressed!");
    }
  };

  return (
    <View style={styles.container}>
      {/* Sección superior: Logo, título y subtítulo */}
      <View style={styles.topSection}>
        <Image
          source={require("../assets/images/chat-icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to ChatGPT</Text>
        <Text style={styles.subtitle}>Ask anything, get your answer</Text>
      </View>

      {/* Sección central: Diálogo tipo carrusel con icono dinámico */}
      <View style={styles.middleSection}>
        <MaterialCommunityIcons
          name={exampleIcons[currentExampleIndex]}
          size={30}
          color="#10A37F"
        />
        <Text style={styles.examplesTitle}>{exampleSets[currentExampleIndex].title}</Text>
        <View style={styles.examplesContainer}>
          {exampleSets[currentExampleIndex].examples.map((text, index) => (
            <View key={index} style={styles.exampleBox}>
              <Text style={styles.exampleText}>{text}</Text>
            </View>
          ))}
        </View>

        {/* Indicadores para el carrusel */}
        <View style={styles.indicatorContainer}>
          {exampleSets.map((_, index) => (
            <TouchableOpacity key={index} onPress={() => setCurrentExampleIndex(index)}>
              <View
                style={[
                  styles.indicator,
                  currentExampleIndex === index
                    ? { backgroundColor: "#10A37F" }
                    : { backgroundColor: "#ccc" },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sección inferior: Botón "Next" o "Let's Chat" */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          {currentExampleIndex < exampleSets.length - 1 ? (
            <Text style={styles.nextButtonText}>Next</Text>
          ) : (
            <>
              <Text style={styles.nextButtonText}>Let's Chat</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="#fff"
                style={{ marginLeft: 10 }}
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
