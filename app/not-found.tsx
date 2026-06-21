import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--fog)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        textAlign: "center",
        padding: "24px 16px",
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "var(--dove)",
          letterSpacing: ".07em",
          textTransform: "uppercase",
        }}
      >
        404
      </span>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 500,
          color: "var(--ink)",
          letterSpacing: "-.015em",
          margin: 0,
        }}
      >
        Página no encontrada
      </h1>
      <p style={{ fontSize: 15, color: "var(--graphite)", margin: 0 }}>
        La dirección que buscás no existe o fue movida.
      </p>
      <Link
        href="/"
        style={{
          marginTop: 8,
          fontSize: 14,
          fontWeight: 500,
          color: "var(--white)",
          background: "var(--ink)",
          padding: "10px 24px",
          borderRadius: 9999,
          textDecoration: "none",
        }}
      >
        Ir al inicio
      </Link>
    </div>
  );
}
