"use client";

import { useState } from "react";
import Image from "next/image";
import type { MenuItem } from "@/lib/types";

const TAG_LABELS: Record<string, string> = {
  spicy:        "🌶 Picante",
  "sin-gluten": "🌾 Sin TACC",
  vegano:       "🌿 Vegano",
  "sin-huevo":  "Sin huevo",
};

interface Props {
  item: MenuItem;
}

// RF5.2 — Ejecuta las interacciones configuradas por el dueño del negocio.
export default function MenuItemCard({ item }: Props) {
  const [zoomOpen, setZoomOpen] = useState(false);

  const canZoom = item.allow_image_zoom && !!item.image_url;

  return (
    <>
      <div
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
          <div
            style={{
              position: "relative",
              flexShrink: 0,
              cursor: canZoom ? "zoom-in" : "default",
            }}
            onClick={() => canZoom && setZoomOpen(true)}
            role={canZoom ? "button" : undefined}
            aria-label={canZoom ? `Ampliar imagen de ${item.name}` : undefined}
            tabIndex={canZoom ? 0 : undefined}
            onKeyDown={(e) => {
              if (canZoom && (e.key === "Enter" || e.key === " ")) setZoomOpen(true);
            }}
          >
            <Image
              src={item.image_url}
              alt={item.name}
              width={72}
              height={72}
              style={{
                borderRadius: 10,
                objectFit: "cover",
                display: "block",
              }}
            />
            {canZoom && (
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: 4,
                  right: 4,
                  background: "rgba(0,0,0,.45)",
                  borderRadius: 4,
                  padding: "1px 4px",
                  fontSize: 10,
                  color: "#fff",
                  lineHeight: 1.4,
                  pointerEvents: "none",
                }}
              >
                🔍
              </span>
            )}
          </div>
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
            <span style={{ fontSize: 15, fontWeight: 500, color: "var(--ink)" }}>
              {item.name}
            </span>
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", flexShrink: 0 }}>
              ${Number(item.price).toLocaleString("es-AR")}
            </span>
          </div>

          {item.description && (
            <p style={{ fontSize: 13, color: "var(--graphite)", marginTop: 4, lineHeight: 1.5 }}>
              {item.description}
            </p>
          )}

          {item.tags && item.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
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

          {/* RF5.2 — Botón de descarga PDF si está configurado */}
          {item.pdf_url && (
            <a
              href={item.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              download
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                marginTop: 10,
                fontSize: 12,
                color: "var(--rust)",
                border: "1px solid rgba(93,42,26,.2)",
                borderRadius: 6,
                padding: "3px 10px",
                textDecoration: "none",
                background: "var(--apricot)",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M10 2v12M4 14l6 4 6-4" />
                <path d="M2 18h16" />
              </svg>
              Descargar PDF
            </a>
          )}
        </div>
      </div>

      {/* RF5.2 — Modal de zoom (solo si allow_image_zoom = true) */}
      {zoomOpen && item.image_url && (
        <div
          role="dialog"
          aria-label={`Imagen ampliada de ${item.name}`}
          aria-modal="true"
          onClick={() => setZoomOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setZoomOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
            cursor: "zoom-out",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", maxWidth: "min(90vw, 600px)", cursor: "default" }}
          >
            <Image
              src={item.image_url}
              alt={item.name}
              width={600}
              height={600}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 16,
                objectFit: "contain",
                display: "block",
              }}
            />
            <button
              onClick={() => setZoomOpen(false)}
              aria-label="Cerrar imagen"
              style={{
                position: "absolute",
                top: -12,
                right: -12,
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "var(--ink)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
