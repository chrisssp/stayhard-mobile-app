import { supabase } from "./client";
import { FIXED_USER, type UserRow } from "./types";

export const ensureUser = async (): Promise<UserRow | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", FIXED_USER.username)
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("[Supabase] Error buscando usuario:", error.message);
    return null;
  }
  if (data) return data as UserRow;
  const { data: created, error: insertErr } = await supabase
    .from("users")
    .insert({ username: FIXED_USER.username, email: FIXED_USER.email })
    .select()
    .single();
  if (insertErr) {
    console.error("[Supabase] Error creando usuario:", insertErr.message);
    return null;
  }
  return created as UserRow;
};
