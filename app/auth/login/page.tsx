"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--fog)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <div
        style={{
          background: "var(--white)",
          borderRadius: 24,
          padding: "40px 36px",
          width: "100%",
          maxWidth: 440,
          boxShadow: "var(--shadow)",
        }}
      >
        <Link
          href="/"
          style={{
            display: "block",
            fontSize: 20,
            fontWeight: 650,
            letterSpacing: "-.45px",
            color: "var(--ink)",
            marginBottom: 32,
          }}
        >
          Utilify
        </Link>

        <h1
          style={{
            fontSize: 26,
            fontWeight: 500,
            color: "var(--ink)",
            letterSpacing: "-.015em",
            marginBottom: 8,
          }}
        >
          Ingresá a tu cuenta
        </h1>
        <p style={{ fontSize: 15, color: "var(--graphite)", marginBottom: 28 }}>
          Bienvenido de vuelta.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="vos@tunegocio.com"
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="password" style={labelStyle}>
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>

          {error && (
            <p
              style={{
                fontSize: 13,
                color: "var(--rust)",
                background: "var(--apricot)",
                padding: "10px 14px",
                borderRadius: 10,
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "var(--dove)" : "var(--ink)",
              color: "var(--white)",
              border: "none",
              borderRadius: 9999,
              padding: "12px 28px",
              fontSize: 15,
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              marginTop: 4,
            }}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p style={{ marginTop: 24, fontSize: 14, color: "var(--graphite)", textAlign: "center" }}>
          ¿No tenés cuenta?{" "}
          <Link href="/auth/register" style={{ color: "var(--ink)", fontWeight: 500 }}>
            Registrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "var(--ash)",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--dove)",
  borderRadius: 10,
  padding: "10px 14px",
  fontSize: 15,
  color: "var(--ink)",
  background: "var(--fog)",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};
