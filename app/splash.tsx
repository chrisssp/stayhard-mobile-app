import { router } from "expo-router";
import { useEffect } from "react";
import { Image, Text, View } from "react-native";

export default function SplashScreen() {
  useEffect(() => {
    // Mostrar splash por 2 segundos antes de continuar
    const timer = setTimeout(() => {
      router.replace("./index");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-slate-800">
      <Image
        source={require("../assets/images/icon.png")}
        style={{ width: 120, height: 120, marginBottom: 24 }}
        resizeMode="contain"
      />
      <Text className="text-3xl font-bold text-white mb-2">StayHard</Text>
      <Text className="text-lg text-slate-300">Disciplina para el éxito</Text>
    </View>
  );
}
