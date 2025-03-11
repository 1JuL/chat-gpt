import { Stack } from "expo-router";
import { Image } from "react-native";
import { useFonts } from "expo-font";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  const [loaded] = useFonts({
    Raleway: require("../assets/fonts/raleway.regular.ttf"),
  });

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#343541",
          },
          headerTitleStyle: {
            color: "#fff",
            fontFamily: "Raleway",
          },
          headerTintColor: "#fff",
          headerRight: () => (
            <Image
              source={require("../assets/images/chat-icon.png")}
              style={{ width: 30, height: 30, marginRight: 10 }}
            />
          ),
        }}
      >
        <Stack.Screen name="home" options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="index" options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="welcome" options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="dashboard" options={{ title: "Dashboard" }}></Stack.Screen>
        <Stack.Screen name="chat" options={{ title: "Back" }}></Stack.Screen>
        <Stack.Screen name="login" options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="signup" options={{ title: "Signup" }}></Stack.Screen>
        <Stack.Screen name="navbuttons" options={{ title: "Navbuttons" }}></Stack.Screen>
      </Stack>
    </AuthProvider>
  );
}
