"use client";

export default function DashboardDemo() {
  return (
    <section id="producto" style={{ background: "var(--white)", padding: "96px 28px" }}>
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
          El producto
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
          Así se ve por dentro.
        </h2>
        <p
          style={{
            fontSize: 18,
            color: "var(--ash)",
            lineHeight: 1.5,
            letterSpacing: "-.016em",
            marginBottom: 52,
          }}
        >
          Un panel diseñado para que cualquier persona pueda usarlo sin capacitación.
        </p>

        {/* Dashboard mockup */}
        <div
          className="dash-outer rv"
          style={{
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid rgba(167,170,175,.3)",
          }}
        >
          {/* Window chrome */}
          <div
            style={{
              height: 44,
              background: "var(--fog)",
              borderBottom: "1px solid var(--dove)",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {["#f4826a", "#f6c149", "#63c176"].map((c) => (
                <div
                  key={c}
                  style={{ width: 12, height: 12, borderRadius: "50%", background: c }}
                />
              ))}
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  background: "var(--dove)",
                  opacity: 0.3,
                  borderRadius: 6,
                  height: 22,
                  width: 220,
                }}
              />
            </div>
          </div>

          {/* App header */}
          <div
            style={{
              height: 52,
              background: "var(--white)",
              borderBottom: "1px solid var(--dove)",
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              gap: 16,
            }}
          >
            <span
              style={{ fontSize: 15, fontWeight: 650, letterSpacing: "-.4px", color: "var(--ink)" }}
            >
              Utilify
            </span>
            <span style={{ width: 1, height: 18, background: "var(--dove)" }} />
            <span style={{ fontSize: 13, color: "var(--graphite)" }}>Panel · CMS / Web</span>
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--delta)" }}
              />
              <span style={{ fontSize: 12, color: "var(--graphite)" }}>Bar La Esquina</span>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "var(--ink)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  color: "var(--white)",
                  fontWeight: 600,
                }}
              >
                G
              </div>
            </div>
          </div>

          {/* Main layout */}
          <div
            className="dash-wrap"
            style={{ display: "flex", minHeight: 560, background: "var(--white)" }}
          >
            {/* Sidebar */}
            <div
              className="dash-sidebar"
              style={{
                width: 210,
                background: "var(--fog)",
                padding: "24px 0",
                borderRight: "1px solid var(--dove)",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  padding: "0 16px 8px",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--dove)",
                  letterSpacing: ".07em",
                  textTransform: "uppercase",
                }}
              >
                Módulos
              </div>

              <div
                style={{
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  background: "var(--white)",
                  margin: "4px 8px",
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "var(--ink)",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>
                  CMS / Web
                </span>
              </div>

              {["Finanzas", "Gestión", "Marketing"].map((m) => (
                <div
                  key={m}
                  style={{
                    padding: "10px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    margin: "2px 8px",
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "transparent",
                      border: "1.5px solid var(--dove)",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 14, color: "var(--dove)" }}>{m}</span>
                  <span
                    style={{
                      fontSize: 10,
                      color: "var(--dove)",
                      marginLeft: "auto",
                      background: "var(--white)",
                      padding: "1px 7px",
                      borderRadius: 9999,
                      border: "1px solid var(--dove)",
                    }}
                  >
                    soon
                  </span>
                </div>
              ))}
            </div>

            {/* Content */}
            <div
              style={{
                flex: 1,
                padding: "28px 28px 24px",
                overflow: "auto",
                background: "var(--white)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: 24,
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: 17,
                      fontWeight: 550,
                      color: "var(--ink)",
                      marginBottom: 3,
                      letterSpacing: "-.012em",
                    }}
                  >
                    Bienvenido, Gastón
                  </h3>
                  <p style={{ fontSize: 13, color: "var(--graphite)" }}>
                    Viernes, 20 de junio · Bar La Esquina
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "var(--fog)",
                    padding: "7px 14px",
                    borderRadius: 9999,
                    border: "1px solid var(--dove)",
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 450, color: "var(--ash)" }}>
                    Esta semana
                  </span>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    stroke="var(--graphite)"
                    strokeWidth="1.5"
                  >
                    <polyline points="2,3.5 5,6.5 8,3.5" />
                  </svg>
                </div>
              </div>

              {/* Metrics */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    background: "var(--apricot)",
                    borderRadius: 16,
                    padding: "16px 18px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--rust)",
                      fontWeight: 500,
                      marginBottom: 6,
                      letterSpacing: ".02em",
                      textTransform: "uppercase",
                    }}
                  >
                    Ventas hoy
                  </div>
                  <div
                    className="serif"
                    style={{
                      fontSize: 26,
                      fontWeight: 400,
                      color: "var(--ink)",
                      letterSpacing: "-.02em",
                      marginBottom: 6,
                    }}
                  >
                    $24.380
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: 12, color: "var(--delta)", fontWeight: 500 }}>
                      ↑ +18%
                    </span>
                    <svg width="54" height="22" viewBox="0 0 54 22" fill="none">
                      <path
                        d="M0,18 L9,14 L18,16 L27,9 L36,11 L45,4 L54,6"
                        stroke="var(--rust)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M0,18 L9,14 L18,16 L27,9 L36,11 L45,4 L54,6 L54,22 L0,22 Z"
                        fill="rgba(93,42,26,.12)"
                      />
                    </svg>
                  </div>
                </div>
                <div
                  style={{ background: "var(--sky)", borderRadius: 16, padding: "16px 18px" }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "#1a4a8a",
                      fontWeight: 500,
                      marginBottom: 6,
                      letterSpacing: ".02em",
                      textTransform: "uppercase",
                    }}
                  >
                    Reservas
                  </div>
                  <div
                    className="serif"
                    style={{
                      fontSize: 26,
                      fontWeight: 400,
                      color: "var(--ink)",
                      letterSpacing: "-.02em",
                      marginBottom: 6,
                    }}
                  >
                    12
                  </div>
                  <div style={{ fontSize: 12, color: "var(--graphite)", fontWeight: 500 }}>
                    ↑ 4 vs. ayer
                  </div>
                </div>
                <div
                  style={{
                    background: "var(--white)",
                    borderRadius: 16,
                    padding: "16px 18px",
                    boxShadow: "var(--shadow)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--graphite)",
                      fontWeight: 500,
                      marginBottom: 6,
                      letterSpacing: ".02em",
                      textTransform: "uppercase",
                    }}
                  >
                    Ingreso mes
                  </div>
                  <div
                    className="serif"
                    style={{
                      fontSize: 26,
                      fontWeight: 400,
                      color: "var(--ink)",
                      letterSpacing: "-.02em",
                      marginBottom: 6,
                    }}
                  >
                    $318k
                  </div>
                  <div style={{ fontSize: 12, color: "var(--delta)", fontWeight: 500 }}>
                    ↑ +6% vs. junio
                  </div>
                </div>
              </div>

              {/* Weekly chart */}
              <div
                style={{
                  background: "var(--fog)",
                  borderRadius: 16,
                  padding: "18px 20px",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 550,
                      color: "var(--ink)",
                      letterSpacing: "-.009em",
                    }}
                  >
                    Ventas esta semana
                  </span>
                  <span style={{ fontSize: 12, color: "var(--graphite)", fontWeight: 500 }}>
                    $148.230 total
                  </span>
                </div>
                <svg
                  viewBox="0 0 280 52"
                  width="100%"
                  height="52"
                  fill="none"
                  style={{ display: "block" }}
                >
                  {[
                    { x: 0, y: 28, h: 24, fill: "var(--apricot)" },
                    { x: 40, y: 20, h: 32, fill: "var(--apricot)" },
                    { x: 80, y: 8, h: 44, fill: "rgba(93,42,26,.38)" },
                    { x: 120, y: 24, h: 28, fill: "var(--apricot)" },
                    { x: 160, y: 0, h: 52, fill: "var(--rust)" },
                    { x: 200, y: 36, h: 16, fill: "rgba(163,166,175,.32)" },
                    { x: 240, y: 42, h: 10, fill: "rgba(163,166,175,.22)" },
                  ].map((b) => (
                    <rect key={b.x} x={b.x} y={b.y} width="28" height={b.h} rx="5" fill={b.fill} />
                  ))}
                </svg>
                <div style={{ display: "flex", marginTop: 6 }}>
                  {["Lun", "Mar", "Mié", "Jue", "Hoy", "Sáb", "Dom"].map((d, i) => (
                    <span
                      key={d}
                      style={{
                        flex: 1,
                        textAlign: "center",
                        fontSize: 10,
                        color: i === 4 ? "var(--ink)" : i >= 5 ? "var(--dove)" : "var(--graphite)",
                        fontWeight: i === 4 ? 600 : 400,
                      }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Menu items preview */}
              <div
                style={{ background: "var(--fog)", borderRadius: 16, padding: "18px 20px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 550,
                      color: "var(--ink)",
                      letterSpacing: "-.009em",
                    }}
                  >
                    Menú activo
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--rust)",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Agregar ítem
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { name: "Empanada de carne", cat: "Plato · Principal", price: "$850", bg: "var(--apricot)" },
                    { name: "Choripán", cat: "Plato · Principal", price: "$1.200", bg: "var(--sky)" },
                    { name: "Medialunas x3", cat: "Desayuno · Merienda", price: "$750", bg: "var(--fog)", border: true },
                  ].map((item) => (
                    <div
                      key={item.name}
                      style={{
                        background: "var(--white)",
                        borderRadius: 12,
                        padding: "10px 14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        boxShadow: "rgba(4,23,43,.04) 0 0 0 1px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            background: item.bg,
                            border: item.border ? "1px solid var(--dove)" : undefined,
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 500,
                              color: "var(--ink)",
                              lineHeight: 1.3,
                            }}
                          >
                            {item.name}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--graphite)" }}>{item.cat}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>
                          {item.price}
                        </span>
                        <div
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "var(--delta)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 760px) {
          .dash-wrap { flex-direction: column !important; min-height: auto !important; }
          .dash-sidebar { display: none !important; }
          .dash-outer { border-radius: 16px !important; }
        }
      `}</style>
    </section>
  );
}
