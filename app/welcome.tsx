import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Text, View } from "react-native";
import Button from "../components/atoms/Button";

export default function Welcome() {
  const handleGetStarted = async () => {
    try {
      // Marcar que el usuario ya pasó por el onboarding
      await AsyncStorage.setItem("hasLaunched", "true");
      // Ir a la pantalla de chat
      router.replace("/(tabs)/chat");
    } catch (error) {
      console.error("Error saving onboarding state:", error);
      // Aún así navegar al chat
      router.replace("/(tabs)/chat");
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-3xl font-bold text-slate-900 mb-4">
        Bienvenido a StayHard
      </Text>
      <Text className="text-lg text-slate-600 text-center mb-8">
        Tu coach personal para mantenerte disciplinado y alcanzar tus metas.
      </Text>
      <Button className="w-full mb-4" onPress={handleGetStarted}>
        Comenzar
      </Button>
      <Button variant="secondary" className="w-full" onPress={handleGetStarted}>
        Ya tengo cuenta
      </Button>
    </View>
  );
}
