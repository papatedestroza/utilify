import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import CategoryForm from "@/components/cms/CategoryForm";

export const metadata = { title: "Nueva categoría — CMS" };

export default async function NewCategoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!business) redirect("/admin");

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
        <span style={{ fontSize: 13, color: "var(--ash)" }}>Nueva categoría</span>
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
        Nueva categoría
      </h1>

      <CategoryForm businessId={business.id} />
    </div>
  );
}
