export const generateChatTitle = (
  allMessages: { role: "user" | "assistant"; content: string }[],
  fallback = "Chat"
): string => {
  try {
    const lastUser = [...allMessages].reverse().find((m) => m.role === "user");
    if (!lastUser) return fallback;
    const text = lastUser.content.trim();
    const sliced = text.split(/\s+/).slice(0, 6).join(" ");
    return sliced
      .replace(/[\n\r]/g, "")
      .replace(/\s+/g, " ")
      .slice(0, 48);
  } catch {
    return fallback;
  }
};
