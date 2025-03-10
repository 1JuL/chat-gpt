import { View, Text, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import styles from "../styles/DashboardStyles";

export default function Dashboard() {
  const router = useRouter();

  const [loaded] = useFonts({
    Raleway: require("../assets/fonts/raleway.semibold.ttf"),
  });

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Sección superior */}
      <ScrollView style={styles.topSection}>
        <TouchableOpacity
          style={styles.newChatButton}
          onPress={() => {
            router.push("/chat");
          }}
        >
          <View style={styles.leftGroup}>
            <MaterialCommunityIcons name="message-outline" size={20} color="#fff" />
            <Text style={styles.newChatText}>New Chat</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color="#fff"
            style={styles.iconRight}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.recentChatButton}
          onPress={() => {
            /* acción para abrir chat reciente */
          }}
        >
          <View style={styles.leftGroup}>
            <MaterialCommunityIcons name="message-outline" size={20} color="#fff" />
            <Text style={styles.recentChatText}>Why is the sky blue?</Text>
          </View>
          <View style={styles.rightGroup}>
            <TouchableOpacity onPress={toggleDropdown}>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={20}
                color="#fff"
                style={styles.iconDots}
              />
            </TouchableOpacity>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color="#fff"
              style={styles.iconRight}
            />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Dropdown para Settings */}
      {dropdownVisible && (
        <TouchableWithoutFeedback onPress={closeDropdown}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdown}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    /* acción para editar */
                  }}
                >
                  <MaterialCommunityIcons
                    name="square-edit-outline"
                    size={20}
                    color="#fff"
                    style={styles.icon}
                  />
                  <Text style={styles.dropdownText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    /* acción para borrar */
                  }}
                >
                  <MaterialCommunityIcons
                    name="delete"
                    size={20}
                    color="#ED8C8C"
                    style={styles.icon}
                  />
                  <Text style={[styles.dropdownText, { color: "#ED8C8C" }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* Sección inferior */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            /* acción para limpiar conversaciones */
          }}
        >
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Clear Conversations</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            /* acción para upgrade */
          }}
        >
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons
              name="account-plus-outline"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Upgrade to Plus</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            /* acción para cambiar tema */
          }}
        >
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons
              name="weather-sunny"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Light Mode</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            /* acción para ver actualizaciones */
          }}
        >
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons name="update" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Updates & FAQ</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.lastButton]}
          onPress={() => {
            /* acción para logout */
          }}
        >
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons name="logout" size={20} color="#ED8C8C" style={styles.icon} />
            <Text style={styles.redText}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
