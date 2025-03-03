import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen name="home" options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="index" options={{ title: "", headerShown: false }}></Stack.Screen>
      <Stack.Screen name="welcome" options={{ title: "Welcome" }}></Stack.Screen>
      <Stack.Screen name="dashboard" options={{ title: "Dashboard" }}></Stack.Screen>
    </Stack>
  );
}
