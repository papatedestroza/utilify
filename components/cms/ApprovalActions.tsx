"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { toast } from "sonner";

interface Props {
  itemId: string;
}

// Botones inline Aprobar / Rechazar para ítems en estado "pending" (RF3.4)
export default function ApprovalActions({ itemId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function transition(newStatus: "published" | "draft") {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("menu_items")
      .update({ status: newStatus })
      .eq("id", itemId);

    if (error) {
      toast.error("Error: " + error.message);
    } else {
      toast.success(newStatus === "published" ? "¡Publicado!" : "Devuelto a borrador");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", gap: 6 }}>
      <button
        type="button"
        onClick={() => transition("published")}
        disabled={loading}
        title="Aprobar y publicar"
        style={{
          padding: "4px 10px",
          borderRadius: 7,
          border: "none",
          background: "#065F46",
          color: "#fff",
          fontSize: 11,
          fontWeight: 500,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          opacity: loading ? 0.7 : 1,
        }}
      >
        ✓ Aprobar
      </button>
      <button
        type="button"
        onClick={() => transition("draft")}
        disabled={loading}
        title="Rechazar (volver a borrador)"
        style={{
          padding: "4px 10px",
          borderRadius: 7,
          border: "1px solid rgba(93,42,26,.25)",
          background: "none",
          color: "var(--rust)",
          fontSize: 11,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          opacity: loading ? 0.7 : 1,
        }}
      >
        ✕ Rechazar
      </button>
    </div>
  );
}
