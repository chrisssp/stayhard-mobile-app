import { supabase } from "./client";
import { type ChatRow } from "./types";

export const fetchChats = async (userId: string): Promise<ChatRow[]> => {
  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[Supabase] Error listando chats:", error.message);
    return [];
  }
  return (data as ChatRow[]) || [];
};

export const createChat = async (userId: string): Promise<ChatRow | null> => {
  const { data, error } = await supabase
    .from("chats")
    .insert({ user_id: userId, title: null })
    .select()
    .single();
  if (error) {
    console.error("[Supabase] Error creando chat:", error.message);
    return null;
  }
  return data as ChatRow;
};

export const updateChatTitle = async (chatId: string, title: string) => {
  const { error } = await supabase
    .from("chats")
    .update({ title })
    .eq("id", chatId);
  if (error) {
    console.error("[Supabase] Error actualizando título:", error.message);
  }
};
