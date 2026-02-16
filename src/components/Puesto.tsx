"use client";

import { useState, useEffect } from "react";
import { useTianguis, Puesto as PuestoType } from "@/contexts/TianguisContext";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface PuestoProps {
  puesto: PuestoType;
}

const toldoColors: Record<PuestoType["type"], string> = {
  tacos: "#FF6B6B",
  frutas: "#95E1D3",
  dulces: "#F38181",
  elotes: "#FFE66D",
  jugos: "#4ECDC4",
  pan: "#FFEAA7",
  quesadillas: "#FF7675",
};

// Componente para puesto de TACOS - Estilo carrito con parrilla lateral
function PuestoTacos({ puesto, isNear }: { puesto: PuestoType; isNear: boolean }) {
  return (
    <group>
      {/* Base del carrito */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 1, 1.5]} />
        <meshStandardMaterial color="#8B4513" roughness={0.85} />
      </mesh>

      {/* Parrilla/Comal lateral grande */}
      <mesh position={[-1.2, 1.1, 0]} castShadow>
        <boxGeometry args={[0.8, 0.05, 1.2]} />
        <meshStandardMaterial color="#2C2C2C" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Contenedor de tortillas */}
      <mesh position={[0.8, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.3, 16]} />
        <meshStandardMaterial color="#D2691E" />
      </mesh>

      {/* Toldo rectangular inclinado */}
      <mesh position={[0, 2.8, -0.3]} rotation={[Math.PI / 6, 0, 0]} castShadow>
        <boxGeometry args={[3.5, 0.08, 2]} />
        <meshStandardMaterial color={toldoColors.tacos} roughness={0.95} side={THREE.DoubleSide} />
      </mesh>

      {/* Postes */}
      <mesh position={[-1.5, 1.5, -0.7]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 2, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[1.5, 1.5, -0.7]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 2, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Letrero colgante */}
      <group position={[0, 3.2, -0.5]}>
        <mesh castShadow>
          <boxGeometry args={[2, 0.4, 0.08]} />
          <meshStandardMaterial color="#2C1810" />
        </mesh>
        <Text position={[0, 0, 0.05]} fontSize={0.2} color="#FFFFFF" anchorX="center" anchorY="middle">
          {puesto.nombre}
        </Text>
      </group>

      {isNear && !puesto.completado && (
        <Text position={[0, 2, 0.5]} fontSize={0.2} color="#FFD700" anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000000">
          [E] Hablar
        </Text>
      )}

      <pointLight position={[0, 2.5, 0]} intensity={2} distance={5} color={toldoColors.tacos} />
    </group>
  );
}

// Componente para puesto de FRUTAS - Mesa abierta con display elevado
function PuestoFrutas({ puesto, isNear }: { puesto: PuestoType; isNear: boolean }) {
  return (
    <group>
      {/* Mesa baja y amplia */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.5, 0.8, 2]} />
        <meshStandardMaterial color="#A0522D" roughness={0.8} />
      </mesh>

      {/* Display inclinado para frutas */}
      <mesh position={[0, 0.9, 0.3]} rotation={[-Math.PI / 8, 0, 0]} castShadow>
        <boxGeometry args={[3.2, 0.6, 1.5]} />
        <meshStandardMaterial color="#D2691E" roughness={0.9} />
      </mesh>

      {/* Canastas de frutas */}
      {[-1, 0, 1].map((x, i) => (
        <group key={i} position={[x, 1.3, 0.2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.25, 0.2, 0.15, 12]} />
            <meshStandardMaterial color="#CD853F" />
          </mesh>
          <mesh position={[0, 0.15, 0]} castShadow>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color={["#FF0000", "#FFA500", "#FFD700"][i]} />
          </mesh>
        </group>
      ))}

      {/* Toldo tipo sombrilla */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[2, 0.4, 8]} />
        <meshStandardMaterial color={toldoColors.frutas} roughness={0.95} />
      </mesh>

      {/* Poste central grueso */}
      <mesh position={[0, 2, -1]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 3.2, 10]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Letrero en poste */}
      <mesh position={[0, 2.5, -1.2]} castShadow>
        <boxGeometry args={[2.5, 0.5, 0.08]} />
        <meshStandardMaterial color="#2C1810" />
      </mesh>
      <Text position={[0, 2.5, -1.15]} fontSize={0.22} color="#FFFFFF" anchorX="center" anchorY="middle">
        {puesto.nombre}
      </Text>

      {isNear && !puesto.completado && (
        <Text position={[0, 2.2, 0]} fontSize={0.2} color="#FFD700" anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000000">
          [E] Hablar
        </Text>
      )}

      <pointLight position={[0, 3, 0]} intensity={2} distance={5} color={toldoColors.frutas} />
    </group>
  );
}

