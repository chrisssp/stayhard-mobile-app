import { Text, View } from "react-native";

interface ChatBubbleProps {
  message: string;
  isUser?: boolean;
}

export default function ChatBubble({ message, isUser }: ChatBubbleProps) {
  return (
    <View className={isUser ? "items-end" : "items-start"}>
      <View
        className={
          isUser
            ? "bg-slate-800 rounded-2xl px-4 py-3 max-w-[250px]"
            : "bg-slate-50 rounded-2xl px-4 py-3 max-w-[250px] border border-slate-200"
        }
      >
        <Text
          className={
            isUser ? "text-slate-50 text-base" : "text-slate-900 text-base"
          }
        >
          {message}
        </Text>
      </View>
    </View>
  );
}
