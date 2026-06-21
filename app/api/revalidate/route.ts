import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    // Verificar sesión activa del usuario
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user || authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { businessSlug, businessId } = body as {
      businessSlug?: string;
      businessId?: string;
    };

    if (!businessSlug || !businessId) {
      return NextResponse.json({ error: "Missing businessSlug or businessId" }, { status: 400 });
    }

    // Verificar que el negocio pertenece al usuario autenticado
    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .eq("id", businessId)
      .eq("user_id", user.id)
      .single();

    if (!business) {
      return NextResponse.json({ error: "Business not found or unauthorized" }, { status: 403 });
    }

    revalidateTag(`menu-${businessSlug}`);

    const adminSupabase = createAdminClient();
    await adminSupabase.from("menu_publications").insert({
      business_id: businessId,
      triggered_by: user.id,
      webhook_status: "ok",
      webhook_response: null,
    });

    // TODO: llamar a FastAPI para disparar webhook hacia la web del cliente
    // if (process.env.FASTAPI_URL) {
    //   await fetch(`${process.env.FASTAPI_URL}/webhooks/menu-updated`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ slug: businessSlug }),
    //   });
    // }

    return NextResponse.json({ revalidated: true, slug: businessSlug });
  } catch (err) {
    console.error("[revalidate]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
