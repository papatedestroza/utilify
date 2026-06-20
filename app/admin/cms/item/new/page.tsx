import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import ItemForm from "@/components/cms/ItemForm";
import type { MenuCategory } from "@/lib/types";

export const metadata = { title: "Nuevo ítem — CMS" };

export default async function NewItemPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categoryId } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!business) redirect("/admin");

  const { data: categories } = await supabase
    .from("menu_categories")
    .select("id, name")
    .eq("business_id", business.id)
    .order("display_order", { ascending: true });

  if (!categories || categories.length === 0) {
    redirect("/admin/cms/category/new");
  }

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
        <span style={{ fontSize: 13, color: "var(--ash)" }}>Nuevo ítem</span>
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
        Nuevo ítem
      </h1>

      <ItemForm
        businessId={business.id}
        categories={categories as MenuCategory[]}
        defaultCategoryId={categoryId}
      />
    </div>
  );
}
