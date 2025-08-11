// Chat.tsx
import Button from "components/atoms/Button";
import ChatBubble from "components/atoms/ChatBubble";
import Input from "components/atoms/Input";
import ChatActions from "components/molecules/ChatActions";
import ChatHistorySheet from "components/organisms/ChatHistorySheet";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { PaperAirplaneIcon } from "react-native-heroicons/outline";
import {
  createNewChat,
  getCurrentChatState,
  initializeChatSystem,
  selectChat,
  sendPromptToModelSimple,
} from "services/ai";

type Message = { text: string; isUser: boolean };
type ChatMeta = { id: string; title: string | null };

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
    <View className="flex-1 items-center justify-between bg-slate-100 px-4 pt-6 pb-16">
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
    <View className="flex-1 justify-between bg-slate-100 px-4 pt-6 pb-16">
      <ScrollView contentContainerStyle={[{ gap: 16, paddingVertical: 16 }]}>
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
        <View className="flex-1 pt-4">
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
  const [chats, setChats] = useState<ChatMeta[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // Inicialización
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const state = await initializeChatSystem();
        if (!mounted) return;
        setChats(
          (state.chats || []).map((c) => ({ id: c.id, title: c.title }))
        );
        if (state.currentChat) setCurrentChatId(state.currentChat.id);
        setMessages(
          (state.messages || []).map((m) => ({
            text: m.content,
            isUser: m.role === "user",
          }))
        );
      } catch (e) {
        if (mounted)
          setHistoryError("No se pudo inicializar el sistema de chats.");
      } finally {
        if (mounted) setInitialLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSelectChat = async (chatId: string) => {
    if (chatId === currentChatId) return;
    setInitialLoading(true);
    try {
      const res = await selectChat(chatId);
      if (res?.messages) {
        setMessages(
          res.messages.map((m) => ({
            text: m.content,
            isUser: m.role === "user",
          }))
        );
        setCurrentChatId(chatId);
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const handleCreateChat = async () => {
    setInitialLoading(true);
    try {
      const res = await createNewChat();
      if (res.chat) {
        setChats((prev) => [
          { id: res.chat!.id, title: res.chat!.title },
          ...prev,
        ]);
        setCurrentChatId(res.chat.id);
        setMessages([]);
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const handleQuickAction = (message: string) => {
    setInput(message);
    setTimeout(() => handleSend(), 80);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const toSend = input;
    setInput("");
    const userMsg = { text: toSend, isUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    try {
      const response = await sendPromptToModelSimple(toSend);
      if (response && response.trim()) {
        const botMsg = { text: response.trim(), isUser: false };
        setMessages((prev) => [...prev, botMsg]);
        const { chats: updatedChats } = getCurrentChatState();
        setChats(updatedChats.map((c) => ({ id: c.id, title: c.title })));
      } else {
        setMessages((prev) => [
          ...prev,
          { text: "El coach no pudo generar una respuesta.", isUser: false },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { text: "Error consultando al coach.", isUser: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 px-4">
        <Text className="text-slate-600">Cargando historial...</Text>
      </View>
    );
  }

  const showMessages = messages.length > 0;
  return (
    <View className="flex-1 relative">
      {showMessages ? (
        <>
          {historyError && (
            <Text className="text-center text-red-500 text-xs mt-2">
              {historyError}
            </Text>
          )}
          <ChatMessages
            messages={messages}
            input={input}
            onChangeText={setInput}
            onSend={handleSend}
            loading={loading}
          />
        </>
      ) : (
        <ChatEmpty
          input={input}
          onChangeText={setInput}
          onSend={handleSend}
          onQuickAction={handleQuickAction}
          loading={loading}
        />
      )}
      <ChatHistorySheet
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onCreateChat={handleCreateChat}
      />
    </View>
  );
}
