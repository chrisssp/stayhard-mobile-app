import Button from "components/atoms/Button";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

type ChatMeta = { id: string; title: string | null };

interface Props {
  chats: ChatMeta[];
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  onCreateChat: () => void;
}

const ChatHistorySheet: React.FC<Props> = ({
  chats,
  currentChatId,
  onSelectChat,
  onCreateChat,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const expandedHeight = Math.min(screenHeight * 0.75, 600);
  const collapsedHeight = 44;
  const translateY = useRef(
    new Animated.Value(expandedHeight - collapsedHeight)
  ).current;
  const isExpanded = useRef(false);

  const animateTo = (to: number) => {
    Animated.spring(translateY, {
      toValue: to,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };
  const open = () => {
    animateTo(0);
    isExpanded.current = true;
  };
  const close = () => {
    animateTo(expandedHeight - collapsedHeight);
    isExpanded.current = false;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        const base = isExpanded.current ? 0 : expandedHeight - collapsedHeight;
        let next = base + g.dy;
        if (next < 0) next = 0;
        if (next > expandedHeight - collapsedHeight)
          next = expandedHeight - collapsedHeight;
        translateY.setValue(next);
      },
      onPanResponderRelease: (_, g) => {
        const threshold = (expandedHeight - collapsedHeight) / 2;
        // @ts-ignore internal value
        const current: number = translateY._value ?? 0;
        if (g.vy < -0.75) open();
        else if (g.vy > 0.75) close();
        else if (current < threshold) open();
        else close();
      },
    })
  ).current;

  const toggle = () => {
    isExpanded.current ? close() : open();
  };
  useEffect(() => {
    close();
  }, []);

  return (
    <Animated.View
      className="rounded-t-2xl shadow-lg"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: expandedHeight,
        transform: [{ translateY }],
        zIndex: 50,
        backgroundColor: "#fff"
      }}
      {...panResponder.panHandlers}
    >
      <Pressable onPress={toggle} className="items-center pt-1 pb-1">
        <View className="w-12 h-1.5 rounded-full bg-slate-300 mb-1" />
        <Text className="text-[12px] text-slate-600">
          Desliza para ver historial de chats
        </Text>
      </Pressable>
      <View className="flex-row justify-between items-center px-4 pt-1 pb-2">
        <Text className="font-semibold text-slate-900">Chats</Text>
        <Button variant="secondary" onPress={onCreateChat}>
          <Text className="text-[12px] text-slate-800">Nuevo</Text>
        </Button>
      </View>
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {chats.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => {
              onSelectChat(c.id);
              close();
            }}
            className="py-2"
          >
            <Text
              className={`text-sm ${c.id === currentChatId ? "font-bold text-slate-900" : "text-slate-600"}`}
              numberOfLines={1}
            >
              {c.title || "Sin título"}
            </Text>
          </Pressable>
        ))}
        {chats.length === 0 && (
          <Text className="text-[12px] italic text-slate-500">
            No hay chats todavía
          </Text>
        )}
      </ScrollView>
    </Animated.View>
  );
};

export default ChatHistorySheet;
