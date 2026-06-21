"use client";

import { useState } from "react";
import Link from "next/link";

function EarlyAccessForm({
  accent = "var(--ink)",
  inputBg = "var(--fog)",
  borderColor = "var(--dove)",
  module = "general",
}: {
  accent?: string;
  inputBg?: string;
  borderColor?: string;
  module?: string;
}) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, module }),
      });
    } finally {
      setDone(true);
      setLoading(false);
    }
  }

  return done ? (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "rgba(45,107,66,.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <polyline
            points="2,5 4,8 9,2"
            stroke="var(--delta)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span style={{ fontSize: 13, color: "var(--delta)", fontWeight: 500 }}>
        ¡Listo! Te avisamos cuando esté disponible.
      </span>
    </div>
  ) : (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "row", gap: 8, alignItems: "center" }}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        required
        disabled={loading}
        style={{
          flex: 1,
          minWidth: 0,
          border: `1px solid ${borderColor}`,
          borderRadius: 9999,
          padding: "9px 16px",
          fontSize: 13,
          color: "var(--ink)",
          background: inputBg,
          outline: "none",
          fontFamily: "inherit",
        }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          background: loading ? "var(--dove)" : accent,
          color: "var(--white)",
          border: "none",
          borderRadius: 9999,
          padding: "9px 18px",
          fontSize: 13,
          fontWeight: 480,
          cursor: loading ? "not-allowed" : "pointer",
          whiteSpace: "nowrap",
          fontFamily: "inherit",
          flexShrink: 0,
          transition: "background .15s ease",
        }}
      >
        {loading ? "..." : "Avisame"}
      </button>
    </form>
  );
}

