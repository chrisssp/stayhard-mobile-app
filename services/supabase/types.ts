export interface UserRow {
  id: string;
  username: string;
  email: string;
  created_at?: string;
}

export interface ChatRow {
  id: string;
  user_id: string;
  title: string | null;
  created_at?: string;
}

export interface ChatMessageRow {
  id?: string;
  chat_id: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

export const FIXED_USER = {
  username: "juan_perez",
  email: "juan.perez@example.com",
};
