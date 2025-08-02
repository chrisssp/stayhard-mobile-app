import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");

        if (hasLaunched === null) {
          // Primera vez - ir a welcome
          router.replace("/welcome");
        } else {
          // Usuario ya se logeó antes - ir directo a chat
          router.replace("/(tabs)/chat");
        }
      } catch (error) {
        // En caso de error, ir a welcome por seguridad
        router.replace("/welcome");
      }
    };

    checkFirstTime();
  }, []);

  // Pantalla en blanco mientras decide a dónde ir
  return null;
}
