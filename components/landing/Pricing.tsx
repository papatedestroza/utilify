"use client";

import Link from "next/link";

const plans = [
  {
    id: "basico",
    name: "Básico",
    price: "$2.990",
    desc: "1 módulo activo a elección.",
    features: ["1 módulo activo", "Hasta 200 ítems", "Soporte por email"],
    cta: { label: "Empezar →", href: "/auth/register", primary: false },
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$5.990",
    desc: "Hasta 3 módulos activos simultáneos.",
    features: [
      "Hasta 3 módulos activos",
      "Ítems ilimitados",
      "Analíticas semanales",
      "Soporte prioritario",
    ],
    cta: { label: "Empezá gratis", href: "/auth/register", primary: true },
    highlighted: true,
    badge: "Más popular",
    note: "14 días de prueba, sin tarjeta.",
  },
  {
    id: "completo",
    name: "Completo",
    price: "$9.990",
    desc: "Todos los módulos desbloqueados.",
    features: [
      "Módulos ilimitados",
      "Analíticas avanzadas",
      "Acceso anticipado a nuevos módulos",
      "Soporte por WhatsApp",
    ],
    cta: { label: "Contactar →", href: "#", primary: false },
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="precios" style={{ background: "var(--fog)", padding: "96px 28px" }}>
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
          Planes
        </p>
        <h2
          className="serif section-title"
          style={{
            fontSize: "clamp(32px,3.8vw,44px)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-.015em",
            color: "var(--ink)",
            marginBottom: 12,
          }}
        >
          Pagás por lo que usás.
        </h2>
        <p
          style={{
            fontSize: 18,
            color: "var(--ash)",
            lineHeight: 1.5,
            letterSpacing: "-.016em",
            marginBottom: 52,
            maxWidth: 480,
          }}
        >
          Sin módulos encadenados ni sorpresas. Activás lo que necesitás y lo
          pausás cuando quieras.
        </p>

        <div
          className="pricing-grid rv"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 20,
            alignItems: "start",
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="hov-card"
              style={{
                background: "var(--white)",
                borderRadius: 24,
                padding: 32,
                boxShadow: plan.highlighted ? "var(--shadow-lg)" : "var(--shadow)",
                borderTop: plan.highlighted ? "2px solid var(--ink)" : undefined,
                position: "relative",
              }}
            >
              {plan.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: -1,
                    right: 28,
                    background: "var(--ink)",
                    color: "var(--white)",
                    fontSize: 11,
                    fontWeight: 500,
                    padding: "4px 14px",
                    borderRadius: "0 0 8px 8px",
                    letterSpacing: ".04em",
                    textTransform: "uppercase",
                  }}
                >
                  {plan.badge}
                </div>
              )}

              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: plan.highlighted ? "var(--ink)" : "var(--graphite)",
                  letterSpacing: ".04em",
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                {plan.name}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 4,
                  marginBottom: 6,
                }}
              >
                <span
                  className="serif"
                  style={{
                    fontSize: 44,
                    fontWeight: 400,
                    color: "var(--ink)",
                    lineHeight: 1,
                    letterSpacing: "-.02em",
                  }}
                >
                  {plan.price}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    color: "var(--graphite)",
                    fontWeight: 450,
                  }}
                >
                  /mes
                </span>
              </div>

              <p
                style={{
                  fontSize: 14,
                  color: "var(--ash)",
                  marginBottom: 28,
                  lineHeight: 1.5,
                }}
              >
                {plan.desc}
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginBottom: 32,
                }}
              >
                {plan.features.map((f) => (
                  <div
                    key={f}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <polyline
                        points="3,8 6,11 13,5"
                        stroke={plan.highlighted ? "var(--ink)" : "var(--ash)"}
                        strokeWidth={plan.highlighted ? "1.8" : "1.5"}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span
                      style={{
                        fontSize: 14,
                        color: plan.highlighted ? "var(--ink)" : "var(--ash)",
                        fontWeight: plan.highlighted ? 450 : undefined,
                      }}
                    >
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              {plan.cta.primary ? (
                <Link
                  href={plan.cta.href}
                  className="hov-btn"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    background: "var(--ink)",
                    color: "var(--white)",
                    fontSize: 15,
                    fontWeight: 480,
                    letterSpacing: "-.009em",
                    padding: "12px 28px",
                    borderRadius: 9999,
                  }}
                >
                  {plan.cta.label}
                </Link>
              ) : (
                <Link
                  href={plan.cta.href}
                  className="hov-link"
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: "var(--ink)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  {plan.cta.label}
                </Link>
              )}

              {plan.note && (
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--dove)",
                    marginTop: 12,
                  }}
                >
                  {plan.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 760px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