// Componente para puesto de DULCES - Estilo vitrina vertical
function PuestoDulces({ puesto, isNear }: { puesto: PuestoType; isNear: boolean }) {
  return (
    <group>
      {/* Base/mostrador */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 1.2, 1.8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Vitrina de vidrio */}
      <mesh position={[0, 1.8, 0.3]} castShadow>
        <boxGeometry args={[2.2, 1.8, 0.8]} />
        <meshStandardMaterial color="#E0F7FA" transparent opacity={0.3} roughness={0.1} />
      </mesh>

      {/* Marco de la vitrina */}
      <mesh position={[0, 1.8, 0.3]} castShadow>
        <boxGeometry args={[2.3, 1.85, 0.05]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Frascos dentro */}
      {[-0.6, 0, 0.6].map((x, i) => (
        <group key={i} position={[x, 1.5, 0.3]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.5, 16]} />
            <meshStandardMaterial color={["#FFB6C1", "#98FB98", "#FFD700"][i]} transparent opacity={0.7} />
          </mesh>
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.17, 0.17, 0.06, 16]} />
            <meshStandardMaterial color="#CD7F32" metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Toldo pequeño en la parte superior */}
      <mesh position={[0, 3, 0]} rotation={[Math.PI / 10, 0, 0]} castShadow>
        <boxGeometry args={[2.8, 0.08, 1.2]} />
        <meshStandardMaterial color={toldoColors.dulces} roughness={0.95} />
      </mesh>

      {/* Letrero arriba */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <boxGeometry args={[2.5, 0.4, 0.08]} />
        <meshStandardMaterial color="#2C1810" />
      </mesh>
      <Text position={[0, 3.5, 0.05]} fontSize={0.18} color="#FFFFFF" anchorX="center" anchorY="middle">
        {puesto.nombre}
      </Text>

      {isNear && !puesto.completado && (
        <Text position={[0, 2.8, 0.8]} fontSize={0.2} color="#FFD700" anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000000">
          [E] Hablar
        </Text>
      )}

      <pointLight position={[0, 2.5, 0.5]} intensity={2} distance={5} color={toldoColors.dulces} />
    </group>
  );
}

