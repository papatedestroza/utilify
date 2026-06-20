"use client";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Creás tu cuenta\ny tu negocio.",
      desc: "En menos de cinco minutos tu local tiene un perfil completo, listo para operar.",
    },
    {
      num: "02",
      title: "Activás los módulos\nque necesitás.",
      desc: "Solo pagás por lo que usás. Sumás o quitás módulos en cualquier momento, sin contratos.",
    },
    {
      num: "03",
      title: "Gestionás todo\ndesde un panel.",
      desc: "Sin técnicos, sin planillas, sin saltar entre apps. Todo en uno, desde el celular.",
    },
  ];

  return (
    <section
      id="como-funciona"
      style={{ background: "var(--fog)", padding: "96px 28px" }}
    >
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
          El proceso
        </p>
        <h2
          className="serif section-title"
          style={{
            fontSize: "clamp(32px,3.8vw,44px)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-.015em",
            color: "var(--ink)",
            marginBottom: 64,
          }}
        >
          Tres pasos. Nada más.
        </h2>

        <div
          className="steps-grid rv"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 48,
          }}
        >
          {steps.map((s) => (
            <div key={s.num}>
              <div
                className="steps-num serif"
                style={{
                  fontSize: 72,
                  fontWeight: 300,
                  lineHeight: 1,
                  letterSpacing: "-.025em",
                  color: "rgba(119,123,134,.45)",
                  marginBottom: 24,
                }}
              >
                {s.num}
              </div>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  letterSpacing: "-.009em",
                  color: "var(--ink)",
                  marginBottom: 12,
                  lineHeight: 1.2,
                  whiteSpace: "pre-line",
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.55,
                  color: "var(--ash)",
                  letterSpacing: "-.014em",
                }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 760px) {
          .steps-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .steps-num { font-size: 56px !important; }
        }
      `}</style>
    </section>
  );
}
