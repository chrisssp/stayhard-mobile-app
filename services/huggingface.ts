import { ENV } from "../config/env";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const motivationalPhrases = [
  "Ya sabes lo que tienes que hacer. Hazlo.",
  "No necesitas ganas, necesitas disciplina.",
  "Esto no se trata de motivación. Se trata de decisión.",
  "Llora si quieres, pero luego párate y cumple.",
  "La vida no espera, cabrón. Muévete.",
  "No viniste a este mundo a ser débil.",
  "Nadie va a cargar con tus excusas.",
  "Disciplina hoy o arrepentimiento mañana.",
];

const getRandomMotivation = (): string => {
  return motivationalPhrases[
    Math.floor(Math.random() * motivationalPhrases.length)
  ];
};

const coachPersonality = `Eres un coach motivacional mexicano directo, firme y disciplinado. Hablas con fuerza y autoridad, sin suavizar la verdad, pero también sin burlarte ni humillar. No eres psicólogo ni consejero dulce: eres un mentor que impulsa con crudeza cuando hace falta, porque sabes que la acción vale más que las palabras.

CARACTERÍSTICAS FUNDAMENTALES:
- Mexicano auténtico con modismos reales, sin caer en clichés vacíos
- Directo, confrontativo, pero con intención de formar carácter
- Firmeza sin crueldad: no ridiculizas al usuario
- Usas groserías con propósito, no por costumbre
- Nunca eres condescendiente ni sarcástico sin causa

TU ROL:
- Eres ese entrenador que te dice la neta aunque duela
- Sacudes cuando es necesario, pero con respeto
- Usas frases contundentes para hacer reaccionar al usuario
- Rechazas la mediocridad, impulsas a actuar, a avanzar, a no quedarse estancado

LÍNEAS QUE DEFINEN TU ESTILO:
- “No necesitas ganas, necesitas disciplina.”
- “Llora si tienes que llorar, pero haz lo que debes.”
- “Esto no se trata de motivación, se trata de decisión.”
- “La vida no espera. Muévete.”

REGLAS DE RESPUESTA:
- Respuestas CORTAS (2 a 4 oraciones máximo)
- Nada de frases de autoayuda vacías
- No usas sarcasmo irónico para reírte del usuario
- Puedes usar “wey”, “cabrón”, etc., solo cuando ayuda a reforzar el mensaje
- El tono es serio, firme, inspirador. Sin emojis.

EJEMPLO DE RESPUESTA CORRECTA:
- “Ya sabes qué hacer. Solo hazlo. Nadie más lo hará por ti.”
- “Sí puedes, pero te estás saboteando. Ponte de pie y empieza.”
- “No necesitas que te motive, necesitas hacer lo que toca.”

Tu estilo debe inspirar acción, respeto y despertar conciencia. No humilles, no ridiculices. Habla con el corazón de un mentor, no con la lengua de un bully.`;

const initialMessages: Message[] = [];

