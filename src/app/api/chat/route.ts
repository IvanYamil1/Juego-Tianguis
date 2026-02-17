import { NextRequest, NextResponse } from "next/server";
import { enviarMensajeGemini, VENDEDORES, MensajeChat } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tipoVendedor,
      historialMensajes,
      mensajeUsuario,
      rondaActual,
      totalRondas,
    } = body;

    const vendedor = VENDEDORES[tipoVendedor];

    if (!vendedor) {
      return NextResponse.json(
        { error: "Vendedor no encontrado" },
        { status: 400 }
      );
    }

    const resultado = await enviarMensajeGemini(
      vendedor,
      historialMensajes as MensajeChat[],
      mensajeUsuario,
      rondaActual,
      totalRondas
    );

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("Error en API de chat:", error);
    return NextResponse.json(
      { error: "Error procesando el mensaje" },
      { status: 500 }
    );
  }
}

// Endpoint para obtener el mensaje inicial del vendedor
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tipoVendedor = searchParams.get("tipo");

  if (!tipoVendedor) {
    return NextResponse.json(
      { error: "Tipo de vendedor requerido" },
      { status: 400 }
    );
  }

  const vendedor = VENDEDORES[tipoVendedor];

  if (!vendedor) {
    return NextResponse.json(
      { error: "Vendedor no encontrado" },
      { status: 400 }
    );
  }

  // Seleccionar una frase inicial aleatoria
  const fraseInicial =
    vendedor.frasesIniciales[
      Math.floor(Math.random() * vendedor.frasesIniciales.length)
    ];

  return NextResponse.json({
    vendedor: {
      nombre: vendedor.nombre,
      tipo: vendedor.tipo,
      dificultad: vendedor.dificultad,
      productoQueVende: vendedor.productoQueVende,
    },
    mensajeInicial: fraseInicial,
  });
}
