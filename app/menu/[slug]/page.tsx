import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase-server";
import type { MenuCategoryWithItems } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createAdminClient();
  const { data: business } = await supabase
    .from("businesses")
    .select("name")
    .eq("slug", slug)
    .single();

  if (!business) return { title: "Menú no encontrado" };

  return {
    title: `${business.name} — Menú`,
    description: `Consultá el menú digital de ${business.name}`,
  };
}

export const revalidate = 60;

export default async function MenuPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("id, name, category")
    .eq("slug", slug)
    .single();

  if (!business) notFound();

  const { data: categories } = await supabase
    .from("menu_categories")
    .select(`
      id, name, description, display_order,
      menu_items (
        id, name, description, price, image_url, is_available, tags, display_order
      )
    `)
    .eq("business_id", business.id)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  const menu: MenuCategoryWithItems[] = (categories ?? []).map((cat) => ({
    ...cat,
    slug: "",
    business_id: business.id,
    is_active: true,
    created_at: "",
    updated_at: "",
    menu_items: (cat.menu_items ?? [])
      .filter((i) => i.is_available)
      .sort((a, b) => a.display_order - b.display_order)
      .map((i) => ({
        ...i,
        category_id: cat.id,
        business_id: business.id,
        created_at: "",
        updated_at: "",
      })),
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

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {cat.menu_items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: "var(--white)",
                      borderRadius: 14,
                      padding: "14px 16px",
                      boxShadow: "var(--shadow)",
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                    }}
                  >
                    {item.image_url && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.image_url}
                        alt={item.name}
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: 10,
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 15,
                            fontWeight: 500,
                            color: "var(--ink)",
                          }}
                        >
                          {item.name}
                        </span>
                        <span
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: "var(--ink)",
                            flexShrink: 0,
                          }}
                        >
                          ${Number(item.price).toLocaleString("es-AR")}
                        </span>
                      </div>

                      {item.description && (
                        <p
                          style={{
                            fontSize: 13,
                            color: "var(--graphite)",
                            marginTop: 4,
                            lineHeight: 1.5,
                          }}
                        >
                          {item.description}
                        </p>
                      )}

                      {item.tags && item.tags.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 6,
                            marginTop: 8,
                          }}
                        >
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                fontSize: 11,
                                fontWeight: 500,
                                padding: "2px 8px",
                                borderRadius: 9999,
                                background: "var(--fog)",
                                color: "var(--ash)",
                                border: "1px solid var(--dove)",
                              }}
                            >
                              {TAG_LABELS[tag] ?? tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
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

const TAG_LABELS: Record<string, string> = {
  spicy: "🌶 Picante",
  "sin-gluten": "Sin TACC",
  vegano: "Vegano",
  "sin-huevo": "Sin huevo",
};
