import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

type ButtonVariant = "primary" | "secondary" | "ghost" | "round";

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-slate-800",
  secondary: "bg-slate-50 border border-slate-800",
  ghost: "bg-transparent",
  round: "bg-slate-800 w-11 h-11 items-center justify-center p-0",
};

export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const isRound = variant === "round";
  return (
    <TouchableOpacity
      className={`rounded-full ${isRound ? "w-11 h-11 items-center justify-center p-0" : "px-6 py-3"} ${variantClasses[variant]} ${className}`}
      style={
        isRound
          ? {
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }
          : undefined
      }
      {...props}
    >
      {isRound ? (
        // children should be an icon component
        children
      ) : (
        <Text
          className={`text-xs font-bold ${
            variant === "primary" ? "text-slate-50" : "text-slate-800"
          }`}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}
