import Link from "next/link";

export default function MenuNotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--fog)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        flexDirection: "column",
        gap: 16,
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: 14, color: "var(--graphite)" }}>
        No encontramos ningún menú con ese link.
      </p>
      <Link
        href="/"
        style={{ fontSize: 14, color: "var(--ink)", fontWeight: 500 }}
      >
        Ir a Utilify →
      </Link>
    </div>
  );
}
