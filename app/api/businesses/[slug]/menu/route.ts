import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: business, error: bizError } = await supabase
    .from("businesses")
    .select("id")
    .eq("slug", slug)
    .single();

  if (bizError || !business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const { data: categories, error: catError } = await supabase
    .from("menu_categories")
    .select(`
      id,
      name,
      slug,
      description,
      display_order,
      menu_items (
        id,
        name,
        description,
        price,
        image_url,
        is_available,
        status,
        tags,
        display_order,
        allow_image_zoom,
        pdf_url
      )
    `)
    .eq("business_id", business.id)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (catError) {
    return NextResponse.json({ error: "Error fetching menu" }, { status: 500 });
  }

  const menu = (categories ?? []).map((cat) => ({
    ...cat,
    menu_items: (cat.menu_items ?? [])
      .filter((item) => item.is_available !== false && item.status === "published")
      .sort((a, b) => a.display_order - b.display_order),
  }));

  return NextResponse.json(
    { slug, categories: menu },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
