const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export const ENV = {
  GEMINI_MODEL: "gemma-3n-e2b-it",
  GEMINI_API_KEY,
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || "",
  // Soporta dos nombres posibles de variable de entorno
  SUPABASE_ANON_KEY:
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.EXPO_PUBLIC_SUPABASE_KEY ||
    "",
};
