"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Tipos de puestos
export type PuestoType = "tacos" | "frutas" | "dulces" | "elotes" | "jugos" | "pan" | "quesadillas";

// Información de un puesto
export interface Puesto {
  id: number;
  type: PuestoType;
  position: [number, number, number];
  rotation: [number, number, number];
  nombre: string;
  vendedor: string;
  comidaRecompensa: string;
  completado: boolean;
}

interface TianguisContextType {
  puestos: Puesto[];
  puestoActual: Puesto | null;
  setPuestoActual: (puesto: Puesto | null) => void;
  catPosition: [number, number, number];
  setCatPosition: (pos: [number, number, number]) => void;
  comidasObtenidas: string[];
  agregarComida: (comida: string) => void;
  completarPuesto: (id: number) => void;
}

const TianguisContext = createContext<TianguisContextType | undefined>(undefined);

export function TianguisProvider({ children }: { children: ReactNode }) {
  const [catPosition, setCatPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [puestoActual, setPuestoActual] = useState<Puesto | null>(null);
  const [comidasObtenidas, setComidasObtenidas] = useState<string[]>([]);

  // Definir los puestos del tianguis (5 puestos)
  const [puestos, setPuestos] = useState<Puesto[]>([
    {
      id: 1,
      type: "tacos",
      position: [-5, 0, 0],
      rotation: [0, Math.PI / 2, 0],
      nombre: "Tacos Don José",
      vendedor: "Don José",
      comidaRecompensa: "Tacos al pastor",
      completado: false,
    },
    {
      id: 2,
      type: "frutas",
      position: [5, 0, 0],
      rotation: [0, -Math.PI / 2, 0],
      nombre: "Frutas Frescas",
      vendedor: "Doña María",
      comidaRecompensa: "Ensalada de frutas",
      completado: false,
    },
    {
      id: 3,
      type: "dulces",
      position: [-5, 0, -5],
      rotation: [0, Math.PI / 2, 0],
      nombre: "Dulces Típicos",
      vendedor: "Don Pedro",
      comidaRecompensa: "Dulce de tamarindo",
      completado: false,
    },
    {
      id: 4,
      type: "elotes",
      position: [5, 0, -5],
      rotation: [0, -Math.PI / 2, 0],
      nombre: "Elotes Preparados",
      vendedor: "Doña Carmen",
      comidaRecompensa: "Elote con chile",
      completado: false,
    },
    {
      id: 5,
      type: "pan",
      position: [0, 0, -8],
      rotation: [0, 0, 0],
      nombre: "Panadería",
      vendedor: "Doña Rosa",
      comidaRecompensa: "Concha de chocolate",
      completado: false,
    },
  ]);

  const agregarComida = (comida: string) => {
    setComidasObtenidas((prev) => [...prev, comida]);
  };

  const completarPuesto = (id: number) => {
    setPuestos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, completado: true } : p))
    );
  };

  return (
    <TianguisContext.Provider
      value={{
        puestos,
        puestoActual,
        setPuestoActual,
        catPosition,
        setCatPosition,
        comidasObtenidas,
        agregarComida,
        completarPuesto,
      }}
    >
      {children}
    </TianguisContext.Provider>
  );
}

export function useTianguis() {
  const context = useContext(TianguisContext);
  if (!context) {
    throw new Error("useTianguis debe usarse dentro de TianguisProvider");
  }
  return context;
}
