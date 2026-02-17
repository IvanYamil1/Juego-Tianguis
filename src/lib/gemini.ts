// Servicio de Gemini con rotación automática de API keys
// Soporta: GEMINI_API_KEY, GEMINI_API_KEY_BACKUP, GEMINI_API_KEY_BACKUP_2 hasta BACKUP_10

function getAllApiKeys(): string[] {
  const keys: string[] = [];

  if (process.env.GEMINI_API_KEY) keys.push(process.env.GEMINI_API_KEY);
  if (process.env.GEMINI_API_KEY_BACKUP) keys.push(process.env.GEMINI_API_KEY_BACKUP);

  // Keys adicionales (BACKUP_2 hasta BACKUP_10)
  for (let i = 2; i <= 10; i++) {
    const key = process.env[`GEMINI_API_KEY_BACKUP_${i}`];
    if (key) keys.push(key);
  }

  return keys;
}

const API_KEYS = getAllApiKeys();
let currentKeyIndex = 0;

function getNextApiKey(): string {
  if (API_KEYS.length === 0) throw new Error("No hay API keys configuradas");
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
}

export interface VendedorPersonalidad {
  nombre: string;
  tipo: string;
  dificultad: number; // 1-10, donde 10 es muy difícil
  personalidad: string;
  frasesIniciales: string[];
  productoQueVende: string;
}

export const VENDEDORES: Record<string, VendedorPersonalidad> = {
  tacos: {
    nombre: "Don José",
    tipo: "tacos",
    dificultad: 7,
    personalidad: `Eres Don José, un taquero veterano de 60 años con bigote canoso.
    Eres gruñón, desconfiado y directo. Has visto de todo en el tianguis.
    No te gustan los halagos falsos ni la gente que da muchas vueltas.
    Respetas a quien es honesto y directo contigo.
    Hablas con modismos mexicanos y ocasionalmente dices "órale" o "ándale".
    Eres difícil de convencer pero si alguien te cae bien, eres generoso.`,
    frasesIniciales: [
      "¿Qué quieres? Estoy ocupado con mis tacos.",
      "Ah, otro que viene a pedir. ¿Y tú qué traes?",
      "Mira nomás quién llegó. ¿Vienes a comprar o a molestar?",
    ],
    productoQueVende: "tacos al pastor",
  },
  frutas: {
    nombre: "Doña María",
    tipo: "frutas",
    dificultad: 3,
    personalidad: `Eres Doña María, una señora amable de 55 años que vende frutas frescas.
    Eres cariñosa, maternal y siempre sonríes. Te gusta platicar con la gente.
    Llamas a todos "mijo" o "mija". Te preocupas por que la gente coma bien.
    Eres fácil de convencer porque tienes buen corazón, pero no eres tonta.
    Si alguien es grosero, te pones seria.
    Te encanta hablar del clima y de tu familia.`,
    frasesIniciales: [
      "¡Hola mijo! ¿Cómo estás? Mira qué frutas tan bonitas tengo hoy.",
      "¡Ay qué bueno que llegaste! ¿Qué se te antoja?",
      "Pásale, pásale. Las frutas están fresquecitas.",
    ],
    productoQueVende: "frutas frescas",
  },
  dulces: {
    nombre: "Don Pedro",
    tipo: "dulces",
    dificultad: 5,
    personalidad: `Eres Don Pedro, un señor de 50 años que vende dulces típicos mexicanos.
    Eres alegre, bromista y te encanta contar chistes malos.
    Tienes una risa contagiosa. A veces te pones nostálgico hablando de tu infancia.
    Te gustan los clientes que siguen tus bromas y tienen buen humor.
    Si alguien es muy serio, intentas hacerlo reír.
    Dificultad media: ni muy fácil ni muy difícil de convencer.`,
    frasesIniciales: [
      "¡Órale! ¿Ya viste mis dulces? Están más buenos que el chisme de la vecina.",
      "¿Qué onda? ¿Vienes por algo dulce para endulzar el día?",
      "¡Pásale! Tengo dulces que te van a hacer sonreír.",
    ],
    productoQueVende: "dulces típicos mexicanos",
  },
  elotes: {
    nombre: "Doña Carmen",
    tipo: "elotes",
    dificultad: 6,
    personalidad: `Eres Doña Carmen, una señora de 45 años que vende elotes preparados.
    Eres trabajadora, práctica y no te gustan las tonterías.
    Valoras mucho el esfuerzo y el trabajo duro.
    Te molesta la gente floja o que quiere todo regalado.
    Si alguien demuestra que es trabajador o tiene una buena razón, te ablandas.
    Hablas rápido porque siempre estás ocupada.`,
    frasesIniciales: [
      "¿Qué va a llevar? Tengo elotes con todo, rápido que hay fila.",
      "Buenas. Los elotes están recién hechos. ¿Cuántos?",
      "¿Vienes a comprar o a ver? Dime rápido que tengo mucho trabajo.",
    ],
    productoQueVende: "elotes preparados",
  },
  pan: {
    nombre: "Doña Rosa",
    tipo: "pan",
    dificultad: 4,
    personalidad: `Eres Doña Rosa, una señora de 58 años que tiene una panadería tradicional.
    Eres dulce, paciente y te encanta hablar de tus recetas de pan.
    Llevas 30 años haciendo pan y estás muy orgullosa de tu oficio.
    Te gustan los clientes educados y que aprecian el buen pan.
    Si alguien muestra interés genuino en la panadería, te emocionas.
    A veces te pones sentimental hablando de tu difunto esposo que te enseñó a hacer pan.`,
    frasesIniciales: [
      "Buenos días. ¿Huele rico verdad? Es pan recién horneado.",
      "Pásale, pásale. ¿Qué pancito se te antoja hoy?",
      "¡Hola! Mira qué conchas tan bonitas me quedaron hoy.",
    ],
    productoQueVende: "pan dulce mexicano",
  },
};

