"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { TianguisProvider } from "@/contexts/TianguisContext";
import { DialogoInput } from "@/components/DialogoInput";
import { Inventario } from "@/components/Inventario";
import { AuthScreen } from "@/components/AuthScreen";
import { useAuth } from "@/contexts/AuthContext";

const Scene = dynamic(() => import("@/components/Scene"), {
  ssr: false,
});

function GameContent() {
  const { user, loading, signOut, username } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Iniciar música cuando empieza el juego
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {
        // Autoplay bloqueado, el usuario puede activarlo manualmente
      });
      setMusicPlaying(true);
    }
  }, [isPlaying]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (musicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setMusicPlaying(!musicPlaying);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f5d6ba",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Georgia', 'Times New Roman', serif",
        }}
      >
        <div style={{ textAlign: "center", color: "#3d3428" }}>
          <p style={{ fontSize: "24px", fontStyle: "italic", letterSpacing: "3px" }}>Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está jugando, mostrar el menú (AuthScreen maneja tanto login como menú)
  if (!isPlaying) {
    return <AuthScreen onPlay={() => setIsPlaying(true)} />;
  }

  return (
    <TianguisProvider userId={user?.id}>
      {/* Audio de fondo */}
      <audio ref={audioRef} src="/Musica-fondo.mp3" loop />

      <main
        style={{
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background: "#87CEEB",
        }}
      >
        <Scene />

        {/* UI de controles */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            color: "#3d3428",
            background: "rgba(255, 254, 248, 0.95)",
            padding: "16px 20px",
            borderRadius: "4px",
            backdropFilter: "blur(8px)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            border: "1px solid #e8e0d5",
            fontFamily: "'Georgia', 'Times New Roman', serif",
          }}
        >
          <p
            style={{
              color: "#3d3428",
              fontWeight: "400",
              marginBottom: "12px",
              fontSize: "15px",
              letterSpacing: "1px",
              borderBottom: "1px solid #e8e0d5",
              paddingBottom: "10px",
            }}
          >
            {username || user?.email}
          </p>
          <p style={{ fontSize: "12px", margin: "6px 0", color: "#5a4d3a" }}>
            <span style={{ color: "#a0937d", marginRight: "8px" }}>WASD</span> Moverse
          </p>
          <p style={{ fontSize: "12px", margin: "6px 0", color: "#5a4d3a" }}>
            <span style={{ color: "#a0937d", marginRight: "8px" }}>Shift</span> Correr
          </p>
          <p style={{ fontSize: "12px", margin: "6px 0", color: "#5a4d3a" }}>
            <span style={{ color: "#a0937d", marginRight: "8px" }}>Space</span> Saltar
          </p>
          <p style={{ fontSize: "12px", margin: "6px 0", color: "#3d3428", fontWeight: "500" }}>
            <span style={{ color: "#8b4513", marginRight: "8px" }}>E</span> Hablar con vendedor
          </p>
          <div style={{ marginTop: "14px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              onClick={toggleMusic}
              style={{
                padding: "8px 16px",
                background: musicPlaying ? "#3d3428" : "transparent",
                color: musicPlaying ? "#fffef8" : "#3d3428",
                border: "1px solid #e8e0d5",
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer",
                letterSpacing: "1px",
                fontFamily: "'Georgia', 'Times New Roman', serif",
              }}
            >
              {musicPlaying ? "🔊" : "🔇"}
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
              }}
              style={{
                padding: "8px 16px",
                background: "transparent",
                color: "#3d3428",
                border: "1px solid #e8e0d5",
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer",
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontFamily: "'Georgia', 'Times New Roman', serif",
              }}
            >
              Menú
            </button>
            <button
              onClick={signOut}
              style={{
                padding: "8px 16px",
                background: "#3d3428",
                color: "#fffef8",
                border: "none",
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer",
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontFamily: "'Georgia', 'Times New Roman', serif",
              }}
            >
              Salir
            </button>
          </div>
        </div>

        {/* Inventario/Puntuación */}
        <Inventario />

        {/* Input del diálogo */}
        <DialogoInput />
      </main>
    </TianguisProvider>
  );
}

export default function Home() {
  return <GameContent />;
}
