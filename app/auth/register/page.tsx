"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { slugify } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", businessName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      const slug = slugify(form.businessName) || `negocio-${Date.now()}`;
      const { error: bizError } = await supabase.from("businesses").insert({
        user_id: authData.user.id,
        name: form.businessName,
        slug,
        plan: "starter",
      });

      if (bizError) {
        setError("Error al crear el negocio: " + bizError.message);
        setLoading(false);
        return;
      }

      router.push("/admin");
    }

    setLoading(false);
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
          Creá tu cuenta
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "var(--graphite)",
            marginBottom: 28,
          }}
        >
          14 días gratis, sin tarjeta.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label
              htmlFor="businessName"
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--ash)",
                marginBottom: 6,
              }}
            >
              Nombre del negocio
            </label>
            <input
              id="businessName"
              type="text"
              required
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              placeholder="Bar La Esquina"
              style={inputStyle}
            />
          </div>

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
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Mínimo 6 caracteres"
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
              transition: "background .15s ease",
            }}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta gratis"}
          </button>
        </form>

        <p
          style={{
            marginTop: 24,
            fontSize: 14,
            color: "var(--graphite)",
            textAlign: "center",
          }}
        >
          ¿Ya tenés cuenta?{" "}
          <Link
            href="/auth/login"
            style={{ color: "var(--ink)", fontWeight: 500 }}
          >
            Ingresar
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
