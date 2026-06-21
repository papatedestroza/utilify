import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import MenuPreview from "@/components/cms/MenuPreview";
import ApprovalActions from "@/components/cms/ApprovalActions";
import type { MenuItem, ContentStatus } from "@/lib/types";

export const metadata = { title: "CMS — Menú" };

const STATUS_LABELS: Record<ContentStatus, string> = {
  draft:     "Borrador",
  pending:   "En revisión",
  published: "Publicado",
};

const STATUS_DOT: Record<ContentStatus, string> = {
  draft:     "var(--dove)",
  pending:   "#D97706",
  published: "var(--delta)",
};

export default async function CMSPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id, name, slug")
    .eq("user_id", user.id)
    .single();

  if (!business) redirect("/admin");

  const { data: categories } = await supabase
    .from("menu_categories")
    .select("*, menu_items(*)")
    .eq("business_id", business.id)
    .order("display_order", { ascending: true });

  const pendingCount = categories?.reduce((acc, cat) => {
    const items = (cat.menu_items as MenuItem[]) ?? [];
    return acc + items.filter((i) => i.status === "pending").length;
  }, 0) ?? 0;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 550,
                color: "var(--ink)",
                letterSpacing: "-.012em",
              }}
            >
              CMS / Web
            </h1>
            {pendingCount > 0 && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 20,
                  height: 20,
                  borderRadius: 9999,
                  background: "#D97706",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "0 6px",
                }}
              >
                {pendingCount}
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, color: "var(--graphite)" }}>
            {business.name} · menú.utilify.com.ar/{business.slug}
          </p>
        </div>
        <Link
          href="/admin/cms/category/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "var(--ink)",
            color: "var(--white)",
            padding: "9px 18px",
            borderRadius: 9999,
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Nueva categoría
        </Link>
      </div>

      <div className="cms-grid" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, alignItems: "start" }}>
        <style>{`@media (max-width: 900px) { .cms-grid { grid-template-columns: 1fr !important; } }`}</style>

        {/* Left: Category list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {!categories || categories.length === 0 ? (
            <div
              style={{
                background: "var(--white)",
                borderRadius: 20,
                padding: "48px 32px",
                textAlign: "center",
                boxShadow: "var(--shadow)",
              }}
            >
              <p style={{ fontSize: 16, color: "var(--graphite)", marginBottom: 16 }}>
                Todavía no tenés categorías.
              </p>
              <Link
                href="/admin/cms/category/new"
                style={{
                  display: "inline-flex",
                  background: "var(--ink)",
                  color: "var(--white)",
                  padding: "10px 20px",
                  borderRadius: 9999,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                Crear primera categoría
              </Link>
            </div>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                style={{
                  background: "var(--white)",
                  borderRadius: 16,
                  padding: "20px 24px",
                  boxShadow: "var(--shadow)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 500, color: "var(--ink)", marginBottom: 2 }}>
                      {cat.name}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--graphite)" }}>
                      {cat.menu_items?.length ?? 0} ítem
                      {(cat.menu_items?.length ?? 0) !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Link
                      href={`/admin/cms/category/${cat.id}`}
                      style={{
                        fontSize: 13,
                        color: "var(--ash)",
                        padding: "6px 12px",
                        borderRadius: 8,
                        border: "1px solid var(--dove)",
                        background: "var(--fog)",
                        textDecoration: "none",
                      }}
                    >
                      Editar
                    </Link>
                    <Link
                      href={`/admin/cms/item/new?category=${cat.id}`}
                      style={{
                        fontSize: 13,
                        color: "var(--rust)",
                        padding: "6px 12px",
                        borderRadius: 8,
                        border: "1px solid rgba(93,42,26,.2)",
                        background: "var(--apricot)",
                        textDecoration: "none",
                      }}
                    >
                      + Ítem
                    </Link>
                  </div>
                </div>

                {cat.menu_items && cat.menu_items.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {(cat.menu_items as MenuItem[]).map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          background: item.status === "pending" ? "#FFFBEB" : "var(--fog)",
                          borderRadius: 10,
                          border: item.status === "pending" ? "1px solid #FDE68A" : "1px solid transparent",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 8,
                                objectFit: "cover",
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 8,
                                background: "var(--dove)",
                                flexShrink: 0,
                                opacity: 0.3,
                              }}
                            />
                          )}
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: 11, color: "var(--graphite)", display: "flex", alignItems: "center", gap: 6 }}>
                              ${Number(item.price).toLocaleString("es-AR")}
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                                <span
                                  style={{
                                    width: 5,
                                    height: 5,
                                    borderRadius: "50%",
                                    background: STATUS_DOT[item.status ?? "draft"],
                                    display: "inline-block",
                                  }}
                                />
                                {STATUS_LABELS[item.status ?? "draft"]}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
                          {/* Acciones inline de aprobación para ítems en revisión */}
                          {item.status === "pending" && (
                            <ApprovalActions itemId={item.id} />
                          )}
                          <div
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: item.is_available ? "var(--delta)" : "var(--dove)",
                            }}
                          />
                          <Link
                            href={`/admin/cms/item/${item.id}`}
                            style={{
                              fontSize: 12,
                              color: "var(--ash)",
                              padding: "4px 10px",
                              borderRadius: 7,
                              border: "1px solid var(--dove)",
                              background: "var(--white)",
                              textDecoration: "none",
                            }}
                          >
                            Editar
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Right: Preview */}
        <MenuPreview
          businessId={business.id}
          businessSlug={business.slug}
          initialCategories={categories ?? []}
        />
      </div>
    </div>
  );
}
