// app/_layout.tsx
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  const [loaded] = useFonts({
    Raleway: require("../assets/fonts/raleway.regular.ttf"),
  });

  if (!loaded) return null;

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
