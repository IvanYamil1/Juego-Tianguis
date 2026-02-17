"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

// Modelo 3D del gato - posicionado a la derecha
function MenuCatModel() {
  const modelRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/cat.gltf");
  const { actions } = useAnimations(animations, modelRef);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    const runAction = actions["run"];
    if (runAction) {
      runAction.reset().fadeIn(0.2).play();
      runAction.timeScale = 1.2;
    }
  }, [actions]);

  return (
    <group position={[2.5, 0, 0]}>
      <primitive
        ref={modelRef}
        object={scene}
        scale={0.02}
        rotation={[0, -Math.PI / 2, 0]}
      />
    </group>
  );
}

// Piso estilo tianguis - tierra/concreto con colores cálidos
function TianguisFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#c9a66b" roughness={0.95} />
    </mesh>
  );
}

// Lonas de colores típicas del tianguis
function Lonas() {
  const colors = ["#e63946", "#f4a261", "#2a9d8f", "#e9c46a", "#264653"];

  return (
    <group>
      {/* Lona principal arriba */}
      <mesh position={[0, 3.5, -2]} rotation={[0.2, 0, 0]}>
        <planeGeometry args={[12, 4]} />
        <meshStandardMaterial
          color={colors[0]}
          side={THREE.DoubleSide}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Lonas laterales */}
      <mesh position={[-4, 3, -1]} rotation={[0.3, 0.2, 0.1]}>
        <planeGeometry args={[5, 3]} />
        <meshStandardMaterial
          color={colors[1]}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>

      <mesh position={[4, 2.8, 0]} rotation={[0.25, -0.15, -0.1]}>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial
          color={colors[2]}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Banderas de papel picado */}
      <mesh position={[0, 2.5, 1]} rotation={[0.1, 0, 0]}>
        <planeGeometry args={[10, 0.5]} />
        <meshStandardMaterial
          color={colors[3]}
          side={THREE.DoubleSide}
          transparent
          opacity={0.9}
        />
      </mesh>

      <mesh position={[1, 2.3, 1.5]} rotation={[0.1, 0, 0]}>
        <planeGeometry args={[8, 0.4]} />
        <meshStandardMaterial
          color={colors[4]}
          side={THREE.DoubleSide}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

// Cajas y elementos decorativos
function TianguisProps() {
  return (
    <group>
      {/* Cajas de madera */}
      <mesh position={[-2, 0.25, 1]} castShadow>
        <boxGeometry args={[0.8, 0.5, 0.6]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
      </mesh>

      <mesh position={[-2.5, 0.15, 0.5]} castShadow>
        <boxGeometry args={[0.6, 0.3, 0.5]} />
        <meshStandardMaterial color="#a0522d" roughness={0.85} />
      </mesh>

      <mesh position={[-1.5, 0.2, 1.5]} castShadow>
        <boxGeometry args={[0.5, 0.4, 0.4]} />
        <meshStandardMaterial color="#cd853f" roughness={0.9} />
      </mesh>

      {/* Mesa del puesto */}
      <mesh position={[-2, 0.6, 0]} castShadow>
        <boxGeometry args={[2, 0.08, 1.2]} />
        <meshStandardMaterial color="#deb887" roughness={0.8} />
      </mesh>

      {/* Patas de la mesa */}
      <mesh position={[-2.8, 0.3, -0.4]} castShadow>
        <boxGeometry args={[0.08, 0.6, 0.08]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh position={[-1.2, 0.3, -0.4]} castShadow>
        <boxGeometry args={[0.08, 0.6, 0.08]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh position={[-2.8, 0.3, 0.4]} castShadow>
        <boxGeometry args={[0.08, 0.6, 0.08]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh position={[-1.2, 0.3, 0.4]} castShadow>
        <boxGeometry args={[0.08, 0.6, 0.08]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {/* Productos en la mesa (esferas coloridas como frutas) */}
      <mesh position={[-2.3, 0.75, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ff6347" />
      </mesh>
      <mesh position={[-2, 0.75, 0.2]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffa500" />
      </mesh>
      <mesh position={[-1.7, 0.75, -0.1]} castShadow>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#32cd32" />
      </mesh>
      <mesh position={[-2.1, 0.75, -0.2]} castShadow>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#ffff00" />
      </mesh>
    </group>
  );
}

// Placeholder
function CatPlaceholder() {
  return (
    <mesh castShadow position={[2.5, 0.3, 0]}>
      <boxGeometry args={[0.4, 0.3, 0.6]} />
      <meshStandardMaterial color="#d4a574" />
    </mesh>
  );
}

// Cámara enfocando al gato a la derecha
function MenuCamera() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Cámara posicionada para ver el gato a la derecha
    state.camera.position.x = Math.sin(t * 0.08) * 0.3 + 1;
    state.camera.position.y = 1.5 + Math.sin(t * 0.1) * 0.1;
    state.camera.position.z = 5;
    state.camera.lookAt(1.5, 0.5, 0);
  });

  return null;
}

export default function MenuScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [1, 1.5, 5], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
      }}
    >
      {/* Cielo de atardecer mexicano */}
      <color attach="background" args={["#f5d6ba"]} />
      <fog attach="fog" args={["#f5d6ba", 10, 25]} />

      {/* Iluminación cálida de tianguis */}
      <ambientLight intensity={0.7} color="#fff0e0" />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        color="#ffeedd"
      />
      {/* Luz cálida de atardecer */}
      <directionalLight
        position={[-5, 3, -5]}
        intensity={0.5}
        color="#ff9966"
      />
      {/* Luz de relleno */}
      <pointLight position={[0, 3, 2]} intensity={0.4} color="#ffcc99" />

      <Suspense fallback={<CatPlaceholder />}>
        <TianguisFloor />
        <Lonas />
        <TianguisProps />
        <MenuCatModel />
        <MenuCamera />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/models/cat.gltf");