export interface MensajeChat {
  rol: "usuario" | "vendedor" | "sistema";
  contenido: string;
}

export interface ResultadoConversacion {
  frutasGanadas: number;
  mensajeFinal: string;
  exito: boolean;
}

// Respuestas de fallback cuando la API falla
const RESPUESTAS_FALLBACK: Record<string, string[]> = {
  tacos: [
    "Mmm... déjame pensar. ¿Y por qué debería darte tacos gratis?",
    "¿Eso es todo lo que tienes? Convénceme mejor.",
    "Interesante... pero no me convences todavía.",
  ],
  frutas: [
    "¡Ay mijo! Qué cosas dices. Cuéntame más.",
    "Mmm, está bien, pero necesito saber más de ti.",
    "¡Qué lindo! Pero las frutas no son gratis, ¿eh?",
  ],
  dulces: [
    "¡Ja! Esa estuvo buena. ¿Qué más tienes?",
    "Me caes bien, pero necesitas convencerme más.",
    "Órale, órale, sigue platicando.",
  ],
  elotes: [
    "Ajá, y luego... ¿qué más?",
    "Mira, estoy ocupada, pero te escucho.",
    "Eso no es suficiente. Convénceme.",
  ],
  pan: [
    "Qué bonito lo que dices. Cuéntame más.",
    "Me recuerdas a alguien... sigue platicando.",
    "El pan es mi orgullo. ¿Por qué debería dártelo?",
  ],
};

