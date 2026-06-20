"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "calc(100vh - 68px)",
        display: "flex",
        alignItems: "center",
        background: "var(--white)",
        overflow: "hidden",
      }}
    >
      {/* Apricot radial glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-58%)",
          width: 1000,
          height: 800,
          background:
            "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(251,225,209,.6) 0%, rgba(251,225,209,.22) 45%, transparent 72%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        className="hero-pad"
        style={{
          maxWidth: 1200,
          width: "100%",
          margin: "0 auto",
          padding: "120px 28px 160px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Text column */}
        <div
          style={{
            maxWidth: 660,
            margin: "0 auto",
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(18px)",
            transition:
              "opacity .82s cubic-bezier(.16,1,.3,1), transform .82s cubic-bezier(.16,1,.3,1)",
            transitionDelay: visible ? ".05s" : "0s",
          }}
        >
          {/* Eyebrow pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--apricot)",
              padding: "6px 16px",
              borderRadius: 9999,
              marginBottom: 32,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--rust)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--rust)",
                letterSpacing: "-.009em",
              }}
            >
              Disponible hoy en Argentina
            </span>
          </div>

          {/* Headline */}
          <h1
            className="hero-h1 serif"
            style={{
              fontSize: "clamp(52px,6.8vw,80px)",
              fontWeight: 400,
              lineHeight: 1.07,
              letterSpacing: "-.025em",
              color: "var(--ink)",
              marginBottom: 24,
            }}
          >
            Todo tu negocio,
            <br />
            <em style={{ fontStyle: "italic" }}>en un solo lugar.</em>
          </h1>

          {/* Subtitle */}
          <p
            className="hero-sub"
            style={{
              fontSize: 18,
              lineHeight: 1.55,
              letterSpacing: "-.016em",
              color: "var(--ash)",
              maxWidth: 530,
              margin: "0 auto 44px",
              fontWeight: 400,
            }}
          >
            La plataforma modular para que gestiones tu local sin depender de un
            técnico. Editá tu menú, controlá tus ventas y organizá tu operación
            — vos, desde el celular.
          </p>

          {/* CTAs */}
          <div
            className="hero-ctas"
            style={{
              display: "flex",
              gap: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Link
              href="/auth/register"
              className="hov-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "var(--ink)",
                color: "var(--white)",
                fontSize: 15,
                fontWeight: 480,
                letterSpacing: "-.009em",
                padding: "13px 30px",
                borderRadius: 9999,
              }}
            >
              Empezá gratis
            </Link>
            <a
              href="#como-funciona"
              className="hov-link"
              style={{
                fontSize: 15,
                fontWeight: 450,
                letterSpacing: "-.009em",
                color: "var(--ink)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Ver cómo funciona{" "}
              <span style={{ fontSize: 17, lineHeight: 1 }}>→</span>
            </a>
          </div>

          {/* Trust micro-signal */}
          <p
            style={{
              fontSize: 13,
              color: "var(--dove)",
              marginTop: 18,
              letterSpacing: "-.009em",
            }}
          >
            Sin tarjeta · Cancelás cuando querás · Datos en Argentina
          </p>

          {/* Mobile hero stat */}
          <div
            className="mobile-hero-stat"
            style={{
              display: "none",
              background: "var(--white)",
              borderRadius: 24,
              padding: "22px 24px",
              boxShadow: "var(--shadow)",
              marginTop: 44,
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--graphite)",
                  letterSpacing: "-.009em",
                }}
              >
                Ventas hoy
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--delta)",
                  background: "rgba(45,107,66,.1)",
                  padding: "3px 10px",
                  borderRadius: 9999,
                }}
              >
                ↑ 18%
              </span>
            </div>
            <div
              className="serif"
              style={{
                fontSize: 34,
                fontWeight: 400,
                color: "var(--ink)",
                letterSpacing: "-.02em",
                lineHeight: 1,
                marginBottom: 14,
              }}
            >
              $24.380
            </div>
            <svg
              width="100%"
              height="36"
              viewBox="0 0 240 36"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M0,30 L30,25 L60,28 L90,18 L120,22 L150,11 L180,14 L210,7 L240,4"
                stroke="var(--rust)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M0,30 L30,25 L60,28 L90,18 L120,22 L150,11 L180,14 L210,7 L240,4 L240,36 L0,36 Z"
                fill="rgba(251,225,209,.45)"
              />
            </svg>
          </div>
        </div>

        {/* Floating hero cards */}
        <div
          className="float-zone"
          style={{
            position: "absolute",
            top: 0,
            left: 28,
            right: 28,
            bottom: 0,
            pointerEvents: "none",
          }}
        >
          {/* Card A: Menú actualizado */}
          <div
            className="hero-card hov-card"
            style={{
              pointerEvents: "all",
              position: "absolute",
              left: 0,
              top: "15%",
              width: 228,
              background: "var(--white)",
              borderRadius: 24,
              padding: 20,
              boxShadow: "var(--shadow)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "var(--apricot)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <polyline
                    points="2,6 5,9 10,3"
                    stroke="var(--rust)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--ash)",
                  letterSpacing: "-.009em",
                }}
              >
                Menú actualizado
              </span>
            </div>
            <div
              style={{
                background: "var(--fog)",
                borderRadius: 12,
                padding: "11px 12px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: "var(--apricot)",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  stroke="var(--rust)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                >
                  <circle cx="9" cy="9" r="7" />
                  <path d="M6 9c0-1.66 1.34-3 3-3s3 1.34 3 3" />
                </svg>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--ink)",
                    letterSpacing: "-.009em",
                    lineHeight: 1.3,
                  }}
                >
                  Medialunas
                </div>
                <div style={{ fontSize: 12, color: "var(--graphite)", marginTop: 1 }}>
                  $750 · unidad
                </div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "var(--dove)", letterSpacing: "-.009em" }}>
              Hace 2 minutos
            </div>
            <div
              style={{
                position: "absolute",
                bottom: -10,
                right: 16,
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "var(--ink)",
                border: "2px solid var(--white)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                color: "var(--white)",
                fontWeight: 600,
              }}
            >
              G
            </div>
          </div>

          {/* Card B: Ventas stat */}
          <div
            className="hero-card-b hov-card"
            style={{
              pointerEvents: "all",
              position: "absolute",
              right: 0,
              top: "22%",
              width: 218,
              background: "var(--white)",
              borderRadius: 24,
              padding: 20,
              boxShadow: "var(--shadow)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--graphite)",
                letterSpacing: "-.009em",
                marginBottom: 8,
              }}
            >
              Ventas hoy
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <span
                className="serif"
                style={{
                  fontSize: 30,
                  fontWeight: 400,
                  color: "var(--ink)",
                  letterSpacing: "-.02em",
                  lineHeight: 1,
                }}
              >
                $24.380
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--delta)",
                  background: "rgba(45,107,66,.1)",
                  padding: "3px 9px",
                  borderRadius: 9999,
                }}
              >
                ↑ 18%
              </span>
            </div>
            <svg
              width="100%"
              height="40"
              viewBox="0 0 178 40"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M0,34 L22,29 L44,32 L67,21 L89,25 L111,13 L134,16 L156,9 L178,6"
                stroke="var(--rust)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M0,34 L22,29 L44,32 L67,21 L89,25 L111,13 L134,16 L156,9 L178,6 L178,40 L0,40 Z"
                fill="rgba(251,225,209,.45)"
              />
            </svg>
          </div>

          {/* Card C: Reservas */}
          <div
            className="hero-card-c hov-card"
            style={{
              pointerEvents: "all",
              position: "absolute",
              left: 80,
              bottom: "8%",
              width: 200,
              background: "var(--white)",
              borderRadius: 24,
              padding: "18px 20px",
              boxShadow: "var(--shadow)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
              {[
                { bg: "var(--ink)", label: "G", z: 4 },
                { bg: "var(--ash)", label: "M", z: 3 },
                { bg: "var(--graphite)", label: "R", z: 2 },
                { bg: "var(--dove)", label: "+9", z: 1 },
              ].map((av, i) => (
                <div
                  key={i}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: av.bg,
                    border: "2px solid var(--white)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    color: "var(--white)",
                    fontWeight: 600,
                    marginLeft: i === 0 ? 0 : -9,
                    zIndex: av.z,
                    position: "relative",
                  }}
                >
                  {av.label}
                </div>
              ))}
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "var(--ink)",
                letterSpacing: "-.009em",
                lineHeight: 1.3,
              }}
            >
              12 reservas hoy
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--delta)",
                marginTop: 3,
                fontWeight: 500,
              }}
            >
              ↑ 4 más que ayer
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 960px) {
          .float-zone { display: none !important; }
          .hero-pad { padding: 80px 24px 100px !important; }
          .mobile-hero-stat { display: block !important; }
        }
        @media (max-width: 760px) {
          .hero-h1 { font-size: clamp(40px, 10vw, 60px) !important; }
          .hero-sub { font-size: 16px !important; }
          .hero-ctas { flex-wrap: wrap !important; justify-content: center !important; }
        }
        @media (max-width: 500px) {
          .hero-h1 { font-size: 36px !important; }
        }
      `}</style>
    </section>
  );
}
