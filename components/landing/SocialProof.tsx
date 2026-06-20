export default function SocialProof() {
  return (
    <section
      id="clientes"
      style={{
        background: "var(--fog)",
        padding: "56px 28px",
        borderTop: "1px solid var(--dove)",
        borderBottom: "1px solid var(--dove)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 0,
            textAlign: "center",
          }}
        >
          {[
            {
              stat: "5 min",
              desc: "Para configurar tu negocio completo, desde cero",
              border: true,
            },
            {
              stat: "0",
              desc: "Técnicos, agencias o conocimientos de código necesarios",
              border: true,
            },
            {
              stat: "14 días",
              desc: "De prueba gratuita, sin tarjeta, sin compromiso",
              border: false,
            },
          ].map((item) => (
            <div
              key={item.stat}
              style={{
                padding: "8px 24px",
                borderRight: item.border ? "1px solid var(--dove)" : "none",
              }}
            >
              <div
                className="serif"
                style={{
                  fontSize: "clamp(36px,4vw,52px)",
                  fontWeight: 400,
                  color: "var(--ink)",
                  letterSpacing: "-.025em",
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {item.stat}
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--graphite)",
                  lineHeight: 1.5,
                  letterSpacing: "-.009em",
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
