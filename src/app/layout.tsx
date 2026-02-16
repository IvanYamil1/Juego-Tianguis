import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Juego del Tianguis - Gato",
  description: "Juego del gato recorriendo el tianguis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
