"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";
import type { MenuCategory } from "@/lib/types";

interface Props {
  businessId: string;
  category?: MenuCategory;
}

export default function CategoryForm({ businessId, category }: Props) {
  const router = useRouter();
  const isEdit = !!category;

  const [form, setForm] = useState({
    name: category?.name ?? "",
    description: category?.description ?? "",
    display_order: category?.display_order ?? 0,
    is_active: category?.is_active ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();

    const payload = {
      name: form.name.trim(),
      slug: slugify(form.name),
      description: form.description || null,
      display_order: Number(form.display_order),
      is_active: form.is_active,
    };

    if (isEdit && category) {
      const { error } = await supabase
        .from("menu_categories")
        .update(payload)
        .eq("id", category.id);

      if (error) {
        toast.error("Error al actualizar: " + error.message);
      } else {
        toast.success("Categoría actualizada");
        router.push("/admin/cms");
        router.refresh();
      }
    } else {
      const { error } = await supabase.from("menu_categories").insert({
        ...payload,
        business_id: businessId,
      });

      if (error) {
        toast.error("Error al crear: " + error.message);
      } else {
        toast.success("Categoría creada");
        router.push("/admin/cms");
        router.refresh();
      }
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!category || !confirm("¿Eliminar esta categoría y todos sus ítems?")) return;
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("menu_categories").delete().eq("id", category.id);
    if (error) {
      toast.error("Error al eliminar: " + error.message);
    } else {
      toast.success("Categoría eliminada");
      router.push("/admin/cms");
      router.refresh();
    }
    setDeleting(false);
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <label htmlFor="cat-name" style={labelStyle}>Nombre *</label>
          <input
            id="cat-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ej: Platos principales"
            style={inputStyle}
          />
          {form.name && (
            <p style={{ fontSize: 12, color: "var(--graphite)", marginTop: 4 }}>
              Slug: {slugify(form.name)}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="cat-desc" style={labelStyle}>Descripción</label>
          <textarea
            id="cat-desc"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Descripción opcional..."
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <div>
          <label htmlFor="cat-order" style={labelStyle}>Orden de visualización</label>
          <input
            id="cat-order"
            type="number"
            min={0}
            value={form.display_order}
            onChange={(e) =>
              setForm({ ...form, display_order: parseInt(e.target.value) || 0 })
            }
            style={{ ...inputStyle, width: 120 }}
          />
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            style={{ width: 16, height: 16 }}
          />
          <span style={{ fontSize: 14, color: "var(--ash)" }}>Categoría activa</span>
        </label>

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "var(--dove)" : "var(--ink)",
              color: "var(--white)",
              border: "none",
              borderRadius: 9999,
              padding: "10px 24px",
              fontSize: 14,
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
            }}
          >
            {loading ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear categoría"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/cms")}
            style={{
              background: "var(--fog)",
              color: "var(--ash)",
              border: "1px solid var(--dove)",
              borderRadius: 9999,
              padding: "10px 24px",
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Cancelar
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              style={{
                background: "none",
                color: "var(--rust)",
                border: "1px solid rgba(93,42,26,.2)",
                borderRadius: 9999,
                padding: "10px 24px",
                fontSize: 14,
                cursor: deleting ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                marginLeft: "auto",
              }}
            >
              {deleting ? "Eliminando..." : "Eliminar"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "var(--ash)",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--dove)",
  borderRadius: 10,
  padding: "10px 14px",
  fontSize: 14,
  color: "var(--ink)",
  background: "var(--fog)",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};
