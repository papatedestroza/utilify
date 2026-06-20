"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { toast } from "sonner";
import UploadImage from "./UploadImage";
import type { MenuItem, ItemTag, MenuCategory } from "@/lib/types";

interface Props {
  businessId: string;
  categories: MenuCategory[];
  defaultCategoryId?: string;
  item?: MenuItem;
}

const ALL_TAGS: { id: ItemTag; label: string }[] = [
  { id: "spicy", label: "🌶 Picante" },
  { id: "sin-gluten", label: "🌾 Sin gluten" },
  { id: "vegano", label: "🌱 Vegano" },
  { id: "sin-huevo", label: "🥚 Sin huevo" },
];

export default function ItemForm({ businessId, categories, defaultCategoryId, item }: Props) {
  const router = useRouter();
  const isEdit = !!item;

  const [form, setForm] = useState({
    name: item?.name ?? "",
    description: item?.description ?? "",
    price: item?.price?.toString() ?? "",
    image_url: item?.image_url ?? "",
    is_available: item?.is_available ?? true,
    category_id: item?.category_id ?? defaultCategoryId ?? categories[0]?.id ?? "",
    tags: item?.tags ?? ([] as ItemTag[]),
    display_order: item?.display_order ?? 0,
  });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function toggleTag(tag: ItemTag) {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag)
        ? f.tags.filter((t) => t !== tag)
        : [...f.tags, tag],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const price = parseFloat(form.price);
    if (isNaN(price) || price < 0) {
      toast.error("El precio debe ser un número positivo.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const payload = {
      name: form.name.trim(),
      description: form.description || null,
      price,
      image_url: form.image_url || null,
      is_available: form.is_available,
      category_id: form.category_id,
      tags: form.tags,
      display_order: Number(form.display_order),
    };

    if (isEdit && item) {
      const { error } = await supabase.from("menu_items").update(payload).eq("id", item.id);
      if (error) {
        toast.error("Error al actualizar: " + error.message);
      } else {
        toast.success("Ítem actualizado");
        router.push("/admin/cms");
        router.refresh();
      }
    } else {
      const { error } = await supabase.from("menu_items").insert({
        ...payload,
        business_id: businessId,
      });
      if (error) {
        toast.error("Error al crear: " + error.message);
      } else {
        toast.success("Ítem creado");
        router.push("/admin/cms");
        router.refresh();
      }
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!item || !confirm("¿Eliminar este ítem?")) return;
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("menu_items").delete().eq("id", item.id);
    if (error) {
      toast.error("Error al eliminar: " + error.message);
    } else {
      toast.success("Ítem eliminado");
      router.push("/admin/cms");
      router.refresh();
    }
    setDeleting(false);
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Foto */}
        <div>
          <label style={labelStyle}>Foto</label>
          <UploadImage
            value={form.image_url}
            onChange={(url) => setForm({ ...form, image_url: url })}
            businessId={businessId}
          />
        </div>

        {/* Nombre */}
        <div>
          <label style={labelStyle}>Nombre *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ej: Empanada de carne"
            style={inputStyle}
          />
        </div>

        {/* Precio */}
        <div>
          <label style={labelStyle}>Precio (ARS) *</label>
          <input
            type="number"
            required
            min={0}
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="0"
            style={{ ...inputStyle, width: 180 }}
          />
        </div>

        {/* Descripción */}
        <div>
          <label style={labelStyle}>Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Descripción opcional..."
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        {/* Categoría */}
        <div>
          <label style={labelStyle}>Categoría *</label>
          <select
            required
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            style={inputStyle}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label style={labelStyle}>Tags</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {ALL_TAGS.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 9999,
                  fontSize: 13,
                  fontWeight: form.tags.includes(tag.id) ? 500 : 400,
                  background: form.tags.includes(tag.id) ? "var(--apricot)" : "var(--fog)",
                  color: form.tags.includes(tag.id) ? "var(--rust)" : "var(--ash)",
                  border: form.tags.includes(tag.id)
                    ? "1px solid rgba(93,42,26,.2)"
                    : "1px solid var(--dove)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "background .15s ease",
                }}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Disponibilidad */}
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={form.is_available}
            onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
            style={{ width: 16, height: 16 }}
          />
          <span style={{ fontSize: 14, color: "var(--ash)" }}>Disponible</span>
        </label>

        {/* Botones */}
        <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
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
            {loading ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear ítem"}
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
              {deleting ? "Eliminando..." : "Eliminar ítem"}
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
