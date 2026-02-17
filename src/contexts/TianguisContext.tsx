"use client";

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";

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

// Collider para detección de colisiones
export interface Collider {
  position: [number, number, number];
  size: [number, number, number];
  type: string;
}

// Inventario de frutas por tipo
export interface InventarioFrutas {
  tacos: number;
  frutas: number;
  dulces: number;
  elotes: number;
  pan: number;
  total: number;
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
  colliders: Collider[];
  // Nuevo sistema de frutas
  inventarioFrutas: InventarioFrutas;
  agregarFrutas: (cantidad: number, tipo: string) => void;
  // Control del diálogo
  dialogoAbierto: boolean;
  abrirDialogo: () => void;
  cerrarDialogo: () => void;
}

const TianguisContext = createContext<TianguisContextType | undefined>(undefined);

interface TianguisProviderProps {
  children: ReactNode;
  userId?: string;
}

export function TianguisProvider({ children, userId }: TianguisProviderProps) {
  const [catPosition, setCatPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [puestoActual, setPuestoActual] = useState<Puesto | null>(null);
  const [comidasObtenidas, setComidasObtenidas] = useState<string[]>([]);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [inventarioFrutas, setInventarioFrutas] = useState<InventarioFrutas>({
    tacos: 0,
    frutas: 0,
    dulces: 0,
    elotes: 0,
    pan: 0,
    total: 0,
  });

  // Cargar progreso guardado del usuario
  useEffect(() => {
    if (!userId) return;

    const loadProgress = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("inventario, puestos_completados")
        .eq("id", userId)
        .single();

      if (data?.inventario) {
        setInventarioFrutas(data.inventario);
      }
      if (data?.puestos_completados) {
        setPuestos(prev => prev.map(p => ({
          ...p,
          completado: data.puestos_completados.includes(p.id)
        })));
      }
      setProgressLoaded(true);
    };

    loadProgress();
  }, [userId]);

  // Guardar progreso cuando cambia el inventario
  useEffect(() => {
    if (!userId || !progressLoaded) return;

    const saveProgress = async () => {
      const puestosCompletadosIds = puestos.filter(p => p.completado).map(p => p.id);

      await supabase
        .from("profiles")
        .update({
          inventario: inventarioFrutas,
          puestos_completados: puestosCompletadosIds,
          total_frutas: inventarioFrutas.total,
        })
        .eq("id", userId);
    };

    saveProgress();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, inventarioFrutas, progressLoaded]);

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

  const completarPuesto = useCallback((id: number) => {
    setPuestos((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, completado: true } : p));

      // Guardar puestos completados en Supabase
      if (userId && progressLoaded) {
        const completadosIds = updated.filter(p => p.completado).map(p => p.id);
        supabase
          .from("profiles")
          .update({ puestos_completados: completadosIds })
          .eq("id", userId);
      }

      return updated;
    });
  }, [userId, progressLoaded]);

  const agregarFrutas = useCallback((cantidad: number, tipo: string) => {
    setInventarioFrutas((prev) => {
      const tipoKey = tipo as keyof Omit<InventarioFrutas, 'total'>;
      if (tipoKey in prev && tipoKey !== 'total') {
        return {
          ...prev,
          [tipoKey]: prev[tipoKey] + cantidad,
          total: prev.total + cantidad,
        };
      }
      return {
        ...prev,
        total: prev.total + cantidad,
      };
    });
  }, []);

  const abrirDialogo = useCallback(() => {
    setDialogoAbierto(true);
  }, []);

  const cerrarDialogo = useCallback(() => {
    setDialogoAbierto(false);
  }, []);

  // Colliders para todos los objetos sólidos del tianguis
  const colliders: Collider[] = [
    // Puestos principales
    { position: [-5, 0, 0], size: [3.5, 3, 2], type: "puesto-tacos" },
    { position: [5, 0, 0], size: [3.5, 3.5, 2], type: "puesto-frutas" },
    { position: [-5, 0, -5], size: [2.5, 3.5, 1.8], type: "puesto-dulces" },
    { position: [5, 0, -5], size: [2.8, 3, 2.2], type: "puesto-elotes" },
    { position: [0, 0, -8], size: [3, 4, 2], type: "puesto-pan" },

    // Árboles
    { position: [-10, 0, -10], size: [2.5, 4, 2.5], type: "arbol" },
    { position: [10, 0, 10], size: [2.5, 4, 2.5], type: "arbol" },

    // Farolas
    { position: [-12, 0, -5], size: [0.5, 4.5, 0.5], type: "farola" },
    { position: [-12, 0, 5], size: [0.5, 4.5, 0.5], type: "farola" },
    { position: [12, 0, -5], size: [0.5, 4.5, 0.5], type: "farola" },
    { position: [12, 0, 5], size: [0.5, 4.5, 0.5], type: "farola" },

    // Cajas apiladas
    { position: [-10, 0, 2], size: [0.8, 1.5, 0.8], type: "cajas" },
    { position: [10, 0, -10], size: [0.8, 1.5, 0.8], type: "cajas" },
    { position: [-8, 0, -12], size: [0.8, 1.5, 0.8], type: "cajas" },

    // Macetas con plantas
    { position: [10, 0, -2], size: [0.8, 1.2, 0.8], type: "maceta" },
    { position: [-10, 0, -8], size: [0.8, 1.2, 0.8], type: "maceta" },
    { position: [8, 0, -12], size: [0.8, 1.2, 0.8], type: "maceta" },

    // Stands vacíos
    { position: [-12, 0, 0], size: [1.8, 2, 1.2], type: "stand" },
    { position: [12, 0, 0], size: [1.8, 2, 1.2], type: "stand" },

    // Botes de basura
    { position: [-7, 0, 10], size: [0.8, 1, 0.8], type: "basura" },
    { position: [7, 0, 10], size: [0.8, 1, 0.8], type: "basura" },

    // Edificios al fondo
    { position: [-8, 0, -15], size: [4, 5, 1], type: "edificio" },
    { position: [8, 0, -15], size: [5, 6, 1], type: "edificio" },
    { position: [0, 0, -15], size: [3, 4, 1], type: "edificio" },
  ];

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
        colliders,
        inventarioFrutas,
        agregarFrutas,
        dialogoAbierto,
        abrirDialogo,
        cerrarDialogo,
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
