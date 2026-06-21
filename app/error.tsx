"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
        Error
      </span>
      <h1
        style={{
          fontSize: 22,
          fontWeight: 500,
          color: "var(--ink)",
          letterSpacing: "-.015em",
          margin: 0,
        }}
      >
        Algo salió mal
      </h1>
      <p style={{ fontSize: 15, color: "var(--graphite)", margin: 0 }}>
        Ocurrió un error inesperado. Podés intentar de nuevo.
      </p>
      <button
        onClick={reset}
        style={{
          marginTop: 8,
          fontSize: 14,
          fontWeight: 500,
          color: "var(--white)",
          background: "var(--ink)",
          padding: "10px 24px",
          borderRadius: 9999,
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
