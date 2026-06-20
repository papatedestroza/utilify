"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--fog)",
        borderTop: "1px solid var(--dove)",
        padding: "60px 28px 40px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          className="footer-cols"
          style={{
            display: "flex",
            gap: 80,
            marginBottom: 48,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {/* Brand */}
          <div style={{ flexShrink: 0, minWidth: 180 }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 650,
                letterSpacing: "-.45px",
                color: "var(--ink)",
                marginBottom: 10,
              }}
            >
              Utilify
            </div>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: "var(--graphite)",
                maxWidth: 200,
              }}
            >
              Gestión digital para negocios de LATAM.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: 64, flexWrap: "wrap", flex: 1 }}>
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--dove)",
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                Producto
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Módulos", href: "#modulos" },
                  { label: "Precios", href: "#precios" },
                  { label: "Novedades", href: "#" },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="hov-link"
                    style={{
                      fontSize: 14,
                      color: "var(--graphite)",
                      fontWeight: 450,
                    }}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--dove)",
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                Empresa
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Nosotros", href: "#" },
                  { label: "Blog", href: "#" },
                  { label: "Contacto", href: "#" },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="hov-link"
                    style={{
                      fontSize: 14,
                      color: "var(--graphite)",
                      fontWeight: 450,
                    }}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--dove)",
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                Legal
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Términos", href: "#" },
                  { label: "Privacidad", href: "#" },
                ].map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="hov-link"
                    style={{
                      fontSize: 14,
                      color: "var(--graphite)",
                      fontWeight: 450,
                    }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Social */}
        <div
          className="social-row"
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <a
            href="#"
            className="hov-link"
            aria-label="Instagram"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 9999,
              border: "1px solid var(--dove)",
              color: "var(--graphite)",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4.5" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a
            href="#"
            className="hov-link"
            aria-label="WhatsApp"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 9999,
              border: "1px solid var(--dove)",
              color: "var(--graphite)",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
            </svg>
          </a>
          <a
            href="#"
            className="hov-link"
            style={{
              fontSize: 13,
              color: "var(--graphite)",
              fontWeight: 450,
              marginLeft: 4,
            }}
          >
            @utilify.ar
          </a>
        </div>

        {/* Bottom */}
        <div
          style={{
            borderTop: "1px solid var(--dove)",
            paddingTop: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{ fontSize: 13, color: "var(--dove)" }}>
            © 2026 Utilify. Todos los derechos reservados.
          </p>
          <p style={{ fontSize: 13, color: "var(--dove)" }}>
            Hecho en Córdoba, Argentina 🇦🇷
          </p>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 760px) {
          .footer-cols { flex-direction: column !important; gap: 40px !important; }
          .social-row { flex-wrap: wrap !important; gap: 12px 24px !important; justify-content: center !important; }
        }
      `}</style>
    </footer>
  );
}
