"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", businessName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "confirm-email">("form");

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
      setError(translateAuthError(authError.message));
      setLoading(false);
      return;
    }

    if (authData.user) {
      // Detectar si Supabase devolvió un usuario ya existente en silencio
      // (behavior anti-enumeración: devuelve 200 sin error aunque el email ya exista)
      const ageMs = Date.now() - new Date(authData.user.created_at).getTime();
      if (!authData.session && ageMs > 10_000) {
        setError("Este email ya tiene una cuenta. Ingresá en su lugar.");
        setLoading(false);
        return;
      }

      // Crear negocio server-side con service role para evitar RLS cuando
      // la sesión no está activa todavía (email confirmation pendiente)
      const res = await fetch("/api/auth/complete-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authData.session?.access_token
            ? { Authorization: `Bearer ${authData.session.access_token}` }
            : {}),
        },
        body: JSON.stringify({
          userId: authData.user.id,
          businessName: form.businessName,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        if (res.status === 409 || data.error === "email_already_registered") {
          setError("Este email ya tiene una cuenta. Ingresá en su lugar.");
        } else {
          setError("No pudimos crear tu cuenta. Intentá de nuevo.");
        }
        setLoading(false);
        return;
      }

      // Si no hay sesión, el email confirmation está habilitado
      if (!authData.session) {
        setStep("confirm-email");
        setLoading(false);
        return;
      }

      router.push("/admin");
    }

    setLoading(false);
  }

  if (step === "confirm-email") {
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
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: "var(--ink)",
              letterSpacing: "-.015em",
              marginBottom: 12,
            }}
          >
            Revisá tu correo
          </h1>
          <p style={{ fontSize: 15, color: "var(--graphite)", lineHeight: 1.6, marginBottom: 24 }}>
            Te enviamos un link de confirmación a{" "}
            <strong style={{ color: "var(--ink)" }}>{form.email}</strong>.
            <br />
            Hacé clic en el link para activar tu cuenta.
          </p>
          <p style={{ fontSize: 13, color: "var(--ash)" }}>
            ¿No lo recibiste? Revisá la carpeta de spam.
          </p>
        </div>
      </div>
    );
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
              autoComplete="organization"
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
              autoComplete="email"
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
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Mínimo 6 caracteres"
              style={inputStyle}
            />
          </div>

          {error && (
            <p
              role="alert"
              aria-live="polite"
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

function translateAuthError(msg: string): string {
  if (msg.includes("already registered") || msg.includes("already been registered")) {
    return "Este email ya tiene una cuenta. Ingresá en su lugar.";
  }
  if (msg.includes("Invalid email")) return "El formato del email no es válido.";
  if (msg.includes("Password should be at least")) return "La contraseña debe tener al menos 6 caracteres.";
  if (msg.includes("weak")) return "La contraseña es demasiado débil. Usá letras, números y símbolos.";
  if (msg.includes("rate limit") || msg.includes("too many")) return "Demasiados intentos. Esperá unos minutos e intentá de nuevo.";
  return "Ocurrió un error. Intentá de nuevo.";
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
