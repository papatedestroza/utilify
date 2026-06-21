"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { toast } from "sonner";

interface Props {
  value: string;
  onChange: (url: string) => void;
  businessId: string;
}

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function storagePathFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    // /storage/v1/object/public/menu-images/<path>
    const match = u.pathname.match(/\/storage\/v1\/object\/public\/menu-images\/(.+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export default function UploadImage({ value, onChange, businessId }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME.includes(file.type)) {
      toast.error("Solo se permiten imágenes JPG, PNG, WebP o GIF.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no puede superar 5 MB.");
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const ext = MIME_TO_EXT[file.type] ?? "jpg";
    const path = `${businessId}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("menu-images")
      .upload(path, file, { upsert: true });

    if (error) {
      toast.error("Error al subir la imagen.");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("menu-images").getPublicUrl(path);
    onChange(data.publicUrl);
    toast.success("Imagen subida");
    setUploading(false);

    // reset input para permitir re-subir el mismo archivo
    e.target.value = "";
  }

  async function handleRemove() {
    if (!value) return;
    const path = storagePathFromUrl(value);
    if (path) {
      const supabase = createClient();
      await supabase.storage.from("menu-images").remove([path]);
    }
    onChange("");
  }

  return (
    <div>
      {value ? (
        <div style={{ position: "relative", display: "inline-block" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Foto del ítem"
            style={{
              width: 120,
              height: 120,
              objectFit: "cover",
              borderRadius: 12,
              border: "1px solid var(--dove)",
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            style={{
              position: "absolute",
              top: -8,
              right: -8,
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "var(--ink)",
              color: "var(--white)",
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
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
            width: 120,
            height: 120,
            borderRadius: 12,
            border: "2px dashed var(--dove)",
            background: "var(--fog)",
            cursor: uploading ? "not-allowed" : "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontFamily: "inherit",
          }}
        >
          {uploading ? (
            <span style={{ fontSize: 12, color: "var(--graphite)" }}>Subiendo...</span>
          ) : (
            <>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="var(--dove)"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M10 2v12M4 8l6-6 6 6" />
                <path d="M2 17h16" />
              </svg>
              <span style={{ fontSize: 11, color: "var(--dove)" }}>Subir foto</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </div>
  );
}
