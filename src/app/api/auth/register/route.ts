import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username y password son requeridos" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Verificar si el username ya existe
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("username")
      .eq("username", username)
      .single();

    if (existingProfile) {
      return NextResponse.json(
        { error: "Este nombre de usuario ya existe" },
        { status: 400 }
      );
    }

    // Crear email falso basado en username
    const fakeEmail = `${username.toLowerCase().replace(/[^a-z0-9]/g, "_")}@tianguis.local`;

    // Crear usuario usando Admin API (bypass email validation)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: fakeEmail,
      password: password,
      email_confirm: true, // Auto-confirmar email
    });

    if (authError) {
      console.error("Auth error:", authError);
      if (authError.message.includes("already been registered")) {
        return NextResponse.json(
          { error: "Este nombre de usuario ya existe" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Error creando usuario" },
        { status: 500 }
      );
    }

    // Crear perfil
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: authData.user.id,
        username: username,
      });

    if (profileError) {
      console.error("Profile error:", profileError);
      // Si falla el perfil, eliminar el usuario creado
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: "Error creando perfil" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, username });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
