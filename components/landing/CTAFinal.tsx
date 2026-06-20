import Link from "next/link";

export default function CTAFinal() {
  return (
    <section
      style={{
        position: "relative",
        padding: "120px 28px",
        background: "var(--ink)",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 800,
          height: 600,
          background:
            "radial-gradient(ellipse 55% 50% at 50% 50%, rgba(93,42,26,.35) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 600,
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "rgba(255,255,255,.35)",
            letterSpacing: ".06em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          Para empezar hoy
        </p>
        <h2
          className="serif"
          style={{
            fontSize: "clamp(36px,4.5vw,64px)",
            fontWeight: 400,
            lineHeight: 1.06,
            letterSpacing: "-.025em",
            color: "var(--white)",
            marginBottom: 20,
          }}
        >
          Empezá hoy,
          <br />
          <em style={{ fontStyle: "italic" }}>sin tarjeta.</em>
        </h2>
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.55,
            color: "rgba(255,255,255,.55)",
            letterSpacing: "-.016em",
            marginBottom: 48,
          }}
        >
          14 días para probar todo. Si no es para vos, cancelás con un clic.
        </p>
        <div
          style={{
            display: "flex",
            gap: 20,
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          <Link
            href="/auth/register"
            className="hov-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "var(--white)",
              color: "var(--ink)",
              fontSize: 16,
              fontWeight: 480,
              letterSpacing: "-.009em",
              padding: "14px 36px",
              borderRadius: 9999,
            }}
          >
            Crear mi cuenta
          </Link>
          <a
            href="#"
            className="hov-link"
            style={{
              fontSize: 15,
              fontWeight: 450,
              color: "rgba(255,255,255,.45)",
              letterSpacing: "-.009em",
            }}
          >
            ¿Tenés dudas? Hablemos →
          </a>
        </div>
        <p
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,.25)",
            letterSpacing: "-.009em",
          }}
        >
          Sin tarjeta · Cancelás cuando querás · Datos en Argentina
        </p>
      </div>
    </section>
  );
}
