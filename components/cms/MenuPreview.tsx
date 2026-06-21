"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-client";
import { toast } from "sonner";
import type { MenuCategoryWithItems } from "@/lib/types";

interface Props {
  businessId: string;
  businessSlug: string;
  initialCategories: MenuCategoryWithItems[];
}

export default function MenuPreview({ businessId, businessSlug, initialCategories }: Props) {
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [confirmPending, setConfirmPending] = useState(false);
  const [lastPublished, setLastPublished] = useState<Date | null>(null);

  async function handlePreview() {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("menu_categories")
      .select("*, menu_items(*)")
      .eq("business_id", businessId)
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (!error && data) {
      setCategories(data as MenuCategoryWithItems[]);
      toast.success("Vista previa actualizada");
    }
    setLoading(false);
  }

  async function handlePublish() {
    setPublishing(true);
    try {
      const res = await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessSlug, businessId }),
      });

      if (res.ok) {
        setLastPublished(new Date());
        setConfirmPending(false);
        toast.success("¡Menú publicado correctamente!");
      } else {
        const data = await res.json().catch(() => ({})) as { error?: string };
        toast.error(data.error ?? "Error al publicar. Intentá de nuevo.");
      }
    } catch {
      toast.error("Error de red al publicar.");
    }
    setPublishing(false);
    setConfirmPending(false);
  }

  const availableCategories = categories.filter(
    (c) => c.is_active && (c.menu_items?.some((i) => i.is_available) ?? false)
  );

  return (
    <div
      style={{
        background: "var(--white)",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "var(--shadow)",
        position: "sticky",
        top: 80,
      }}
    >
      {/* Preview header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--dove)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 550, color: "var(--ink)" }}>
            Vista previa
          </span>
          <Link
            href={`/menu/${businessSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 11,
              color: "var(--graphite)",
              textDecoration: "none",
              padding: "2px 7px",
              borderRadius: 6,
              border: "1px solid var(--dove)",
              background: "var(--fog)",
            }}
          >
            ↗ Ver menú
          </Link>
        </div>
        <button
          onClick={handlePreview}
          disabled={loading}
          style={{
            background: "var(--fog)",
            border: "1px solid var(--dove)",
            borderRadius: 8,
            padding: "5px 12px",
            fontSize: 12,
            color: "var(--ash)",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit",
          }}
        >
          {loading ? "Cargando..." : "↺ Actualizar"}
        </button>
      </div>

      {/* Menu content */}
      <div
        style={{
          maxHeight: 520,
          overflowY: "auto",
          padding: "20px",
        }}
      >
        {availableCategories.length === 0 ? (
          <p style={{ fontSize: 14, color: "var(--dove)", textAlign: "center", padding: "24px 0" }}>
            No hay ítems disponibles todavía.
          </p>
        ) : (
          availableCategories.map((cat) => {
            const items = cat.menu_items?.filter((i) => i.is_available) ?? [];
            return (
              <div key={cat.id} style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--graphite)",
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                    marginBottom: 10,
                    paddingBottom: 6,
                    borderBottom: "1px solid var(--fog)",
                  }}
                >
                  {cat.name}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 10px",
                        background: "var(--fog)",
                        borderRadius: 9,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 6,
                              objectFit: "cover",
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 6,
                              background: "var(--dove)",
                              opacity: 0.3,
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <span
                          style={{
                            fontSize: 13,
                            color: "var(--ink)",
                            fontWeight: 450,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.name}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "var(--ink)",
                          flexShrink: 0,
                          marginLeft: 8,
                        }}
                      >
                        ${Number(item.price).toLocaleString("es-AR")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Publish button */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid var(--dove)",
        }}
      >
        {confirmPending ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ fontSize: 12, color: "var(--ash)", textAlign: "center", margin: 0 }}>
              ¿Publicar el menú en vivo?
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setConfirmPending(false)}
                disabled={publishing}
                style={{
                  flex: 1,
                  background: "var(--fog)",
                  color: "var(--ash)",
                  border: "1px solid var(--dove)",
                  borderRadius: 9999,
                  padding: "10px 0",
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handlePublish}
                disabled={publishing}
                style={{
                  flex: 1,
                  background: publishing ? "var(--dove)" : "var(--rust)",
                  color: "var(--white)",
                  border: "none",
                  borderRadius: 9999,
                  padding: "10px 0",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: publishing ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                {publishing ? "Publicando..." : "Confirmar"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={() => setConfirmPending(true)}
              style={{
                width: "100%",
                background: "var(--ink)",
                color: "var(--white)",
                border: "none",
                borderRadius: 9999,
                padding: "11px 0",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "background .15s ease",
              }}
            >
              Publicar menú
            </button>
            <p
              style={{
                fontSize: 11,
                color: "var(--dove)",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              {lastPublished
                ? `Última publicación: ${lastPublished.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}`
                : "Actualiza el menú visible en tu web."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
