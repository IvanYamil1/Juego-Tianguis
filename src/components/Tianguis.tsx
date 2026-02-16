"use client";

import { Puesto } from "./Puesto";
import { useTianguis } from "@/contexts/TianguisContext";

export function Tianguis() {
  const { puestos } = useTianguis();

  return (
    <group>
      {/* Piso de tierra/concreto del tianguis - más grande */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#8B7355"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Líneas de los puestos en el piso (marcas) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[20, 0.1]} />
        <meshStandardMaterial color="#6B5345" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 5]}>
        <planeGeometry args={[20, 0.1]} />
        <meshStandardMaterial color="#6B5345" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -5]}>
        <planeGeometry args={[20, 0.1]} />
        <meshStandardMaterial color="#6B5345" />
      </mesh>

      {/* Toldo/techo general del tianguis (opcional, algunos puestos tienen propios) */}
      {/* Podemos agregar lonas/toldos después */}

      {/* Decoraciones del tianguis */}
      {/* Banderines de colores */}
      <group position={[-8, 4, -8]}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[i * 2.5, Math.sin(i * 0.5) * 0.3, 0]}>
            <coneGeometry args={[0.15, 0.4, 3]} />
            <meshStandardMaterial
              color={
                ["#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3", "#F38181"][
                  i % 5
                ]
              }
            />
          </mesh>
        ))}
      </group>

      <group position={[-8, 4, 8]}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[i * 2.5, Math.sin(i * 0.5 + 1) * 0.3, 0]}>
            <coneGeometry args={[0.15, 0.4, 3]} />
            <meshStandardMaterial
              color={
                ["#FFE66D", "#95E1D3", "#FF6B6B", "#4ECDC4", "#F38181"][
                  i % 5
                ]
              }
            />
          </mesh>
        ))}
      </group>

      {/* Decoraciones variadas alrededor del perímetro */}

      {/* Árboles solo en algunas esquinas */}
      {[[-10, 0, -10], [10, 0, 10]].map((pos, i) => (
        <group key={`tree-${i}`} position={pos as [number, number, number]}>
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
            <meshStandardMaterial color="#5D4037" roughness={0.9} />
          </mesh>
          <mesh position={[0, 2.5, 0]} castShadow>
            <sphereGeometry args={[1.2, 8, 8]} />
            <meshStandardMaterial color="#2E7D32" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Farolas/postes de luz */}
      {[
        [-12, 0, -5],
        [-12, 0, 5],
        [12, 0, -5],
        [12, 0, 5],
      ].map((pos, i) => (
        <group key={`lamp-${i}`} position={pos as [number, number, number]}>
          {/* Poste */}
          <mesh position={[0, 2, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 4, 8]} />
            <meshStandardMaterial color="#2C2C2C" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Lámpara */}
          <mesh position={[0, 4.2, 0]} castShadow>
            <sphereGeometry args={[0.25, 12, 12]} />
            <meshStandardMaterial
              color="#FFE5B4"
              emissive="#FFD700"
              emissiveIntensity={0.5}
            />
          </mesh>
          {/* Luz de la farola */}
          <pointLight position={[0, 4, 0]} intensity={3} distance={8} color="#FFE5B4" />
        </group>
      ))}

      {/* Cajas apiladas y elementos de tianguis */}
      {[
        { pos: [-10, 0, 2], color: "#8B4513" },
        { pos: [10, 0, -10], color: "#A0522D" },
        { pos: [-8, 0, -12], color: "#654321" },
      ].map((item, i) => (
        <group key={`boxes-${i}`} position={item.pos as [number, number, number]}>
          {/* Caja inferior */}
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial color={item.color} roughness={0.9} />
          </mesh>
          {/* Caja superior */}
          <mesh position={[0.1, 0.9, -0.1]} rotation={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color={item.color} roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Macetas con plantas */}
      {[
        { pos: [10, 0, -2], plantColor: "#FF1493" },
        { pos: [-10, 0, -8], plantColor: "#FF69B4" },
        { pos: [8, 0, -12], plantColor: "#FFB6C1" },
      ].map((item, i) => (
        <group key={`pot-${i}`} position={item.pos as [number, number, number]}>
          {/* Maceta */}
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.25, 0.6, 12]} />
            <meshStandardMaterial color="#CD853F" roughness={0.8} />
          </mesh>
          {/* Planta/flores */}
          <mesh position={[0, 0.7, 0]} castShadow>
            <sphereGeometry args={[0.35, 8, 8]} />
            <meshStandardMaterial color={item.plantColor} roughness={0.9} />
          </mesh>
          <mesh position={[-0.15, 0.8, 0]} castShadow>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial color={item.plantColor} roughness={0.9} />
          </mesh>
          <mesh position={[0.15, 0.75, 0.1]} castShadow>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial color={item.plantColor} roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Paredes/edificios simples al fondo */}
      <group position={[0, 0, -15]}>
        {/* Edificio izquierdo */}
        <mesh position={[-8, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[4, 5, 1]} />
          <meshStandardMaterial color="#D2B48C" roughness={0.9} />
        </mesh>
        {/* Techo */}
        <mesh position={[-8, 5.1, 0]} castShadow>
          <boxGeometry args={[4.2, 0.3, 1.2]} />
          <meshStandardMaterial color="#8B4513" roughness={0.8} />
        </mesh>

        {/* Edificio derecho */}
        <mesh position={[8, 3, 0]} castShadow receiveShadow>
          <boxGeometry args={[5, 6, 1]} />
          <meshStandardMaterial color="#DEB887" roughness={0.9} />
        </mesh>
        {/* Techo */}
        <mesh position={[8, 6.2, 0]} castShadow>
          <boxGeometry args={[5.2, 0.4, 1.2]} />
          <meshStandardMaterial color="#A0522D" roughness={0.8} />
        </mesh>

        {/* Edificio central pequeño */}
        <mesh position={[0, 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 4, 1]} />
          <meshStandardMaterial color="#E8D4B0" roughness={0.9} />
        </mesh>
        <mesh position={[0, 4.2, 0]} castShadow>
          <boxGeometry args={[3.2, 0.3, 1.2]} />
          <meshStandardMaterial color="#8B6914" roughness={0.8} />
        </mesh>
      </group>

      {/* Stands/puestos vacíos pequeños en los lados */}
      {[
        { pos: [-12, 0, 0], color: "#E0E0E0" },
        { pos: [12, 0, 0], color: "#D0D0D0" },
      ].map((stand, i) => (
        <group key={`stand-${i}`} position={stand.pos as [number, number, number]}>
          {/* Mesa */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[1.5, 1, 1]} />
            <meshStandardMaterial color="#8B4513" roughness={0.85} />
          </mesh>
          {/* Toldo simple */}
          <mesh position={[0, 2, 0]} castShadow>
            <boxGeometry args={[1.6, 0.05, 1.2]} />
            <meshStandardMaterial color={stand.color} roughness={0.9} />
          </mesh>
          {/* Poste */}
          <mesh position={[-0.7, 1.25, -0.5]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 1.5, 6]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
          <mesh position={[0.7, 1.25, -0.5]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 1.5, 6]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
        </group>
      ))}

      {/* Botes de basura */}
      <mesh position={[-7, 0.5, 10]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 1, 8]} />
        <meshStandardMaterial color="#424242" roughness={0.6} />
      </mesh>
      <mesh position={[7, 0.5, 10]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 1, 8]} />
        <meshStandardMaterial color="#424242" roughness={0.6} />
      </mesh>

      {/* Puestos del tianguis */}
      {puestos.map((puesto) => (
        <Puesto
          key={puesto.id}
          puesto={puesto}
        />
      ))}
    </group>
  );
}
