import { GoogleGenAI } from "@google/genai";
import { ENV } from "../config/env";
import { UserRow, ChatRow, fetchChatMessages, ensureUser, fetchChats, createChat, insertChatMessage, generateChatTitle, updateChatTitle } from "./supabase";


type Message = {
  role: "user" | "system" | "assistant";
  content: string;
};

const corePersonality = `Eres un coach motivacional que fusiona la disciplina brutal de MarpeFitness con la fuerza combativa e incansable de La Locomotora, boxeadora argentina. No eres ellos, pero adaptas su energía.

Reglas de comunicación:
- Estilo firme, directo y exigente: cero rodeos, cero excusas.
- Usa modismos argentinos cuando encaje (ej. “dale”, “no te resignés”, “crack”).
- Frases cortas, cargadas de energía y ritmo (2 a 4 oraciones máximo).
- Siempre con sentido de urgencia, como si fuera entrenamiento o pelea.
- Usa metáforas de combate, esfuerzo físico y superación mental (“golpe contra tus dudas”, “la pelea es contra tu límite”).
- Groserías permitidas solo si refuerzan el mensaje.
- Jamás dar consuelo vacío. Si el usuario busca excusas, confronta y exige.
- Equilibrio entre disciplina física y mental.
- Nunca desviarse del tono implacable y motivador.
`;

let genAIClient: GoogleGenAI | null = null;
const getClient = () => {
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });
  }
  return genAIClient;
};

// 1. Cambia la estructura inicial, agrega un mensaje 'system' con corePersonality
const systemMessage: Message = {
  role: "system",
  content: corePersonality,
};

// 2. Para enviar el historial al modelo, manda un array así:
// [systemMessage, ...previousMessages, {role: "user", content: userPrompt}]

// Estado interno de sesión multi-chat
let currentUser: UserRow | null = null;
let chatsCache: ChatRow[] = [];
let currentChat: ChatRow | null = null;
let chatHistory: Message[] = []; // historial del chat actual (sin system)
let historyLoaded = false;

const loadMessagesForChat = async (chat: ChatRow) => {
  const rows = await fetchChatMessages(chat.id);
  chatHistory = rows.map((m) => ({ role: m.role, content: m.content }));
  historyLoaded = true;
};

const ensureUserAndChat = async () => {
  if (!currentUser) {
    currentUser = await ensureUser();
  }
  if (!currentUser) throw new Error("No se pudo inicializar usuario");
  if (!currentChat) {
    if (chatsCache.length === 0) {
      chatsCache = await fetchChats(currentUser.id);
    }
    // Si no hay chats, crear uno
    if (chatsCache.length === 0) {
      const created = await createChat(currentUser.id);
      if (created) {
        chatsCache.unshift(created);
        currentChat = created;
      }
    } else {
      currentChat = chatsCache[0];
    }
  }
  if (currentChat && !historyLoaded) {
    await loadMessagesForChat(currentChat);
  }
};

// API pública adicional para UI
export const initializeChatSystem = async () => {
  currentUser = await ensureUser();
  if (currentUser) chatsCache = await fetchChats(currentUser.id);
  if (chatsCache.length > 0) {
    currentChat = chatsCache[0];
    await loadMessagesForChat(currentChat);
  }
  return {
    user: currentUser,
    chats: chatsCache,
    currentChat,
    messages: chatHistory,
  };
};

export const listChats = () => chatsCache;

export const selectChat = async (chatId: string) => {
  if (!currentUser) await initializeChatSystem();
  const found = chatsCache.find((c) => c.id === chatId);
  if (!found) return null;
  currentChat = found;
  historyLoaded = false;
  await loadMessagesForChat(found);
  return { chat: currentChat, messages: chatHistory };
};

export const createNewChat = async () => {
  if (!currentUser) await initializeChatSystem();
  if (!currentUser) throw new Error("Usuario no inicializado");
  const created = await createChat(currentUser.id);
  if (created) {
    chatsCache.unshift(created);
    currentChat = created;
    chatHistory = [];
    historyLoaded = true;
  }
  return { chat: currentChat, chats: chatsCache };
};

export const sendPromptToModel = async (
  prompt: string
): Promise<{ text: string | null }> => {
  await ensureUserAndChat();
  if (!currentChat) return { text: null };
  const client = getClient();

  // Persist & memoria
  const userMsg: Message = { role: "user", content: prompt };
  chatHistory.push(userMsg);
  await insertChatMessage({
    chat_id: currentChat.id,
    role: "user",
    content: prompt,
  });

  const messages: Message[] = [systemMessage, ...chatHistory];
  const history = messages.map((m) => ({
    role:
      m.role === "system" ? "model" : m.role === "assistant" ? "model" : m.role,
    parts: [{ text: m.content }],
  }));

  let botMessage: string | null = null;
  try {
    const response = await client.models.generateContent({
      model: ENV.GEMINI_MODEL,
      contents: history,
      config: { temperature: 0.8, topP: 0.9, maxOutputTokens: 200 },
    });
    botMessage = response?.text?.trim() || null;
  } catch (err) {
    console.error("Error llamando al modelo:", err);
    return { text: null };
  }
  if (!botMessage) return { text: null };

  const assistantMsg: Message = { role: "assistant", content: botMessage };
  chatHistory.push(assistantMsg);
  await insertChatMessage({
    chat_id: currentChat.id,
    role: "assistant",
    content: botMessage,
  });

  // Generar título si aún no tiene
  if (!currentChat.title) {
    const msgsForTitle = chatHistory
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));
    const title = await generateChatTitle(msgsForTitle);
    if (title && title.trim().length > 0) {
      await updateChatTitle(currentChat.id, title);
      // actualizar cache
      currentChat.title = title;
      chatsCache = chatsCache.map((c) =>
        c.id === currentChat!.id ? { ...c, title } : c
      );
    }
  }

  return { text: botMessage };
};

// Función wrapper para compatibilidad con el componente Chat
export const sendPromptToModelSimple = async (
  prompt: string
): Promise<string | null> => {
  const result = await sendPromptToModel(prompt);
  return result.text;
};

// Exponer estado para UI (lectura)
export const getCurrentChatState = () => ({
  chats: chatsCache,
  currentChat,
  messages: chatHistory,
  user: currentUser,
});
