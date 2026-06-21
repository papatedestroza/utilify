"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { toast } from "sonner";

interface Props {
  value: string;
  onChange: (url: string) => void;
  businessId: string;
}

// RF4.1 — Archivos PDF; RF4.3 — Límite de 10 MB
const MAX_PDF_BYTES = 10 * 1024 * 1024;

function storagePathFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const match = u.pathname.match(/\/storage\/v1\/object\/public\/menu-docs\/(.+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export default function UploadFile({ value, onChange, businessId }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Solo se permiten archivos PDF.");
      return;
    }

    if (file.size > MAX_PDF_BYTES) {
      toast.error("El PDF no puede superar 10 MB.");
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const path = `${businessId}/${Date.now()}.pdf`;

    const { error } = await supabase.storage
      .from("menu-docs")
      .upload(path, file, { upsert: true, contentType: "application/pdf" });

    if (error) {
      toast.error("Error al subir el archivo.");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("menu-docs").getPublicUrl(path);
    onChange(data.publicUrl);
    toast.success("PDF subido");
    setUploading(false);
    e.target.value = "";
  }

  async function handleRemove() {
    if (!value) return;
    const path = storagePathFromUrl(value);
    if (path) {
      const supabase = createClient();
      await supabase.storage.from("menu-docs").remove([path]);
    }
    onChange("");
  }

  const fileName = value
    ? decodeURIComponent(value.split("/").pop() ?? "archivo.pdf")
    : null;

  return (
    <div>
      {value ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            border: "1px solid var(--dove)",
            borderRadius: 10,
            background: "var(--fog)",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--rust)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span style={{ fontSize: 13, color: "var(--ash)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {fileName}
          </span>
          <button
            type="button"
            onClick={handleRemove}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--graphite)",
              padding: "2px 4px",
              fontSize: 16,
              lineHeight: 1,
              flexShrink: 0,
            }}
            aria-label="Quitar PDF"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 16px",
            border: "2px dashed var(--dove)",
            borderRadius: 10,
            background: "var(--fog)",
            cursor: uploading ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            fontSize: 13,
            color: "var(--ash)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M10 2v12M4 8l6-6 6 6" />
            <path d="M2 17h16" />
          </svg>
          {uploading ? "Subiendo..." : "Subir PDF (máx. 10 MB)"}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </div>
  );
}
