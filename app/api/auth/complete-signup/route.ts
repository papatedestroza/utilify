import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";
import { slugify } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { userId?: string; businessName?: string };
    const { userId, businessName } = body;

    if (!userId || !businessName?.trim()) {
      return NextResponse.json({ error: "userId y businessName son requeridos" }, { status: 400 });
    }

    const admin = createAdminClient();

    // Verificar identidad del caller
    const authHeader = request.headers.get("Authorization");
    let verifiedUserId: string;

    if (authHeader?.startsWith("Bearer ")) {
      // Caso normal: el usuario acaba de registrarse y tiene sesión activa
      const token = authHeader.slice(7);
      const { data: { user: tokenUser }, error: tokenError } = await admin.auth.getUser(token);
      if (tokenError || !tokenUser || tokenUser.id !== userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      verifiedUserId = tokenUser.id;
    } else {
      // Sin token (email confirmation pendiente): solo permitir si el usuario fue creado hace menos de 2 min
      const { data: { user }, error: userError } = await admin.auth.admin.getUserById(userId);
      if (userError || !user) {
        return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
      }
      const ageMs = Date.now() - new Date(user.created_at).getTime();
      if (ageMs > 2 * 60 * 1000) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      verifiedUserId = user.id;
    }

    // Verificar que el usuario no tenga ya un negocio (evitar duplicados)
    const { data: existing } = await admin
      .from("businesses")
      .select("id")
      .eq("user_id", verifiedUserId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ ok: true, message: "Business already exists" });
    }

    // Slug único con fallback numérico — INSERT directo para evitar TOCTOU
    const baseSlug = slugify(businessName) || `negocio-${Date.now()}`;
    let slug = baseSlug;
    let attempt = 0;
    while (true) {
      const { error: bizError } = await admin.from("businesses").insert({
        user_id: verifiedUserId,
        name: businessName.trim(),
        slug,
        plan: "starter",
      });

      if (!bizError) return NextResponse.json({ ok: true, slug });

      // Colisión de slug único → reintentar con sufijo
      if (bizError.code === "23505" && bizError.message.includes("slug")) {
        attempt++;
        slug = `${baseSlug}-${attempt}`;
        if (attempt > 10) {
          return NextResponse.json({ error: "Error al crear el negocio" }, { status: 500 });
        }
        continue;
      }

      return NextResponse.json({ error: "Error al crear el negocio" }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
