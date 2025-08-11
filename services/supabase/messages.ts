import { supabase } from "./client";
import { type ChatMessageRow } from "./types";

export const fetchChatMessages = async (
  chatId: string
): Promise<ChatMessageRow[]> => {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });
  if (error) {
    console.error("[Supabase] Error listando mensajes:", error.message);
    return [];
  }
  return (data as ChatMessageRow[]) || [];
};

export const insertChatMessage = async (
  msg: ChatMessageRow
): Promise<ChatMessageRow | null> => {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert(msg)
    .select()
    .single();
  if (error) {
    console.error("[Supabase] Error insertando mensaje:", error.message);
    return null;
  }
  return data as ChatMessageRow;
};