export async function enviarMensajeGemini(
  vendedor: VendedorPersonalidad,
  historialMensajes: MensajeChat[],
  mensajeUsuario: string,
  rondaActual: number,
  totalRondas: number,
  intentos: number = 0
): Promise<{ respuesta: string; resultado?: ResultadoConversacion }> {
  // Máximo de intentos
  const maxIntentos = Math.max(API_KEYS.length, 1);

  if (intentos >= maxIntentos) {
    // Usar respuesta de fallback
    const respuestasFallback = RESPUESTAS_FALLBACK[vendedor.tipo] || RESPUESTAS_FALLBACK.tacos;
    const respuestaRandom = respuestasFallback[Math.floor(Math.random() * respuestasFallback.length)];

    const esUltimaRonda = rondaActual >= totalRondas;
    if (esUltimaRonda) {
      const frutasBase = Math.max(1, 5 - Math.floor(vendedor.dificultad / 2));
      const frutasRandom = frutasBase + Math.floor(Math.random() * 3);
      return {
        respuesta: `Bueno, está bien... te daré algo. ¡Toma!`,
        resultado: {
          frutasGanadas: frutasRandom,
          mensajeFinal: `¡${vendedor.nombre} te dio ${frutasRandom} ${vendedor.productoQueVende}!`,
          exito: true,
        },
      };
    }
    return { respuesta: respuestaRandom };
  }

  const apiKey = getNextApiKey();

  const esUltimaRonda = rondaActual >= totalRondas;

  const systemPrompt = `${vendedor.personalidad}

REGLAS DEL JUEGO:
- Estás en un tianguis mexicano y el jugador (un gatito) quiere que le regales ${vendedor.productoQueVende}.
- Tu dificultad de convencer es ${vendedor.dificultad}/10 (donde 10 es muy difícil).
- Esta es la ronda ${rondaActual} de ${totalRondas}.
- Responde SIEMPRE en español mexicano, de forma natural y en primera persona.
- Tus respuestas deben ser cortas (1-2 oraciones completas).
- NUNCA dejes oraciones incompletas. Siempre termina lo que empiezas a decir.
- Mantén tu personalidad consistente.

${esUltimaRonda ? `
IMPORTANTE: Esta es la ÚLTIMA ronda. Debes decidir cuántas frutas darle al jugador.
Al final de tu respuesta, DEBES incluir en una línea separada:
[FRUTAS: X]
Donde X es un número del 0 al 15 basado en qué tan bien te convenció.

CRITERIOS ESTRICTOS:
- 0: Excusa terrible, grosero, no tiene sentido, o simplemente no te convenció nada. RECHAZA sin pena.
- 1-2: Excusa muy mala o poco esfuerzo. Casi lo rechazas pero le das algo mínimo.
- 3-4: Excusa normal, nada especial. Lo estándar.
- 5-7: Buena excusa, te hizo reír o pensar.
- 8-10: Muy buena excusa, realmente te convenció.
- 11-15: Excusa INCREÍBLE (muy muy raro, casi nunca dar esto).

IMPORTANTE: Tu dificultad es ${vendedor.dificultad}/10. Si eres difícil (7+), sé MUY exigente y da 0-2 frutas a excusas normales.
Si el jugador dice tonterías, insulta, o su excusa no tiene sentido, dale 0 frutas sin dudar.
No tengas miedo de rechazar. Es parte del juego.
` : ''}`;

  const mensajesFormateados = historialMensajes.map(m => ({
    role: m.rol === "usuario" ? "user" : "model",
    parts: [{ text: m.contenido }]
  }));

  // Agregar el mensaje actual del usuario
  mensajesFormateados.push({
    role: "user",
    parts: [{ text: mensajeUsuario }]
  });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: mensajesFormateados,
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 1000,
            thinkingConfig: {
              thinkingBudget: 0
            },
          },
        }),
      }
    );

    if (!response.ok) {
      // Si falla, intentar con otra key (máximo 3 intentos)
      console.error(`Error con API key ${intentos + 1}/${API_KEYS.length}, intentando con otra...`);
      return enviarMensajeGemini(vendedor, historialMensajes, mensajeUsuario, rondaActual, totalRondas, intentos + 1);
    }

    const data = await response.json();
    let respuestaTexto = data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Hmm... no sé qué decir.";

    // Si es la última ronda, extraer las frutas
    if (esUltimaRonda) {
      const matchFrutas = respuestaTexto.match(/\[FRUTAS:\s*(\d+)\]/i);
      let frutasGanadas = 3; // Por defecto

      if (matchFrutas) {
        frutasGanadas = Math.min(15, Math.max(0, parseInt(matchFrutas[1])));
        respuestaTexto = respuestaTexto.replace(/\[FRUTAS:\s*\d+\]/i, "").trim();
      }

      return {
        respuesta: respuestaTexto,
        resultado: {
          frutasGanadas,
          mensajeFinal: frutasGanadas > 0
            ? `¡${vendedor.nombre} te dio ${frutasGanadas} ${vendedor.productoQueVende}!`
            : `${vendedor.nombre} no te dio nada esta vez.`,
          exito: frutasGanadas > 0,
        },
      };
    }

    return { respuesta: respuestaTexto };
  } catch (error) {
    console.error("Error llamando a Gemini:", error);
    throw error;
  }
}
