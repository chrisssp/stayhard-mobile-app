import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { BellIcon, Cog6ToothIcon, StarIcon } from "react-native-heroicons/solid";

export default function Header() {
  return (
    <View className="flex-row items-center justify-between px-6 py-4 bg-slate-800 border-b border-gray-200">
      {/* Logo a la izquierda */}
      {/* <Image
        source={require("../assets/images/icon.png")}
        style={{ width: 32, height: 32 }}
        resizeMode="contain"
      /> */}
      <TouchableOpacity onPress={() => {}}>
          <StarIcon size={24} className="text-slate-50" />
        </TouchableOpacity>
      {/* Espaciador para centrar el header si es necesario */}
      <View className="flex-1" />
      {/* Botones a la derecha */}
      <View className="flex-row align-items-center gap-4">
        <TouchableOpacity onPress={() => {}}>
          <BellIcon size={24} className="text-slate-50" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Cog6ToothIcon size={24} className="text-slate-50" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
