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

    // Verificar que el usuario existe en auth
    const { data: { user }, error: userError } = await admin.auth.admin.getUserById(userId);
    if (userError || !user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Verificar que el usuario no tenga ya un negocio (evitar duplicados)
    const { data: existing } = await admin
      .from("businesses")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ ok: true, message: "Business already exists" });
    }

    // Slug único con fallback numérico
    const baseSlug = slugify(businessName) || `negocio-${Date.now()}`;
    let slug = baseSlug;
    let attempt = 0;
    while (true) {
      const { data: taken } = await admin
        .from("businesses")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (!taken) break;
      attempt++;
      slug = `${baseSlug}-${attempt}`;
    }

    const { error: bizError } = await admin.from("businesses").insert({
      user_id: userId,
      name: businessName.trim(),
      slug,
      plan: "starter",
    });

    if (bizError) {
      return NextResponse.json({ error: bizError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, slug });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
