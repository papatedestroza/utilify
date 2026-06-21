"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { toast } from "sonner";
import UploadImage from "./UploadImage";
import UploadFile from "./UploadFile";
import type { MenuItem, ItemTag, MenuCategory, ContentStatus } from "@/lib/types";

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

const STATUS_LABELS: Record<ContentStatus, string> = {
  draft: "Borrador",
  pending: "Pendiente de aprobación",
  published: "Publicado",
};

const STATUS_COLORS: Record<ContentStatus, { bg: string; color: string }> = {
  draft:     { bg: "var(--fog)",    color: "var(--ash)" },
  pending:   { bg: "#FFF8E1",       color: "#B45309" },
  published: { bg: "#ECFDF5",       color: "#065F46" },
};

export default function ItemForm({ businessId, categories, defaultCategoryId, item }: Props) {
  const router = useRouter();
  const isEdit = !!item;

  const [form, setForm] = useState({
    name:             item?.name ?? "",
    description:      item?.description ?? "",
    price:            item?.price?.toString() ?? "",
    image_url:        item?.image_url ?? "",
    is_available:     item?.is_available ?? true,
    category_id:      item?.category_id ?? defaultCategoryId ?? categories[0]?.id ?? "",
    tags:             item?.tags ?? ([] as ItemTag[]),
    display_order:    item?.display_order ?? 0,
    allow_image_zoom: item?.allow_image_zoom ?? false,
    pdf_url:          item?.pdf_url ?? "",
  });

  const [status, setStatus] = useState<ContentStatus>(item?.status ?? "draft");
  const [loading, setLoading]   = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isPending  = status === "pending";
  const isReadOnly = isPending;

  function toggleTag(tag: ItemTag) {
    if (isReadOnly) return;
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  }

  function buildPayload() {
    return {
      name:             form.name.trim(),
      description:      form.description || null,
      price:            parseFloat(form.price),
      image_url:        form.image_url || null,
      is_available:     form.is_available,
      category_id:      form.category_id,
      tags:             form.tags,
      display_order:    Number(form.display_order),
      allow_image_zoom: form.allow_image_zoom,
      pdf_url:          form.pdf_url || null,
    };
  }

  // Guardar como borrador (sin publicar)
  async function handleSaveDraft(e: React.FormEvent) {
    e.preventDefault();
    const price = parseFloat(form.price);
    if (isNaN(price) || price < 0) {
      toast.error("El precio debe ser un número positivo.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const payload = { ...buildPayload(), status: "draft" as ContentStatus };

    if (isEdit && item) {
      const { error } = await supabase.from("menu_items").update(payload).eq("id", item.id);
      if (error) { toast.error("Error al guardar: " + error.message); }
      else { toast.success("Guardado como borrador"); setStatus("draft"); router.refresh(); }
    } else {
      const { error } = await supabase.from("menu_items").insert({ ...payload, business_id: businessId });
      if (error) { toast.error("Error al crear: " + error.message); }
      else { toast.success("Ítem creado"); router.push("/admin/cms"); router.refresh(); }
    }
    setLoading(false);
  }

  // Enviar a revisión (draft → pending)
  async function handleSubmitForApproval() {
    const price = parseFloat(form.price);
    if (isNaN(price) || price < 0) {
      toast.error("El precio debe ser un número positivo.");
      return;
    }
    if (!form.name.trim()) {
      toast.error("El nombre es obligatorio.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const payload = { ...buildPayload(), status: "pending" as ContentStatus };

    if (isEdit && item) {
      const { error } = await supabase.from("menu_items").update(payload).eq("id", item.id);
      if (error) { toast.error("Error: " + error.message); }
      else { toast.success("Enviado a revisión"); setStatus("pending"); router.refresh(); }
    } else {
      const { error } = await supabase.from("menu_items").insert({ ...payload, business_id: businessId });
      if (error) { toast.error("Error: " + error.message); }
      else { toast.success("Ítem enviado a revisión"); router.push("/admin/cms"); router.refresh(); }
    }
    setLoading(false);
  }

  // Aprobar (pending → published)
  async function handleApprove() {
    if (!item) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("menu_items")
      .update({ status: "published" })
      .eq("id", item.id);
    if (error) { toast.error("Error: " + error.message); }
    else { toast.success("¡Publicado!"); setStatus("published"); router.refresh(); }
    setLoading(false);
  }

  // Rechazar (pending → draft)
  async function handleReject() {
    if (!item) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("menu_items")
      .update({ status: "draft" })
      .eq("id", item.id);
    if (error) { toast.error("Error: " + error.message); }
    else { toast.success("Devuelto a borrador"); setStatus("draft"); router.refresh(); }
    setLoading(false);
  }

  async function handleDelete() {
    if (!item || !confirm("¿Eliminar este ítem?")) return;
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("menu_items").delete().eq("id", item.id);
    if (error) { toast.error("Error al eliminar: " + error.message); }
    else { toast.success("Ítem eliminado"); router.push("/admin/cms"); router.refresh(); }
    setDeleting(false);
  }

  const { bg: statusBg, color: statusColor } = STATUS_COLORS[status];

  return (
    <form onSubmit={handleSaveDraft} style={{ maxWidth: 600 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Badge de estado — RF3.1 */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              borderRadius: 9999,
              fontSize: 13,
              fontWeight: 500,
              background: statusBg,
              color: statusColor,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: statusColor,
                flexShrink: 0,
              }}
            />
            {STATUS_LABELS[status]}
          </span>
          {isPending && (
            <span style={{ fontSize: 12, color: "var(--graphite)" }}>
              Edición bloqueada hasta resolver la revisión.
            </span>
          )}
        </div>

        {/* Bloque de acciones de aprobación — RF3.4 */}
        {isPending && (
          <div
            style={{
              background: "#FFFBEB",
              border: "1px solid #FDE68A",
              borderRadius: 12,
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <p style={{ fontSize: 14, color: "#92400E", margin: 0 }}>
              Este ítem está pendiente de aprobación. Revisá los datos antes de publicar.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handleApprove}
                disabled={loading}
                style={{
                  padding: "9px 20px",
                  borderRadius: 9999,
                  background: "#065F46",
                  color: "#fff",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                ✓ Aprobar y publicar
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={loading}
                style={{
                  padding: "9px 20px",
                  borderRadius: 9999,
                  background: "none",
                  color: "var(--rust)",
                  border: "1px solid rgba(93,42,26,.25)",
                  fontSize: 14,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                ✕ Rechazar (volver a borrador)
              </button>
            </div>
          </div>
        )}

        {/* Foto */}
        <div>
          <label style={labelStyle}>Foto</label>
          <UploadImage
            value={form.image_url}
            onChange={(url) => !isReadOnly && setForm({ ...form, image_url: url })}
            businessId={businessId}
          />
        </div>

        {/* Nombre */}
        <div>
          <label htmlFor="item-name" style={labelStyle}>Nombre *</label>
          <input
            id="item-name"
            type="text"
            required
            disabled={isReadOnly}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ej: Empanada de carne"
            style={{ ...inputStyle, opacity: isReadOnly ? 0.6 : 1 }}
          />
        </div>

        {/* Precio */}
        <div>
          <label htmlFor="item-price" style={labelStyle}>Precio (ARS) *</label>
          <input
            id="item-price"
            type="number"
            required
            min={0}
            step="0.01"
            disabled={isReadOnly}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="0"
            style={{ ...inputStyle, width: 180, opacity: isReadOnly ? 0.6 : 1 }}
          />
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="item-desc" style={labelStyle}>Descripción</label>
          <textarea
            id="item-desc"
            disabled={isReadOnly}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Descripción opcional..."
            rows={3}
            style={{ ...inputStyle, resize: "vertical", opacity: isReadOnly ? 0.6 : 1 }}
          />
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor="item-cat" style={labelStyle}>Categoría *</label>
          <select
            id="item-cat"
            required
            disabled={isReadOnly}
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            style={{ ...inputStyle, opacity: isReadOnly ? 0.6 : 1 }}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
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
                disabled={isReadOnly}
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
                  cursor: isReadOnly ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  transition: "background .15s ease",
                  opacity: isReadOnly ? 0.6 : 1,
                }}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Disponibilidad */}
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: isReadOnly ? "not-allowed" : "pointer", opacity: isReadOnly ? 0.6 : 1 }}>
          <input
            type="checkbox"
            disabled={isReadOnly}
            checked={form.is_available}
            onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
            style={{ width: 16, height: 16 }}
          />
          <span style={{ fontSize: 14, color: "var(--ash)" }}>Disponible</span>
        </label>

        {/* ── Configuración de interacciones — RF2.3 ── */}
        <div
          style={{
            background: "var(--fog)",
            border: "1px solid var(--dove)",
            borderRadius: 12,
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 500, color: "var(--ash)", margin: 0 }}>
            Interacciones
          </p>

          {/* Zoom en imagen */}
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: isReadOnly ? "not-allowed" : "pointer" }}>
            <input
              type="checkbox"
              disabled={isReadOnly}
              checked={form.allow_image_zoom}
              onChange={(e) => setForm({ ...form, allow_image_zoom: e.target.checked })}
              style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0 }}
            />
            <div>
              <span style={{ fontSize: 14, color: "var(--ink)", display: "block" }}>
                Permitir zoom en la imagen
              </span>
              <span style={{ fontSize: 12, color: "var(--graphite)" }}>
                Al hacer clic en la foto se abrirá un modal ampliado.
              </span>
            </div>
          </label>

          {/* PDF adjunto */}
          <div>
            <p style={{ fontSize: 14, color: "var(--ink)", marginBottom: 6 }}>
              Archivo PDF adjunto
            </p>
            <p style={{ fontSize: 12, color: "var(--graphite)", marginBottom: 10 }}>
              Se mostrará un botón de descarga junto al ítem en el menú público.
            </p>
            {!isReadOnly ? (
              <UploadFile
                value={form.pdf_url}
                onChange={(url) => setForm({ ...form, pdf_url: url })}
                businessId={businessId}
              />
            ) : form.pdf_url ? (
              <a
                href={form.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 13, color: "var(--rust)" }}
              >
                Ver PDF adjunto
              </a>
            ) : (
              <span style={{ fontSize: 13, color: "var(--dove)" }}>Sin PDF</span>
            )}
          </div>
        </div>

        {/* Botones de acción — RF3.2, RF3.4 */}
        {!isPending && (
          <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? "var(--dove)" : "var(--fog)",
                color: "var(--ash)",
                border: "1px solid var(--dove)",
                borderRadius: 9999,
                padding: "10px 24px",
                fontSize: 14,
                fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              {loading ? "Guardando..." : "Guardar borrador"}
            </button>

            <button
              type="button"
              onClick={handleSubmitForApproval}
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
              {loading ? "Enviando..." : "Enviar a revisión →"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/cms")}
              style={{
                background: "none",
                color: "var(--ash)",
                border: "none",
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
        )}

        {isPending && (
          <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
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
              ← Volver
            </button>
          </div>
        )}
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
