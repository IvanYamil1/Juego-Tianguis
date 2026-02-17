import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Usar service role para bypass de RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("username, total_frutas")
      .order("total_frutas", { ascending: false, nullsFirst: false })
      .limit(20);

    if (error) {
      console.error("Error fetching ranking:", error);
      return NextResponse.json({ error: "Error al obtener ranking" }, { status: 500 });
    }

    // Filtrar usuarios sin username y asegurar que total_frutas sea número
    const cleanData = (data || [])
      .filter((player) => player.username)
      .map((player) => ({
        username: player.username,
        total_frutas: player.total_frutas || 0,
      }));

    return NextResponse.json(cleanData);
  } catch (error) {
    console.error("Error in ranking API:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
