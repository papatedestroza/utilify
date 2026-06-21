import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { email?: string; module?: string };
    const { email, module = "general" } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const admin = createAdminClient();

    const { error } = await admin
      .from("waitlist")
      .upsert(
        { email: email.toLowerCase().trim(), module },
        { onConflict: "email,module", ignoreDuplicates: true }
      );

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