// Componente para puesto de ELOTES - Carrito con olla grande
function PuestoElotes({ puesto, isNear }: { puesto: PuestoType; isNear: boolean }) {
  return (
    <group>
      {/* Carrito bajo y ancho */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 1, 2.2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Olla grande de vapor al frente */}
      <mesh position={[0, 1.2, 0.5]} castShadow>
        <cylinderGeometry args={[0.5, 0.45, 0.8, 24]} />
        <meshStandardMaterial color="#4A4A4A" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Tapa de la olla */}
      <mesh position={[0, 1.65, 0.5]} castShadow>
        <cylinderGeometry args={[0.52, 0.47, 0.12, 24]} />
        <meshStandardMaterial color="#5A5A5A" metalness={0.8} />
      </mesh>

      {/* Manija */}
      <mesh position={[0, 1.75, 0.5]} castShadow>
        <torusGeometry args={[0.1, 0.04, 8, 16]} />
        <meshStandardMaterial color="#3A3A3A" metalness={0.7} />
      </mesh>

      {/* Área de condimentos */}
      <mesh position={[-0.8, 1.05, 0]} castShadow>
        <boxGeometry args={[0.8, 0.2, 0.6]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>

      {/* Toldo curvo tipo carpa */}
      <mesh position={[0, 3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[1.2, 1.2, 3, 16, 1, true, 0, Math.PI]} />
        <meshStandardMaterial color={toldoColors.elotes} roughness={0.95} side={THREE.DoubleSide} />
      </mesh>

      {/* Postes laterales */}
      <mesh position={[-1.3, 1.8, -1]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 2.8, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[1.3, 1.8, -1]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 2.8, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Letrero lateral */}
      <mesh position={[1.5, 2.2, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[2, 0.5, 0.08]} />
        <meshStandardMaterial color="#2C1810" />
      </mesh>
      <Text position={[1.55, 2.2, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.2} color="#FFFFFF" anchorX="center" anchorY="middle">
        {puesto.nombre}
      </Text>

      {isNear && !puesto.completado && (
        <Text position={[0, 2.5, 0]} fontSize={0.2} color="#FFD700" anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000000">
          [E] Hablar
        </Text>
      )}

      <pointLight position={[0, 2.8, 0]} intensity={2} distance={5} color={toldoColors.elotes} />
    </group>
  );
}

// Componente para puesto de PAN - Estilo panadería con vitrina frontal
function PuestoPan({ puesto, isNear }: { puesto: PuestoType; isNear: boolean }) {
  return (
    <group>
      {/* Base amplia */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 1.4, 2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Vitrina frontal inclinada */}
      <mesh position={[0, 1.6, 0.7]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
        <boxGeometry args={[2.8, 0.8, 0.05]} />
        <meshStandardMaterial color="#E0F7FA" transparent opacity={0.4} roughness={0.1} />
      </mesh>

      {/* Canastas de pan */}
      <group position={[0, 1.5, 0]}>
        {/* Canasta grande central */}
        <mesh castShadow>
          <cylinderGeometry args={[0.5, 0.4, 0.3, 12]} />
          <meshStandardMaterial color="#D2691E" roughness={0.95} />
        </mesh>

        {/* Panes variados */}
        {[-0.2, 0, 0.2].map((x, i) => (
          <mesh key={i} position={[x, 0.25, 0]} castShadow>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color={["#FFDEAD", "#DEB887", "#CD853F"][i]} />
          </mesh>
        ))}
      </group>

      {/* Estantes laterales */}
      <mesh position={[-1.2, 1.5, 0]} castShadow>
        <boxGeometry args={[0.4, 0.05, 1.5]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>
      <mesh position={[1.2, 1.5, 0]} castShadow>
        <boxGeometry args={[0.4, 0.05, 1.5]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>

      {/* Toldo estilo panadería */}
      <mesh position={[0, 3.2, 0.3]} rotation={[-Math.PI / 8, 0, 0]} castShadow>
        <boxGeometry args={[3.5, 0.08, 1.5]} />
        <meshStandardMaterial color={toldoColors.pan} roughness={0.95} />
      </mesh>

      {/* Rayas del toldo */}
      <mesh position={[0, 3.15, 0.3]} rotation={[-Math.PI / 8, 0, 0]} castShadow>
        <boxGeometry args={[3.5, 0.09, 0.1]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.95} />
      </mesh>

      {/* Postes esquineros */}
      {[[-1.5, 0.9], [1.5, 0.9]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 1.8, pos[1]]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 2.8, 10]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      ))}

      {/* Letrero grande arriba */}
      <mesh position={[0, 4, 0]} castShadow>
        <boxGeometry args={[3, 0.6, 0.1]} />
        <meshStandardMaterial color="#2C1810" />
      </mesh>
      <Text position={[0, 4, 0.06]} fontSize={0.25} color="#FFFFFF" anchorX="center" anchorY="middle">
        {puesto.nombre}
      </Text>

      {isNear && !puesto.completado && (
        <Text position={[0, 2.8, 0.8]} fontSize={0.2} color="#FFD700" anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000000">
          [E] Hablar
        </Text>
      )}

      <pointLight position={[0, 3, 0]} intensity={2} distance={6} color={toldoColors.pan} />
    </group>
  );
}

export function Puesto({ puesto }: PuestoProps) {
  const { catPosition, setPuestoActual, puestoActual } = useTianguis();
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const distance = Math.sqrt(
      Math.pow(catPosition[0] - puesto.position[0], 2) +
        Math.pow(catPosition[2] - puesto.position[2], 2)
    );

    const wasNear = isNear;
    const nowNear = distance < 3;

    setIsNear(nowNear);

    if (nowNear && !wasNear) {
      setPuestoActual(puesto);
    }
    if (!nowNear && wasNear && puestoActual?.id === puesto.id) {
      setPuestoActual(null);
    }
  }, [catPosition, puesto, isNear, setPuestoActual, puestoActual]);

  return (
    <group position={puesto.position} rotation={puesto.rotation}>
      {/* Renderizar el puesto específico según el tipo */}
      {puesto.type === "tacos" && <PuestoTacos puesto={puesto} isNear={isNear} />}
      {puesto.type === "frutas" && <PuestoFrutas puesto={puesto} isNear={isNear} />}
      {puesto.type === "dulces" && <PuestoDulces puesto={puesto} isNear={isNear} />}
      {puesto.type === "elotes" && <PuestoElotes puesto={puesto} isNear={isNear} />}
      {puesto.type === "pan" && <PuestoPan puesto={puesto} isNear={isNear} />}

      {/* Indicador de completado */}
      {puesto.completado && (
        <group position={[0, 2.5, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial
              color="#00FF00"
              emissive="#00FF00"
              emissiveIntensity={0.8}
            />
          </mesh>
          <Text
            position={[0, -0.4, 0]}
            fontSize={0.2}
            color="#00FF00"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            ✓ Completado
          </Text>
        </group>
      )}
    </group>
  );
}
