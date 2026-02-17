"use client";

import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type MascotaType = "pomeranian" | "pug" | "gato";

interface MascotaProps {
  tipo: MascotaType;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

// Componente individual para Pomeranian
function Pomeranian({ position, rotation, scale }: Omit<MascotaProps, 'tipo'>) {
  const { scene } = useGLTF("/models/pomeranian/scene.gltf");
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = (position?.[1] || 0) + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene.clone()} />
    </group>
  );
}

// Componente individual para Pug
function Pug({ position, rotation, scale }: Omit<MascotaProps, 'tipo'>) {
  const { scene } = useGLTF("/models/pug/scene.gltf");
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = (position?.[1] || 0) + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene.clone()} />
    </group>
  );
}

// Componente individual para Gato
function Gato({ position, rotation, scale }: Omit<MascotaProps, 'tipo'>) {
  const { scene } = useGLTF("/models/gato_nuevo/scene.gltf");
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = (position?.[1] || 0) + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene.clone()} />
    </group>
  );
}

export function Mascota({ tipo, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }: MascotaProps) {
  const props = { position, rotation, scale };

  switch (tipo) {
    case "pomeranian":
      return <Pomeranian {...props} />;
    case "pug":
      return <Pug {...props} />;
    case "gato":
      return <Gato {...props} />;
    default:
      return null;
  }
}

// Precargar los modelos
useGLTF.preload("/models/pomeranian/scene.gltf");
useGLTF.preload("/models/pug/scene.gltf");
useGLTF.preload("/models/gato_nuevo/scene.gltf");
