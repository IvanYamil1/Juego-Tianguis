"use client";

import { useState, useRef, useEffect } from "react";
import { useTianguis } from "@/contexts/TianguisContext";

interface Mensaje {
  rol: "usuario" | "vendedor";
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

export function DialogoInput() {
  const { dialogoAbierto, cerrarDialogo, puestoActual, completarPuesto, agregarFrutas } = useTianguis();
  const [inputTexto, setInputTexto] = useState("");
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [cargando, setCargando] = useState(false);
  const [vendedorInfo, setVendedorInfo] = useState<VendedorInfo | null>(null);
  const [rondaActual, setRondaActual] = useState(0);
  const [totalRondas, setTotalRondas] = useState(MIN_RONDAS);
  const [conversacionTerminada, setConversacionTerminada] = useState(false);
  const [resultadoFinal, setResultadoFinal] = useState<{ frutas: number; mensaje: string } | null>(null);
  const [mensajeVendedor, setMensajeVendedor] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Iniciar conversación
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
  }, [dialogoAbierto, cargando, conversacionTerminada, mensajes]);

  const iniciarConversacion = async () => {
    if (!puestoActual) return;

    setMensajes([]);
    setRondaActual(0);
    setTotalRondas(Math.floor(Math.random() * (MAX_RONDAS - MIN_RONDAS + 1)) + MIN_RONDAS);
    setConversacionTerminada(false);
    setResultadoFinal(null);
    setMensajeVendedor("");
    setInputTexto("");
    setCargando(true);

    try {
      const response = await fetch(`/api/chat?tipo=${puestoActual.type}`);
      const data = await response.json();

      setVendedorInfo(data.vendedor);
      setMensajeVendedor(data.mensajeInicial);
      setMensajes([{ rol: "vendedor", contenido: data.mensajeInicial }]);
    } catch (error) {
      console.error("Error iniciando conversación:", error);
      setMensajeVendedor("Error al conectar. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const enviarMensaje = async () => {
    if (!inputTexto.trim() || cargando || conversacionTerminada || !puestoActual) return;

    const mensajeUsuario = inputTexto.trim();
    setInputTexto("");
    setCargando(true);

    const nuevaRonda = rondaActual + 1;
    setRondaActual(nuevaRonda);

    const nuevosMensajes: Mensaje[] = [...mensajes, { rol: "usuario", contenido: mensajeUsuario }];
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

      setMensajeVendedor(data.respuesta);
      setMensajes((prev) => [...prev, { rol: "vendedor", contenido: data.respuesta }]);

      if (data.resultado) {
        setConversacionTerminada(true);
        setResultadoFinal({
          frutas: data.resultado.frutasGanadas,
          mensaje: data.resultado.mensajeFinal,
        });
      }
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      setMensajeVendedor("Error. Intenta de nuevo.");
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  if (!dialogoAbierto || !puestoActual) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* Globo de diálogo del vendedor - arriba */}
      <div
        style={{
          position: "absolute",
          top: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "auto",
          maxWidth: "520px",
          width: "90%",
        }}
      >
        {/* Nombre del vendedor */}
        <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              background: "rgba(61, 52, 40, 0.95)",
              color: "#fffef8",
              fontWeight: "500",
              padding: "8px 20px",
              borderRadius: "4px",
              fontSize: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              letterSpacing: "1px",
            }}
          >
            {vendedorInfo?.nombre || puestoActual.vendedor}
          </span>
          <span
            style={{
              background: "rgba(255,254,248,0.9)",
              color: "#3d3428",
              fontSize: "13px",
              padding: "6px 14px",
              borderRadius: "4px",
              fontStyle: "italic",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            Ronda {rondaActual}/{totalRondas}
          </span>
          {/* Barra de dificultad */}
          <div style={{ display: "flex", gap: "3px", background: "rgba(255,254,248,0.9)", padding: "6px 10px", borderRadius: "4px" }}>
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: "6px",
                  height: "14px",
                  borderRadius: "2px",
                  background: i < (vendedorInfo?.dificultad || 5) ? "#8b4513" : "rgba(139,69,19,0.2)",
                  transition: "background 0.2s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Burbuja de texto del vendedor */}
        <div
          style={{
            position: "relative",
            background: "#fffef8",
            borderRadius: "4px",
            padding: "24px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
            border: "1px solid #e8e0d5",
          }}
        >
          <p
            style={{
              color: "#3d3428",
              fontSize: "18px",
              fontWeight: "400",
              lineHeight: "1.7",
              margin: 0,
              fontStyle: "italic",
            }}
          >
            {cargando ? (
              <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ color: "#8a7d6b" }}>Pensando</span>
                <span style={{ display: "flex", gap: "4px" }}>
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      background: "#a0937d",
                      borderRadius: "50%",
                      animation: "bounce 1s infinite",
                    }}
                  />
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      background: "#a0937d",
                      borderRadius: "50%",
                      animation: "bounce 1s infinite 0.15s",
                    }}
                  />
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      background: "#a0937d",
                      borderRadius: "50%",
                      animation: "bounce 1s infinite 0.3s",
                    }}
                  />
                </span>
              </span>
            ) : (
              mensajeVendedor
            )}
          </p>

          {/* Flecha de la burbuja */}
          <div
            style={{
              position: "absolute",
              bottom: "-12px",
              left: "48px",
              width: 0,
              height: 0,
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderTop: "14px solid #e8e0d5",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-10px",
              left: "50px",
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: "12px solid #fffef8",
            }}
          />
        </div>
      </div>

      {/* Resultado final - centro */}
      {resultadoFinal && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "auto",
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: "#fffef8",
              border: "1px solid #e8e0d5",
              borderRadius: "4px",
              padding: "40px 48px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              textAlign: "center",
              minWidth: "320px",
            }}
          >
            <p
              style={{
                color: "#3d3428",
                fontWeight: "400",
                fontSize: "22px",
                marginBottom: "8px",
                letterSpacing: "1px",
              }}
            >
              {resultadoFinal.frutas > 0 ? "¡Conseguiste comida!" : "No conseguiste nada"}
            </p>
            <p
              style={{
                fontSize: "42px",
                fontWeight: "300",
                color: resultadoFinal.frutas > 0 ? "#5a4d3a" : "#a0937d",
                marginBottom: "16px",
                letterSpacing: "2px",
              }}
            >
              +{resultadoFinal.frutas}
            </p>
            <p
              style={{
                color: "#8a7d6b",
                fontSize: "14px",
                marginBottom: "24px",
                fontStyle: "italic",
                lineHeight: "1.6",
              }}
            >
              {resultadoFinal.mensaje}
            </p>
            <button
              onClick={terminarConversacion}
              style={{
                background: "#3d3428",
                color: "#fffef8",
                fontWeight: "400",
                padding: "14px 36px",
                borderRadius: "4px",
                fontSize: "14px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                letterSpacing: "1px",
                textTransform: "uppercase",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#5a4d3a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#3d3428";
              }}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Barra de input - abajo */}
      {!conversacionTerminada && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            pointerEvents: "auto",
          }}
        >
          {/* Botón salir */}
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 16px", marginBottom: "8px" }}>
            <button
              onClick={() => cerrarDialogo()}
              style={{
                background: "rgba(61, 52, 40, 0.9)",
                color: "#fffef8",
                fontWeight: "400",
                padding: "10px 20px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                fontSize: "13px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(90, 77, 58, 0.95)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(61, 52, 40, 0.9)";
              }}
            >
              Salir
            </button>
          </div>

          <div
            style={{
              padding: "20px",
              background: "linear-gradient(to top, rgba(61, 52, 40, 0.95), rgba(90, 77, 58, 0.9))",
              borderTop: "1px solid rgba(255,254,248,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              style={{
                maxWidth: "768px",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputTexto}
                onChange={(e) => setInputTexto(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={cargando}
                placeholder="Escribe algo para convencer..."
                style={{
                  flex: 1,
                  padding: "14px 20px",
                  borderRadius: "4px",
                  fontSize: "16px",
                  fontWeight: "400",
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  backgroundColor: "rgba(255,254,248,0.95)",
                  color: "#3d3428",
                  border: "1px solid rgba(255,254,248,0.5)",
                  outline: "none",
                  opacity: cargando ? 0.6 : 1,
                  transition: "all 0.2s",
                }}
              />

              <button
                onClick={enviarMensaje}
                disabled={cargando || !inputTexto.trim()}
                style={{
                  background: "#fffef8",
                  color: "#3d3428",
                  fontWeight: "400",
                  padding: "14px 28px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: cargando || !inputTexto.trim() ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                  opacity: cargando || !inputTexto.trim() ? 0.5 : 1,
                  fontSize: "14px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!cargando && inputTexto.trim()) {
                    e.currentTarget.style.background = "#3d3428";
                    e.currentTarget.style.color = "#fffef8";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fffef8";
                  e.currentTarget.style.color = "#3d3428";
                }}
              >
                Enviar
              </button>
            </div>

            <p
              style={{
                textAlign: "center",
                fontSize: "12px",
                marginTop: "10px",
                color: "rgba(255,254,248,0.7)",
                fontStyle: "italic",
                letterSpacing: "1px",
              }}
            >
              Presiona Enter para enviar
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
