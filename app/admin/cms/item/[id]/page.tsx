import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import ItemForm from "@/components/cms/ItemForm";
import type { MenuCategory, MenuItem } from "@/lib/types";

export const metadata = { title: "Editar ítem — CMS" };

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!business) redirect("/admin");

  const [{ data: item }, { data: categories }] = await Promise.all([
    supabase
      .from("menu_items")
      .select("*")
      .eq("id", id)
      .eq("business_id", business.id)
      .single(),
    supabase
      .from("menu_categories")
      .select("id, name")
      .eq("business_id", business.id)
      .order("display_order", { ascending: true }),
  ]);

  if (!item) notFound();

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <Link
          href="/admin/cms"
          style={{ fontSize: 13, color: "var(--graphite)", textDecoration: "none" }}
        >
          ← CMS
        </Link>
        <span style={{ color: "var(--dove)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--ash)" }}>Editar ítem</span>
      </div>

      <h1
        style={{
          fontSize: 20,
          fontWeight: 550,
          color: "var(--ink)",
          letterSpacing: "-.012em",
          marginBottom: 24,
        }}
      >
        Editar: {item.name}
      </h1>

      <ItemForm
        businessId={business.id}
        categories={(categories ?? []) as MenuCategory[]}
        item={item as MenuItem}
      />
    </div>
  );
}