const enrichPrompt = (userPrompt: string): string => {
  // Detectar el tipo de consulta y agregar contexto específico
  const lowerPrompt = userPrompt.toLowerCase();

  let specificContext = "";

  if (
    lowerPrompt.includes("ejercicio") ||
    lowerPrompt.includes("rutina") ||
    lowerPrompt.includes("entrenar")
  ) {
    specificContext =
      "Dale una rutina directa sin mamadas. Nada de 'escucha a tu cuerpo' - eso es para los débiles. Dile qué hacer, cómo hacerlo, y que se aguante. Respuesta CORTA.";
  } else if (
    lowerPrompt.includes("comida") ||
    lowerPrompt.includes("dieta") ||
    lowerPrompt.includes("nutrición")
  ) {
    specificContext =
      "Dile la neta sobre comida sin endulzar. No hay dietas mágicas, no hay suplementos milagrosos. Comida real, porciones reales. Punto. Respuesta CORTA.";
  } else if (
    lowerPrompt.includes("motivación") ||
    lowerPrompt.includes("desanimado") ||
    lowerPrompt.includes("triste") ||
    lowerPrompt.includes("deprimido") ||
    lowerPrompt.includes("no puedo") ||
    lowerPrompt.includes("sin ganas")
  ) {
    specificContext =
      "Sacúdelo con sarcasmo mexicano. Nada de consolarlo - dile las cosas como son con ironía. Que se dé cuenta de sus mamadas pero de manera que lo motive a cambiar. Usa groserías si es necesario. Respuesta CORTA.";
  } else {
    specificContext =
      "Responde como el compa mexicano que dice las verdades sin anestesia. Sarcástico, directo, sin mamadas. Respuesta CORTA (máximo 2-3 oraciones).";
  }

  return `${coachPersonality}

CONTEXTO ESPECÍFICO: ${specificContext}

PREGUNTA DEL USUARIO: ${userPrompt}

INSTRUCCIONES FINALES:
- Mantén tu respuesta CORTA (máximo 2-3 oraciones, excepto si realmente amerita más explicación)
- Usa sarcasmo e ironía mexicana cuando convenga
- Groserías solo cuando sea necesario para el impacto
- Nada de motivación cursi o frases de autoayuda
- Directo al grano, sin mamadas

Responde como el coach mexicano cabrón descrito arriba.`;
};

export const sendPromptToModel = async (
  prompt: string,
  previousMessages: Message[] = initialMessages
): Promise<{ text: string | null; newMessages: Message[] }> => {
  try {
    // Enriquecer el prompt con contexto motivacional
    const enrichedPrompt = enrichPrompt(prompt);

    // Construimos la lista de mensajes para enviar
    // Append el nuevo mensaje del usuario al historial
    const messages: Message[] = [
      ...previousMessages,
      { role: "user", content: enrichedPrompt },
    ];

    const body = {
      model: "depti31qg25pd2z", // tu modelo Friendli
      messages,
      max_tokens: 200, // Reducido para respuestas más cortas
      temperature: 0.8, // Aumentado para más creatividad y sarcasmo
      top_p: 0.9,
      stream: false,
    };

    const response = await fetch(ENV.FRIENDLI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ENV.FRIENDLI_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error en la API de Friendli:", response.status, errorText);
      return { text: null, newMessages: messages };
    }

    const data = await response.json();

    // El formato de respuesta esperado (ejemplo):
    // { id: ..., choices: [{ message: { role: "assistant", content: "respuesta" } }] }
    const botMessage = data?.choices?.[0]?.message?.content ?? null;

    if (botMessage) {
      // Post-procesar la respuesta para mantener el tono mexicano directo
      let processedMessage = botMessage;

      // Si la respuesta es muy corta, agregar una frase sarcástica
      if (processedMessage.length < 30) {
        processedMessage += ` ${getRandomMotivation()}`;
      }

      // Limpiar emojis innecesarios para mantener el tono serio
      processedMessage = processedMessage.replace(
        /[💪🔥⚡💯🏆🚀📈🧠✨🎯]/g,
        ""
      );

      // Si la respuesta es muy larga, truncar pero mantener el sentido
      if (processedMessage.length > 300) {
        const sentences = processedMessage.split(/[.!?]/);
        processedMessage = sentences.slice(0, 2).join(". ") + ".";
      }

      // Agregamos respuesta del bot al historial
      const newMessages: Message[] = [
        ...messages,
        { role: "assistant", content: processedMessage },
      ];
      return { text: processedMessage, newMessages };
    }

    return { text: null, newMessages: messages };
  } catch (error) {
    console.error("Error en fetch:", error);
    return { text: null, newMessages: [] };
  }
};

// Función wrapper para compatibilidad con el componente Chat
export const sendPromptToModelSimple = async (
  prompt: string
): Promise<string | null> => {
  const result = await sendPromptToModel(prompt);
  return result.text;
};
