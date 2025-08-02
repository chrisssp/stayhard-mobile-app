import { View } from "react-native";
import Button from "../atoms/Button";

export default function ChatActions() {
  return (
    <View className="flex-row gap-2 mt-2">
      <Button>Plan del dia</Button>
      <Button>Historial</Button>
      <Button>Favoritos</Button>
    </View>
  );
}