export default function Modules() {
  return (
    <section id="modulos" style={{ background: "var(--white)", padding: "96px 28px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "var(--graphite)",
            letterSpacing: ".06em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Plataforma modular
        </p>
        <h2
          className="serif section-title"
          style={{
            fontSize: "clamp(32px,3.8vw,44px)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-.015em",
            color: "var(--ink)",
            maxWidth: 480,
            marginBottom: 60,
          }}
        >
          Activá solo lo que
          <br />
          necesitás.
        </h2>

        <div
          className="modules-grid rv"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
          }}
        >
          {/* CMS — disponible */}
          <div
            className="hov-card"
            style={{
              background: "var(--apricot)",
              borderRadius: 24,
              padding: 32,
              boxShadow: "var(--shadow)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 160,
                height: 160,
                background:
                  "radial-gradient(circle at 100% 0%, rgba(93,42,26,.08) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(93,42,26,.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                stroke="var(--rust)"
                strokeWidth="1.6"
                strokeLinecap="round"
              >
                <rect x="3" y="2" width="16" height="18" rx="3" />
                <line x1="7" y1="8" x2="15" y2="8" />
                <line x1="7" y1="12" x2="15" y2="12" />
                <line x1="7" y1="16" x2="12" y2="16" />
              </svg>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  letterSpacing: "-.009em",
                  color: "var(--ink)",
                  lineHeight: 1.2,
                }}
              >
                CMS / Web
              </h3>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--rust)",
                  background: "rgba(93,42,26,.12)",
                  padding: "3px 12px",
                  borderRadius: 9999,
                  flexShrink: 0,
                }}
              >
                Disponible
              </span>
            </div>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.55,
                letterSpacing: "-.014em",
                color: "var(--ash)",
                marginBottom: 20,
              }}
            >
              Editá tu menú, galería de fotos y horarios en segundos, sin tocar
              código. Tu carta online siempre actualizada.
            </p>
            <Link
              href="/auth/register"
              className="hov-link"
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "var(--rust)",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              Explorar módulo <span>→</span>
            </Link>
          </div>

          {/* Finanzas — próximamente */}
          <div
            className="hov-card"
            style={{
              background: "var(--white)",
              borderRadius: 24,
              padding: 32,
              boxShadow: "var(--shadow)",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "var(--fog)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                stroke="var(--graphite)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="2,18 7,11 11,14 16,7 20,5" />
                <line x1="2" y1="20" x2="20" y2="20" />
              </svg>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  letterSpacing: "-.009em",
                  color: "var(--ink)",
                  lineHeight: 1.2,
                }}
              >
                Finanzas
              </h3>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 450,
                  color: "var(--graphite)",
                  background: "var(--fog)",
                  padding: "3px 12px",
                  borderRadius: 9999,
                  flexShrink: 0,
                }}
              >
                Próximamente
              </span>
            </div>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.55,
                letterSpacing: "-.014em",
                color: "var(--ash)",
                marginBottom: 24,
              }}
            >
              Registrá cada ingreso y gasto en segundos. Cerrá el mes sabiendo
              exactamente cuánto ganaste, cuánto gastaste y dónde podés mejorar
              — sin planillas ni contadores.
            </p>
            <EarlyAccessForm module="finanzas" />
          </div>

          {/* Gestión — próximamente */}
          <div
            className="hov-card"
            style={{
              background: "var(--white)",
              borderRadius: 24,
              padding: 32,
              boxShadow: "var(--shadow)",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "var(--fog)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                stroke="var(--graphite)"
                strokeWidth="1.6"
                strokeLinecap="round"
              >
                <rect x="2" y="4" width="18" height="16" rx="2.5" />
                <line x1="7" y1="2" x2="7" y2="6" />
                <line x1="15" y1="2" x2="15" y2="6" />
                <line x1="2" y1="10" x2="20" y2="10" />
                <circle cx="7" cy="15" r="1.2" fill="var(--graphite)" stroke="none" />
                <circle cx="11" cy="15" r="1.2" fill="var(--graphite)" stroke="none" />
              </svg>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  letterSpacing: "-.009em",
                  color: "var(--ink)",
                  lineHeight: 1.2,
                }}
              >
                Gestión
              </h3>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 450,
                  color: "var(--graphite)",
                  background: "var(--fog)",
                  padding: "3px 12px",
                  borderRadius: 9999,
                  flexShrink: 0,
                }}
              >
                Próximamente
              </span>
            </div>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.55,
                letterSpacing: "-.014em",
                color: "var(--ash)",
                marginBottom: 24,
              }}
            >
              Turnos, reservas y pedidos en un solo panel. Nunca más un cuaderno
              en la barra o un cliente que llama para saber si hay lugar — todo
              online, todo en tiempo real.
            </p>
            <EarlyAccessForm module="gestion" />
          </div>

          {/* Marketing — próximamente */}
          <div
            className="hov-card"
            style={{
              background: "var(--sky)",
              borderRadius: 24,
              padding: 32,
              boxShadow: "var(--shadow)",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(26,74,138,.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                stroke="#1a4a8a"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 3v16M4 8v6h2l6 3V5L6 8H4z" />
                <path d="M19 8a4 4 0 010 6" strokeDasharray="2 1" />
              </svg>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  letterSpacing: "-.009em",
                  color: "var(--ink)",
                  lineHeight: 1.2,
                }}
              >
                Marketing
              </h3>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 450,
                  color: "#1a4a8a",
                  background: "rgba(26,74,138,.1)",
                  padding: "3px 12px",
                  borderRadius: 9999,
                  flexShrink: 0,
                }}
              >
                Próximamente
              </span>
            </div>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.55,
                letterSpacing: "-.014em",
                color: "var(--ash)",
                marginBottom: 24,
              }}
            >
              Programá tus posts de Instagram, armá campañas de WhatsApp y medí
              qué funciona — todo desde el mismo lugar donde gestionás el resto
              del negocio.
            </p>
            <EarlyAccessForm
              module="marketing"
              inputBg="rgba(255,255,255,.7)"
              borderColor="rgba(26,74,138,.2)"
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 760px) {
          .modules-grid { grid-template-columns: 1fr !important; }
          .section-title { font-size: 30px !important; }
        }
      `}</style>
    </section>
  );
}
