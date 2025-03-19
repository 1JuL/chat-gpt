// app/(app)/_layout.tsx
import { Stack } from "expo-router";
import { Image } from "react-native";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { DataProvider } from "@/context/DataContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function AppLayout() {
  useProtectedRoute();

  return (
    <DataProvider>
      <ThemeProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#202123" },
            headerTitleStyle: { color: "#fff", fontFamily: "Raleway" },
            headerTintColor: "#fff",
            headerRight: () => (
              <Image
                source={require("../../assets/images/chat-icon.png")}
                style={{ width: 40, height: 40, marginRight: 10 }}
              />
            ),
          }}
        >
          {/* Rutas protegidas */}
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="chat" options={{ title: "Go Back" }}></Stack.Screen>
        </Stack>
      </ThemeProvider>
    </DataProvider>
  );
}
