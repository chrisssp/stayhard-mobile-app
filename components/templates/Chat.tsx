import Button from "components/atoms/Button";
import ChatBubble from "components/atoms/ChatBubble";
import Input from "components/atoms/Input";
import ChatActions from "components/molecules/ChatActions";
import { useState } from "react";
import { Image, Text, View } from "react-native";
import { PaperAirplaneIcon } from "react-native-heroicons/outline";

function ChatEmpty() {
  return (
    <View className="flex-1 items-center justify-between bg-slate-100 px-4 py-6">
      <View className="items-center gap-6">
        <Image
          source={require("../../assets/images/coach.png")}
          style={{ width: 150, height: 150, borderRadius: 75, opacity: 0.9 }}
        />
        <Text className="text-xl font-medium text-slate-900 text-center">
          ¿Qué pasa hoy?
        </Text>
        <ChatActions />
      </View>
      <View className="flex-row items-center gap-2 w-full">
        <View className="flex-1">
          <Input value="" onChangeText={() => {}} onSend={() => {}} />
        </View>
        <Button variant="round">
          <PaperAirplaneIcon
            size={24}
            className="text-slate-50"
            style={{ transform: [{ rotate: "45deg" }] }}
          />
        </Button>
      </View>
    </View>
  );
}

type ChatMessagesProps = {
  messages: string[];
};

function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <View className="flex-1 justify-between bg-slate-100 px-4 py-6">
      <View className="gap-4">
        <ChatBubble message={messages[0]} isUser />
      </View>
      <View className="items-center gap-6">
        <Image
          source={require("../../assets/images/coach.png")}
          style={{ width: 150, height: 150, borderRadius: 75, opacity: 0.9 }}
        />
        <Text className="text-base font-medium text-slate-900 text-center">
          Entiendo. Pero las ganas no construyen el cuerpo que quieres, la
          disciplina sí. ¿Vas a dejar que un sentimiento decida por ti?
          Levántate, tienes 5 minutos para empezar a moverte.
        </Text>
      </View>
      <View className="flex-row items-center gap-2 w-full">
        <View className="flex-1">
          <Input value="" onChangeText={() => {}} onSend={() => {}} />
        </View>
        <Button variant="round">
          <PaperAirplaneIcon
            size={24}
            className="text-slate-50"
            style={{ transform: [{ rotate: "45deg" }] }}
          />
        </Button>
      </View>
    </View>
  );
}

export default function Chat() {
  // Simulación: cambia a [] para ver la pantalla vacía
  //   const [messages] = useState<string[]>([]);
  const [messages] = useState<string[]>([
    "Hoy me siento sin ganas de nada, creo que no iré al gimnasio.",
    "Entiendo. Pero las ganas no construyen el cuerpo que quieres, la disciplina sí. ¿Vas a dejar que un sentimiento decida por ti? Levántate, tienes 5 minutos para empezar a moverte.",
  ]);

  if (messages.length === 0) {
    return <ChatEmpty />;
  }
  return <ChatMessages messages={messages} />;
}
