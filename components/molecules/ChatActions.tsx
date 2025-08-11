import { View } from "react-native";
import Button from "../atoms/Button";

interface ChatActionsProps {
  onQuickAction: (message: string) => void;
}

export default function ChatActions({ onQuickAction }: ChatActionsProps) {
  const handleQuickAction = (action: string) => {
    onQuickAction(action);
  };

  return (
    <View className="flex-col gap-3 mt-4">
      <View className="flex-row gap-2 justify-center">
        <Button
          variant="secondary"
          onPress={() => handleQuickAction("No tengo ganas de entrenar hoy")}
        >
          Sin ganas
        </Button>
        <Button
          variant="secondary"
          onPress={() => handleQuickAction("Dame una rutina de hierro")}
        >
          Rutina
        </Button>
      </View>
      <View className="flex-row gap-2 justify-center">
        <Button
          variant="secondary"
          onPress={() => handleQuickAction("Qué debo comer para ser fuerte")}
        >
          Nutrición
        </Button>
        <Button
          variant="secondary"
          onPress={() => handleQuickAction("Estoy débil, necesito disciplina")}
        >
          Disciplina
        </Button>
      </View>
    </View>
  );
}
