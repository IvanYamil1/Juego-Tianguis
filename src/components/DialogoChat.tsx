"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTianguis } from "@/contexts/TianguisContext";

interface Mensaje {
  rol: "usuario" | "vendedor" | "sistema";
  contenido: string;
}

interface VendedorInfo {
  nombre: string;
  tipo: string;
  dificultad: number;
  productoQueVende: string;
}

const MIN_RONDAS = 3;
const MAX_RONDAS = 5;

export function DialogoChat() {
  const { puestoActual, completarPuesto, agregarFrutas, cerrarDialogo, dialogoAbierto } = useTianguis();
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [inputTexto, setInputTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [vendedorInfo, setVendedorInfo] = useState<VendedorInfo | null>(null);
  const [rondaActual, setRondaActual] = useState(0);
  const [totalRondas, setTotalRondas] = useState(MIN_RONDAS);
  const [conversacionTerminada, setConversacionTerminada] = useState(false);
  const [resultadoFinal, setResultadoFinal] = useState<{
    frutas: number;
    mensaje: string;
  } | null>(null);
  const [mensajeActual, setMensajeActual] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Inicializar conversación cuando se abre el diálogo
  useEffect(() => {
    if (dialogoAbierto && puestoActual) {
      iniciarConversacion();
    }
  }, [dialogoAbierto, puestoActual]);

  // Focus en input
  useEffect(() => {
    if (dialogoAbierto && inputRef.current && !cargando && !conversacionTerminada) {
      inputRef.current.focus();
    }
  }, [dialogoAbierto, cargando, conversacionTerminada, mensajeActual]);

  const iniciarConversacion = async () => {
    if (!puestoActual) return;

    setMensajes([]);
    setRondaActual(0);
    setTotalRondas(Math.floor(Math.random() * (MAX_RONDAS - MIN_RONDAS + 1)) + MIN_RONDAS);
    setConversacionTerminada(false);
    setResultadoFinal(null);
    setMensajeActual("");
    setCargando(true);

    try {
      const response = await fetch(`/api/chat?tipo=${puestoActual.type}`);
      const data = await response.json();

      setVendedorInfo(data.vendedor);
      setMensajeActual(data.mensajeInicial);
      setMensajes([
        {
          rol: "vendedor",
          contenido: data.mensajeInicial,
        },
      ]);
    } catch (error) {
      console.error("Error iniciando conversación:", error);
      setMensajeActual("Error al iniciar la conversación. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const enviarMensaje = async () => {
    if (!inputTexto.trim() || cargando || conversacionTerminada || !puestoActual) return;

    const mensajeUsuario = inputTexto.trim();
    setInputTexto("");
    setCargando(true);
    setMensajeActual("...");

    const nuevaRonda = rondaActual + 1;
    setRondaActual(nuevaRonda);

    // Agregar mensaje del usuario al historial (interno)
    const nuevosMensajes: Mensaje[] = [
      ...mensajes,
      { rol: "usuario", contenido: mensajeUsuario },
    ];
    setMensajes(nuevosMensajes);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipoVendedor: puestoActual.type,
          historialMensajes: mensajes,
          mensajeUsuario,
          rondaActual: nuevaRonda,
          totalRondas,
        }),
      });

      const data = await response.json();

      setMensajeActual(data.respuesta);
      setMensajes((prev) => [
        ...prev,
        { rol: "vendedor", contenido: data.respuesta },
      ]);

      // Si hay resultado final
      if (data.resultado) {
        setConversacionTerminada(true);
        setResultadoFinal({
          frutas: data.resultado.frutasGanadas,
          mensaje: data.resultado.mensajeFinal,
        });
      }
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      setMensajeActual("Error al enviar el mensaje. Intenta de nuevo.");
      setRondaActual(nuevaRonda - 1);
    } finally {
      setCargando(false);
    }
  };

  const terminarConversacion = () => {
    if (resultadoFinal && puestoActual) {
      agregarFrutas(resultadoFinal.frutas, puestoActual.type);
      completarPuesto(puestoActual.id);
    }
    cerrarDialogo();
  };

  const salirSinTerminar = () => {
    cerrarDialogo();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  if (!dialogoAbierto || !puestoActual) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* Burbuja de diálogo del vendedor */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-auto max-w-2xl w-full px-4"
        >
          <div
            className="rounded-2xl p-6 shadow-2xl"
            style={{
              background: "rgba(255, 254, 248, 0.95)",
              border: "3px solid #3d3428",
              fontFamily: "'Georgia', 'Times New Roman', serif"
            }}
          >
            {/* Header con nombre y dificultad */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold" style={{ color: "#3d3428" }}>
                  {vendedorInfo?.nombre || puestoActual.vendedor}
                </span>
                <span
                  className="text-sm px-2 py-1 rounded"
                  style={{ background: "#3d3428", color: "#fffef8" }}
                >
                  {rondaActual}/{totalRondas}
                </span>
              </div>
              <div className="flex gap-0.5">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-4 rounded-sm"
                    style={{
                      background: i < (vendedorInfo?.dificultad || 5) ? "#e74c3c" : "rgba(0,0,0,0.15)"
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Mensaje actual del vendedor */}
            <div className="min-h-[60px]">
              {cargando ? (
                <span className="flex items-center gap-2" style={{ color: "#8a7d6b" }}>
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#8a7d6b", animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#8a7d6b", animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#8a7d6b", animationDelay: "300ms" }} />
                </span>
              ) : (
                <p className="text-lg leading-relaxed" style={{ color: "#3d3428" }}>
                  {mensajeActual}
                </p>
              )}
            </div>
          </div>

          {/* Triángulo de la burbuja */}
          <div
            className="w-0 h-0 mx-auto"
            style={{
              borderLeft: "15px solid transparent",
              borderRight: "15px solid transparent",
              borderTop: "15px solid #3d3428",
            }}
          />
        </motion.div>

        {/* Resultado final */}
        {resultadoFinal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          >
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-8 shadow-2xl border-4 border-white text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-6xl mb-4"
              >
                {resultadoFinal.frutas > 0 ? "🎉" : "😢"}
              </motion.div>
              <p className="text-white font-bold text-2xl mb-2">
                {resultadoFinal.frutas > 0 ? "¡Conseguiste frutas!" : "No conseguiste nada"}
              </p>
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="text-5xl font-black text-white mb-4"
              >
                +{resultadoFinal.frutas}
              </motion.p>
              <button
                onClick={terminarConversacion}
                className="bg-white text-orange-600 font-bold px-8 py-3 rounded-full text-lg hover:bg-orange-100 transition-colors shadow-lg"
              >
                Continuar
              </button>
            </div>
          </motion.div>
        )}

        {/* Barra inferior de input - Estilo Suck Up! */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="absolute bottom-0 left-0 right-0 pointer-events-auto"
        >
          {/* Botón salir */}
          <div className="absolute right-4 -top-12">
            <button
              onClick={salirSinTerminar}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition-colors shadow-lg flex items-center gap-2"
            >
              <span>Salir de la Conversación</span>
            </button>
          </div>

          {!conversacionTerminada && (
            <div className="bg-gradient-to-t from-red-700 via-red-600 to-red-500 p-4 border-t-4 border-red-800">
              <div className="max-w-4xl mx-auto flex items-center gap-3">
                {/* Emoji de micrófono */}
                <div className="bg-red-800 p-3 rounded-full text-2xl">
                  🎤
                </div>

                {/* Input de texto */}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputTexto}
                  onChange={(e) => setInputTexto(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={cargando}
                  placeholder="Escribe algo para convencer..."
                  className="flex-1 px-6 py-4 bg-red-900/50 text-white placeholder-red-300 rounded-full border-2 border-red-400 focus:border-white focus:outline-none text-lg font-medium transition-colors disabled:opacity-50"
                />

                {/* Botón enviar */}
                <button
                  onClick={enviarMensaje}
                  disabled={cargando || !inputTexto.trim()}
                  className="bg-white text-red-600 font-bold px-6 py-4 rounded-full hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Enter
                </button>
              </div>

              {/* Hint */}
              <p className="text-center text-red-200 text-sm mt-2 font-medium">
                Presiona Enter para enviar tu mensaje
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
