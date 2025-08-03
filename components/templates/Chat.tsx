// Chat.tsx
import Button from "components/atoms/Button";
import ChatBubble from "components/atoms/ChatBubble";
import Input from "components/atoms/Input";
import ChatActions from "components/molecules/ChatActions";
import { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { PaperAirplaneIcon } from "react-native-heroicons/outline";
import { sendPromptToModelSimple } from "services/huggingface";

type Message = {
  text: string;
  isUser: boolean;
};

function ChatEmpty({
  input,
  onChangeText,
  onSend,
  onQuickAction,
  loading,
}: {
  input: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onQuickAction: (message: string) => void;
  loading: boolean;
}) {
  return (
    <View className="flex-1 items-center justify-between bg-slate-100 px-4 py-6">
      <View className="items-center gap-6">
        <Image
          source={require("../../assets/images/coach.png")}
          style={{ width: 150, height: 150, borderRadius: 75, opacity: 0.9 }}
        />
        <Text className="text-xl font-medium text-slate-900 text-center">
          ¿Qué necesitas, soldado?
        </Text>
        <Text className="text-base text-slate-600 text-center px-4">
          No estoy aquí para consolarte. Estoy aquí para forjarte. ¿Vienes a
          trabajar o a llorar?
        </Text>
        <ChatActions onQuickAction={onQuickAction} />
      </View>
      <View className="flex-row items-center gap-2 w-full">
        <View className="flex-1">
          <Input
            value={input}
            onChangeText={onChangeText}
            onSend={onSend}
            disabled={loading}
          />
        </View>
        <Button variant="round" onPress={onSend} disabled={loading}>
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

function ChatMessages({
  messages,
  input,
  onChangeText,
  onSend,
  loading,
}: {
  messages: Message[];
  input: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  loading: boolean;
}) {
  return (
    <View className="flex-1 justify-between bg-slate-100 px-4 py-6">
      <ScrollView contentContainerStyle={[{ gap: 16 }]}>
        {messages.map((msg, idx) => (
          <ChatBubble key={idx} message={msg.text} isUser={msg.isUser} />
        ))}
        {loading && (
          <Text className="text-center text-slate-500 italic mt-2">
            El coach está pensando...
          </Text>
        )}
      </ScrollView>
      <View className="flex-row items-center gap-2 w-full">
        <View className="flex-1">
          <Input
            value={input}
            onChangeText={onChangeText}
            onSend={onSend}
            disabled={loading}
          />
        </View>
        <Button variant="round" onPress={onSend} disabled={loading}>
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQuickAction = (message: string) => {
    setInput(message);
    // Enviar automáticamente el mensaje
    setTimeout(() => handleSend(), 100);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendPromptToModelSimple(input);
      if (response && response.trim()) {
        const botMessage = { text: response.trim(), isUser: false };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            text: "El coach no pudo generar una respuesta. Verifica tu conexión o token de API.",
            isUser: false,
          },
        ]);
      }
    } catch (err) {
      console.error("Error en handleSend:", err);
      setMessages((prev) => [
        ...prev,
        {
          text: "Hubo un error al consultar al coach. Revisa la configuración de la API.",
          isUser: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (messages.length === 0) {
    return (
      <ChatEmpty
        input={input}
        onChangeText={setInput}
        onSend={handleSend}
        onQuickAction={handleQuickAction}
        loading={loading}
      />
    );
  }

  return (
    <ChatMessages
      messages={messages}
      input={input}
      onChangeText={setInput}
      onSend={handleSend}
      loading={loading}
    />
  );
}
