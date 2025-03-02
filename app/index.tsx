import { useRouter } from "expo-router";
import { Text, View, Button } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hola mundo</Text>

      <Button title="Dashboard" onPress={() => router.push("/dashboard")} />
      <Button title="Welcome" onPress={() => router.push("/welcome")} />
      <Button title="Splashscreen" onPress={() => router.push("/splashscreen")} />
    </View>
  );
}
