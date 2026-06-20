import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import CategoryForm from "@/components/cms/CategoryForm";

export const metadata = { title: "Editar categoría — CMS" };

export default async function EditCategoryPage({
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

  const { data: category } = await supabase
    .from("menu_categories")
    .select("*")
    .eq("id", id)
    .eq("business_id", business.id)
    .single();

  if (!category) notFound();

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
        <span style={{ fontSize: 13, color: "var(--ash)" }}>Editar categoría</span>
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
        Editar: {category.name}
      </h1>

      <CategoryForm businessId={business.id} category={category} />
    </div>
  );
}
