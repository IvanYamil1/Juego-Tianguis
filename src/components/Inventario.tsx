"use client";

import { useTianguis } from "@/contexts/TianguisContext";
import { useState } from "react";

const NOMBRES_COMIDA: Record<string, string> = {
  tacos: "Tacos",
  frutas: "Frutas",
  dulces: "Dulces",
  elotes: "Elotes",
  pan: "Pan",
};

export function Inventario() {
  const { inventarioFrutas, puestos } = useTianguis();
  const [expandido, setExpandido] = useState(false);

  const puestosCompletados = puestos.filter((p) => p.completado).length;
  const totalPuestos = puestos.length;

  return (
    <div
      style={{
        position: "fixed",
        top: "16px",
        right: "16px",
        zIndex: 40,
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* Panel principal */}
      <div
        style={{
          background: "rgba(255, 254, 248, 0.95)",
          borderRadius: "4px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          border: "1px solid #e8e0d5",
          overflow: "hidden",
          minWidth: "200px",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Header siempre visible */}
        <button
          onClick={() => setExpandido(!expandido)}
          style={{
            width: "100%",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#3d3428",
            fontFamily: "'Georgia', 'Times New Roman', serif",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ textAlign: "left" }}>
              <p
                style={{
                  color: "#3d3428",
                  fontWeight: "400",
                  fontSize: "18px",
                  margin: 0,
                  letterSpacing: "1px",
                }}
              >
                {inventarioFrutas.total} Frutas
              </p>
              <p
                style={{
                  color: "#8a7d6b",
                  fontSize: "12px",
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                {puestosCompletados}/{totalPuestos} puestos
              </p>
            </div>
          </div>
          <span
            style={{
              color: "#a0937d",
              fontSize: "14px",
              transform: expandido ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            ▼
          </span>
        </button>

        {/* Panel expandido */}
        {expandido && (
          <div
            style={{
              borderTop: "1px solid #e8e0d5",
              padding: "16px",
            }}
          >
            <h3
              style={{
                color: "#5a4d3a",
                fontWeight: "400",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "12px",
              }}
            >
              Por Puesto
            </h3>

            {Object.entries(inventarioFrutas)
              .filter(([key]) => key !== "total")
              .map(([tipo, cantidad]) => (
                <div
                  key={tipo}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "rgba(232, 224, 213, 0.5)",
                    borderRadius: "4px",
                    padding: "10px 14px",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ color: "#5a4d3a", fontSize: "14px" }}>
                    {NOMBRES_COMIDA[tipo] || tipo}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        color: "#3d3428",
                        fontWeight: "400",
                        fontSize: "16px",
                      }}
                    >
                      {cantidad}
                    </span>
                    {puestos.find((p) => p.type === tipo)?.completado && (
                      <span style={{ color: "#5a4d3a", fontSize: "12px" }}>✓</span>
                    )}
                  </div>
                </div>
              ))}

            {/* Barra de progreso */}
            <div style={{ marginTop: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11px",
                  color: "#8a7d6b",
                  marginBottom: "6px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                <span>Progreso</span>
                <span>{Math.round((puestosCompletados / totalPuestos) * 100)}%</span>
              </div>
              <div
                style={{
                  height: "6px",
                  background: "#e8e0d5",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${(puestosCompletados / totalPuestos) * 100}%`,
                    background: "linear-gradient(90deg, #5a4d3a, #8a7d6b)",
                    borderRadius: "3px",
                    transition: "width 0.3s",
                  }}
                />
              </div>
            </div>

            {/* Mensaje si completó todo */}
            {puestosCompletados === totalPuestos && (
              <div
                style={{
                  marginTop: "14px",
                  padding: "14px",
                  background: "#3d3428",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "#fffef8", fontWeight: "400", margin: 0, letterSpacing: "1px" }}>
                  ¡Completaste todo!
                </p>
                <p style={{ color: "rgba(255,254,248,0.7)", fontSize: "13px", margin: "6px 0 0 0", fontStyle: "italic" }}>
                  Total: {inventarioFrutas.total} frutas
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
