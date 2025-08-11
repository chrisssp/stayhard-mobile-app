import { TextInput } from "react-native";

interface Input {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export default function Input({
  value,
  onChangeText,
  onSend,
  disabled = false,
}: Input) {
  return (
    <TextInput
      className="w-full flex-row items-center border min-h-11 border-slate-300 rounded-2xl px-4 py-3 text-slate-900"
      placeholder="¿Cuál es tu excusa hoy?"
      style={{ backgroundColor: "#F8FAFC" }}
      placeholderTextColor="#62748E"
      value={value}
      onChangeText={onChangeText}
      editable={!disabled}
    />
  );
}
