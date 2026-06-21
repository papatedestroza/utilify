import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase-server";
import MenuItemCard from "@/components/cms/MenuItemCard";
import type { MenuCategoryWithItems, MenuItem } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const supabase = createAdminClient();
  const { data: businesses } = await supabase.from("businesses").select("slug");
  return (businesses ?? []).map((b) => ({ slug: b.slug as string }));
}

async function getMenuData(slug: string) {
  return unstable_cache(
    async () => {
      const supabase = createAdminClient();

      const { data: business } = await supabase
        .from("businesses")
        .select("id, name, category")
        .eq("slug", slug)
        .single();

      if (!business) return null;

      const { data: categories } = await supabase
        .from("menu_categories")
        .select(`
          id, name, description, display_order,
          menu_items (
            id, name, description, price, image_url, is_available,
            tags, display_order, status, allow_image_zoom, pdf_url
          )
        `)
        .eq("business_id", business.id)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      return { business, categories: categories ?? [] };
    },
    [`menu-data-${slug}`],
    { tags: [`menu-${slug}`], revalidate: 3600 }
  )();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getMenuData(slug);
  if (!data) return { title: "Menú no encontrado" };

  return {
    title: `${data.business.name} — Menú`,
    description: `Consultá el menú digital de ${data.business.name}`,
  };
}

export default async function MenuPage({ params }: Props) {
  const { slug } = await params;
  const data = await getMenuData(slug);

  if (!data) notFound();

  const { business, categories } = data;

  // RF5.1 — Solo ítems publicados y disponibles son visibles al público
  const menu: MenuCategoryWithItems[] = categories.map((cat) => ({
    ...cat,
    slug: "",
    business_id: business.id,
    is_active: true,
    created_at: "",
    updated_at: "",
    menu_items: (cat.menu_items ?? [])
      .filter((i) => i.is_available && i.status === "published")
      .sort((a, b) => a.display_order - b.display_order)
      .map((i) => ({
        ...i,
        category_id: cat.id,
        business_id: business.id,
        created_at: "",
        updated_at: "",
      })) as MenuItem[],
  }));

  const visibleCats = menu.filter((c) => c.menu_items.length > 0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--fog)" }}>
      {/* Header */}
      <header
        style={{
          background: "var(--white)",
          borderBottom: "1px solid var(--dove)",
          padding: "20px 24px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 650,
              color: "var(--ink)",
              letterSpacing: "-.4px",
              margin: 0,
            }}
          >
            {business.name}
          </h1>
          {business.category && (
            <p style={{ fontSize: 13, color: "var(--graphite)", marginTop: 2 }}>
              {business.category}
            </p>
          )}
        </div>
      </header>

      {/* Category nav */}
      {visibleCats.length > 1 && (
        <nav
          aria-label="Categorías del menú"
          style={{
            background: "var(--white)",
            borderBottom: "1px solid var(--dove)",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div
            style={{
              maxWidth: 640,
              margin: "0 auto",
              display: "flex",
              gap: 0,
              padding: "0 24px",
            }}
          >
            {visibleCats.map((cat) => (
              <a
                key={cat.id}
                href={`#cat-${cat.id}`}
                style={{
                  padding: "12px 16px",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--ash)",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  borderBottom: "2px solid transparent",
                  flexShrink: 0,
                }}
              >
                {cat.name}
              </a>
            ))}
          </div>
        </nav>
      )}

      {/* Menu */}
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "24px 16px" }}>
        {visibleCats.length === 0 ? (
          <div
            style={{
              background: "var(--white)",
              borderRadius: 20,
              padding: "48px 32px",
              textAlign: "center",
              boxShadow: "var(--shadow)",
            }}
          >
            <p style={{ fontSize: 16, color: "var(--graphite)" }}>
              El menú está siendo preparado. Volvé pronto.
            </p>
          </div>
        ) : (
          visibleCats.map((cat) => (
            <section key={cat.id} id={`cat-${cat.id}`} style={{ marginBottom: 36 }}>
              <h2
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--graphite)",
                  letterSpacing: ".07em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: "1px solid var(--dove)",
                }}
              >
                {cat.name}
              </h2>

              {cat.description && (
                <p style={{ fontSize: 14, color: "var(--ash)", marginBottom: 12 }}>
                  {cat.description}
                </p>
              )}

              {/* RF5.2 — MenuItemCard ejecuta las interacciones configuradas */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {cat.menu_items.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "24px 16px",
          borderTop: "1px solid var(--dove)",
          marginTop: 16,
        }}
      >
        <a
          href="https://utilify.com.ar"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 12, color: "var(--dove)", textDecoration: "none" }}
        >
          Powered by Utilify
        </a>
      </footer>
    </div>
  );
}
