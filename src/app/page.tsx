"use client";

import dynamic from "next/dynamic";
import { TianguisProvider } from "@/contexts/TianguisContext";

const Scene = dynamic(() => import("@/components/Scene"), {
  ssr: false,
});

export default function Home() {
  return (
    <TianguisProvider>
      <main className="w-screen h-screen overflow-hidden bg-[#87CEEB]">
        <Scene />
        {/* UI overlay vendrá después */}
        <div className="absolute top-4 left-4 text-white bg-black/50 px-4 py-2 rounded">
          <p className="text-sm">Usa WASD o Flechas para moverte</p>
          <p className="text-sm">Shift para correr</p>
          <p className="text-sm">Space para saltar</p>
        </div>
      </main>
    </TianguisProvider>
  );
}
