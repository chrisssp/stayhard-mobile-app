import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  ChatBubbleLeftRightIcon,
  HeartIcon,
  HomeIcon,
} from "react-native-heroicons/solid";

const TABS = [
  { name: "plan", label: "Plan", icon: HomeIcon },
  { name: "chat", label: "Chat", icon: ChatBubbleLeftRightIcon },
  { name: "favorites", label: "Favorites", icon: HeartIcon },
];

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View className="flex-row bg-slate-100 border-t border-slate-300 p-2 justify-center items-center">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const Icon = TABS[index]?.icon;
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={() => navigation.navigate(route.name)}
            className="flex-1 items-center"
          >
            {Icon && (
              <Icon
                size={24}
                className={isFocused ? "text-slate-800" : "text-slate-500"}
              />
            )}
            <Text
              className={
                isFocused ? "text-slate-800 text-xs" : "text-slate-500 text-xs"
              }
            >
              {TABS[index]?.label || options.title || route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
