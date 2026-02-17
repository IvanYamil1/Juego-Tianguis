"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";

interface RankingUser {
  username: string;
  total_frutas: number;
}

const MenuScene = dynamic(() => import("./MenuScene"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: "100%", background: "#f5d6ba" }} />
  ),
});

interface AuthScreenProps {
  onPlay: () => void;
}

export function AuthScreen({ onPlay }: AuthScreenProps) {
  const { signIn, signUp, signOut, user, username: authUsername } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [rankingData, setRankingData] = useState<RankingUser[]>([]);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // Cargar ranking cuando se abre el modal
  useEffect(() => {
    if (showRanking) {
      loadRanking();
    }
  }, [showRanking]);

  const loadRanking = async () => {
    setRankingLoading(true);
    try {
      // Usar API endpoint para obtener ranking (bypass RLS)
      const response = await fetch("/api/ranking");
      if (response.ok) {
        const data = await response.json();
        setRankingData(data);
      } else {
        console.error("Error loading ranking");
      }
    } catch (err) {
      console.error("Error in loadRanking:", err);
    }
    setRankingLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!username.trim()) {
      setError("El nombre de usuario es requerido");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    if (isLogin) {
      const result = await signIn(username, password);
      if (result.error) {
        setError(result.error);
      } else {
        setShowAuthModal(false);
      }
    } else {
      const result = await signUp(username, password);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("¡Cuenta creada! Ya puedes iniciar sesión.");
        setIsLogin(true);
      }
    }

    setLoading(false);
  };

  const handleJugar = () => {
    if (user) {
      onPlay();
    } else {
      setIsLogin(true);
      setShowAuthModal(true);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* Escena 3D de fondo */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <MenuScene />
      </div>

      {/* Overlay sutil */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(212,196,176,0.3) 0%, rgba(212,196,176,0.1) 50%, rgba(212,196,176,0.4) 100%)",
          zIndex: 1,
        }}
      />

      {/* Header - Navegación */}
      <header
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "24px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
            letterSpacing: "2px",
            textTransform: "uppercase",
            textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
          }}
        >
          Tianguis
        </span>

        {/* Si está logueado mostrar usuario, si no mostrar botones de auth */}
        {user ? (
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <span
              style={{
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "500",
                textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
              }}
            >
              {authUsername || user.email}
            </span>
            <button
              onClick={signOut}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.5)",
                color: "#ffffff",
                fontSize: "12px",
                cursor: "pointer",
                letterSpacing: "1px",
                textTransform: "uppercase",
                padding: "8px 16px",
                borderRadius: "20px",
                transition: "all 0.3s ease",
                textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)";
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <nav style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            <button
              onClick={() => {
                setIsLogin(true);
                setShowAuthModal(true);
              }}
              style={{
                background: "none",
                border: "none",
                color: "#ffffff",
                fontSize: "13px",
                cursor: "pointer",
                letterSpacing: "1px",
                textTransform: "uppercase",
                textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setShowAuthModal(true);
              }}
              style={{
                background: "rgba(255,255,255,0.95)",
                border: "none",
                color: "#8b4513",
                fontSize: "13px",
                cursor: "pointer",
                letterSpacing: "1px",
                textTransform: "uppercase",
                padding: "10px 20px",
                borderRadius: "25px",
                transition: "all 0.3s ease",
                fontWeight: "500",
                boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#8b4513";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.95)";
                e.currentTarget.style.color = "#8b4513";
              }}
            >
              Registrarse
            </button>
          </nav>
        )}
      </header>

      {/* Contenido Diagonal - de izquierda a derecha */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        {/* Bienvenido - arriba izquierda */}
        <p
          style={{
            position: "absolute",
            top: "22%",
            left: "8%",
            color: "#ffffff",
            fontSize: "14px",
            fontStyle: "italic",
            letterSpacing: "3px",
            margin: 0,
            textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          Bienvenido al
        </p>

        {/* TIANGUIS - centro izquierda */}
        <h1
          style={{
            position: "absolute",
            top: "30%",
            left: "10%",
            color: "#fffef8",
            fontSize: "clamp(48px, 10vw, 120px)",
            fontWeight: "300",
            letterSpacing: "8px",
            margin: 0,
            lineHeight: 0.9,
            textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          TIANGUIS
        </h1>

        {/* DEL GATO - más abajo y a la derecha */}
        <h2
          style={{
            position: "absolute",
            top: "46%",
            left: "18%",
            color: "#fffef8",
            fontSize: "clamp(36px, 8vw, 90px)",
            fontWeight: "300",
            letterSpacing: "12px",
            margin: 0,
            textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          DEL GATO
        </h2>

        {/* Menú diagonal - opciones */}
        <nav
          style={{
            position: "absolute",
            top: "58%",
            left: "22%",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            pointerEvents: "auto",
          }}
        >
          {/* Jugar */}
          <button
            onClick={handleJugar}
            style={{
              background: "rgba(255,254,248,0.95)",
              border: "none",
              borderRadius: "30px",
              color: "#3d3428",
              fontSize: "15px",
              fontStyle: "italic",
              cursor: "pointer",
              letterSpacing: "2px",
              padding: "14px 40px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              marginLeft: "0px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02) translateX(5px)";
              e.currentTarget.style.boxShadow = "0 6px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1) translateX(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
            }}
          >
            Jugar
          </button>

          {/* Cómo Jugar */}
          <button
            onClick={() => setShowHowToPlay(true)}
            style={{
              background: "rgba(255,254,248,0.85)",
              border: "none",
              borderRadius: "30px",
              color: "#3d3428",
              fontSize: "15px",
              fontStyle: "italic",
              cursor: "pointer",
              letterSpacing: "2px",
              padding: "14px 40px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              marginLeft: "30px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02) translateX(5px)";
              e.currentTarget.style.boxShadow = "0 6px 25px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1) translateX(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
            }}
          >
            Cómo Jugar
          </button>

          {/* Ranking */}
          <button
            onClick={() => setShowRanking(true)}
            style={{
              background: "rgba(255,254,248,0.85)",
              border: "none",
              borderRadius: "30px",
              color: "#3d3428",
              fontSize: "15px",
              fontStyle: "italic",
              cursor: "pointer",
              letterSpacing: "2px",
              padding: "14px 40px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              marginLeft: "60px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02) translateX(5px)";
              e.currentTarget.style.boxShadow = "0 6px 25px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1) translateX(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
            }}
          >
            Ranking
          </button>

          {/* Opciones */}
          <button
            onClick={() => setShowOptions(true)}
            style={{
              background: "rgba(255,254,248,0.85)",
              border: "none",
              borderRadius: "30px",
              color: "#3d3428",
              fontSize: "15px",
              fontStyle: "italic",
              cursor: "pointer",
              letterSpacing: "2px",
              padding: "14px 40px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              marginLeft: "90px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02) translateX(5px)";
              e.currentTarget.style.boxShadow = "0 6px 25px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1) translateX(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
            }}
          >
            Opciones
          </button>
        </nav>
      </div>

      {/* Footer */}
      <footer
        style={{
          position: "absolute",
          bottom: "24px",
          left: "40px",
          right: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 5,
        }}
      >
        <span style={{ color: "#ffffff", fontSize: "12px", fontStyle: "italic", textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>
          Un juego de persuasión con IA
        </span>
      </footer>

      {/* Modal de autenticación elegante */}
      {showAuthModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(61, 52, 40, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setShowAuthModal(false)}
        >
          <div
            style={{
              background: "#fffef8",
              borderRadius: "4px",
              padding: "48px",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAuthModal(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "#a0937d",
              }}
            >
              ×
            </button>

            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "300",
                  color: "#3d3428",
                  margin: 0,
                  letterSpacing: "2px",
                }}
              >
                {isLogin ? "Bienvenido" : "Únete"}
              </h2>
              <p
                style={{
                  color: "#8a7d6b",
                  fontSize: "14px",
                  marginTop: "8px",
                  fontStyle: "italic",
                }}
              >
                {isLogin ? "Ingresa a tu cuenta" : "Crea tu cuenta"}
              </p>
            </div>

            {/* Tabs elegantes */}
            <div
              style={{
                display: "flex",
                marginBottom: "32px",
                borderBottom: "1px solid #e8e0d5",
              }}
            >
              <button
                onClick={() => { setIsLogin(true); setError(""); setSuccess(""); }}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "none",
                  background: "none",
                  fontSize: "13px",
                  cursor: "pointer",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: isLogin ? "#3d3428" : "#a0937d",
                  borderBottom: isLogin ? "2px solid #3d3428" : "2px solid transparent",
                  marginBottom: "-1px",
                  transition: "all 0.2s",
                }}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(""); setSuccess(""); }}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "none",
                  background: "none",
                  fontSize: "13px",
                  cursor: "pointer",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: !isLogin ? "#3d3428" : "#a0937d",
                  borderBottom: !isLogin ? "2px solid #3d3428" : "2px solid transparent",
                  marginBottom: "-1px",
                  transition: "all 0.2s",
                }}
              >
                Registrarse
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#5a4d3a",
                    fontSize: "12px",
                    marginBottom: "8px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Tu nombre en el juego"
                  required
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "1px solid #e8e0d5",
                    borderRadius: "4px",
                    fontSize: "15px",
                    outline: "none",
                    boxSizing: "border-box",
                    background: "#fffef8",
                    color: "#3d3428",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#a0937d"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#e8e0d5"}
                />
              </div>

              <div style={{ marginBottom: "28px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#5a4d3a",
                    fontSize: "12px",
                    marginBottom: "8px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "1px solid #e8e0d5",
                    borderRadius: "4px",
                    fontSize: "15px",
                    outline: "none",
                    boxSizing: "border-box",
                    background: "#fffef8",
                    color: "#3d3428",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#a0937d"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#e8e0d5"}
                />
              </div>

              {error && (
                <div
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#b91c1c",
                    padding: "12px",
                    borderRadius: "4px",
                    marginBottom: "20px",
                    fontSize: "13px",
                  }}
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  style={{
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    color: "#15803d",
                    padding: "12px",
                    borderRadius: "4px",
                    marginBottom: "20px",
                    fontSize: "13px",
                  }}
                >
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: loading ? "#a0937d" : "#3d3428",
                  color: "#fffef8",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  cursor: loading ? "not-allowed" : "pointer",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.background = "#5a4d3a";
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.background = "#3d3428";
                }}
              >
                {loading ? "Cargando..." : isLogin ? "Entrar" : "Crear Cuenta"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cómo Jugar */}
      {showHowToPlay && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(61, 52, 40, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setShowHowToPlay(false)}
        >
          <div
            style={{
              background: "#fffef8",
              borderRadius: "4px",
              padding: "48px",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowHowToPlay(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "#a0937d",
              }}
            >
              x
            </button>

            <h2
              style={{
                fontSize: "28px",
                fontWeight: "300",
                color: "#3d3428",
                margin: "0 0 24px 0",
                letterSpacing: "2px",
                textAlign: "center",
              }}
            >
              Cómo Jugar
            </h2>

            <div style={{ color: "#5a4d3a", fontSize: "14px", lineHeight: "1.8" }}>
              <p style={{ marginBottom: "16px" }}>
                <strong style={{ color: "#3d3428" }}>Objetivo:</strong> Convence a los vendedores del tianguis para obtener comida gratis usando tu habilidad de persuasión.
              </p>

              <p style={{ marginBottom: "12px", fontWeight: "500", color: "#3d3428" }}>Controles:</p>
              <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
                <li><span style={{ color: "#8b4513" }}>WASD</span> - Mover al gato</li>
                <li><span style={{ color: "#8b4513" }}>Shift</span> - Correr</li>
                <li><span style={{ color: "#8b4513" }}>Space</span> - Saltar</li>
                <li><span style={{ color: "#8b4513" }}>E</span> - Hablar con vendedor</li>
              </ul>

              <p style={{ marginBottom: "12px", fontWeight: "500", color: "#3d3428" }}>Consejos:</p>
              <ul style={{ marginLeft: "20px" }}>
                <li>Acércate a un puesto y presiona E para iniciar una conversación</li>
                <li>Cada vendedor tiene diferente nivel de dificultad</li>
                <li>Tienes un número limitado de turnos para convencer</li>
                <li>Sé creativo y persuasivo en tus respuestas</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ranking */}
      {showRanking && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(61, 52, 40, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setShowRanking(false)}
        >
          <div
            style={{
              background: "#fffef8",
              borderRadius: "4px",
              padding: "48px",
              maxWidth: "450px",
              width: "90%",
              boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowRanking(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "#a0937d",
              }}
            >
              x
            </button>

            <h2
              style={{
                fontSize: "28px",
                fontWeight: "300",
                color: "#3d3428",
                margin: "0 0 24px 0",
                letterSpacing: "2px",
                textAlign: "center",
              }}
            >
              Ranking
            </h2>

            {rankingLoading ? (
              <p style={{ textAlign: "center", color: "#8a7d6b", fontStyle: "italic" }}>
                Cargando...
              </p>
            ) : rankingData.length === 0 ? (
              <p style={{ textAlign: "center", color: "#8a7d6b", fontStyle: "italic" }}>
                Aún no hay jugadores registrados.
              </p>
            ) : (
              <div>
                {rankingData.map((player, index) => (
                  <div
                    key={player.username}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      background: index === 0 ? "rgba(139, 69, 19, 0.1)" : "rgba(232, 224, 213, 0.5)",
                      borderRadius: "4px",
                      marginBottom: "8px",
                      borderLeft: index === 0 ? "3px solid #8b4513" : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span
                        style={{
                          color: index === 0 ? "#8b4513" : "#5a4d3a",
                          fontWeight: index < 3 ? "500" : "400",
                          fontSize: "14px",
                          width: "24px",
                        }}
                      >
                        {index + 1}.
                      </span>
                      <span style={{ color: "#3d3428", fontSize: "14px" }}>
                        {player.username}
                      </span>
                    </div>
                    <span
                      style={{
                        color: "#5a4d3a",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {player.total_frutas || 0} pts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Opciones */}
      {showOptions && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(61, 52, 40, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setShowOptions(false)}
        >
          <div
            style={{
              background: "#fffef8",
              borderRadius: "4px",
              padding: "48px",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowOptions(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "#a0937d",
              }}
            >
              x
            </button>

            <h2
              style={{
                fontSize: "28px",
                fontWeight: "300",
                color: "#3d3428",
                margin: "0 0 24px 0",
                letterSpacing: "2px",
                textAlign: "center",
              }}
            >
              Opciones
            </h2>

            <div style={{ color: "#5a4d3a", fontSize: "14px" }}>
              <p style={{ textAlign: "center", fontStyle: "italic", marginBottom: "24px" }}>
                Configuración del juego
              </p>

              <div
                style={{
                  padding: "16px",
                  background: "rgba(232, 224, 213, 0.5)",
                  borderRadius: "4px",
                  marginBottom: "12px",
                }}
              >
                <p style={{ color: "#3d3428", marginBottom: "8px", fontWeight: "500" }}>
                  Cuenta
                </p>
                <p style={{ fontSize: "13px", color: "#8a7d6b" }}>
                  {authUsername || user?.email || "No conectado"}
                </p>
              </div>

              <div
                style={{
                  padding: "16px",
                  background: "rgba(232, 224, 213, 0.5)",
                  borderRadius: "4px",
                  marginBottom: "24px",
                }}
              >
                <p style={{ color: "#3d3428", marginBottom: "8px", fontWeight: "500" }}>
                  Versión
                </p>
                <p style={{ fontSize: "13px", color: "#8a7d6b" }}>
                  1.0.0
                </p>
              </div>

              {user && (
                <button
                  onClick={() => {
                    signOut();
                    setShowOptions(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "#3d3428",
                    color: "#fffef8",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "13px",
                    cursor: "pointer",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Cerrar Sesión
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
