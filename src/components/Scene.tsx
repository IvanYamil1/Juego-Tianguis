"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, memo } from "react";
import { Tianguis } from "./Tianguis";
import { Cat } from "./Cat";
import { KeyboardControls } from "@react-three/drei";

const controls = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "run", keys: ["ShiftLeft", "ShiftRight"] },
  { name: "jump", keys: ["Space"] },
  { name: "interact", keys: ["KeyE", "Enter"] },
];

const MemoizedTianguis = memo(Tianguis);

export default function Scene() {
  return (
    <KeyboardControls map={controls}>
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 13], fov: 60 }}
        style={{ width: "100vw", height: "100vh" }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        frameloop="always"
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          precision: "mediump",
          stencil: false,
          depth: true,
        }}
      >
        {/* Cielo azul */}
        <color attach="background" args={["#87CEEB"]} />
        <fog attach="fog" args={["#87CEEB", 8, 20]} />

        {/* Iluminación */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 15, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <directionalLight
          position={[-10, 10, -5]}
          intensity={0.5}
          color="#ffeedd"
        />

        <Suspense fallback={null}>
          <MemoizedTianguis />
          <Cat />
        </Suspense>
      </Canvas>
    </KeyboardControls>
  );
}
