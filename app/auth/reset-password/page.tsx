"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    // Supabase extrae el token del hash #access_token=... y restaura la sesión
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setSessionReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError("No pudimos actualizar la contraseña: " + updateError.message);
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/admin"), 2500);
  }

  if (done) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <div style={{ fontSize: 40, marginBottom: 16, textAlign: "center" }}>✅</div>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--ink)", letterSpacing: "-.015em", marginBottom: 12, textAlign: "center" }}>
            Contraseña actualizada
          </h1>
          <p style={{ fontSize: 15, color: "var(--graphite)", textAlign: "center", lineHeight: 1.6 }}>
            Tu contraseña fue cambiada exitosamente.
            <br />
            Redirigiendo al panel...
          </p>
        </div>
      </div>
    );
  }

  if (!sessionReady) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <Link href="/" style={logoStyle}>Utilify</Link>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--ink)", letterSpacing: "-.015em", marginBottom: 12 }}>
            Verificando link...
          </h1>
          <p style={{ fontSize: 15, color: "var(--graphite)", lineHeight: 1.6, marginBottom: 20 }}>
            Si llegaste aquí desde un email de recuperación, esperá un momento.
          </p>
          <p style={{ fontSize: 13, color: "var(--ash)" }}>
            ¿El link expiró?{" "}
            <Link href="/auth/login" style={{ color: "var(--ink)", fontWeight: 500 }}>
              Solicitá uno nuevo
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <Link href="/" style={logoStyle}>Utilify</Link>
        <h1 style={{ fontSize: 26, fontWeight: 500, color: "var(--ink)", letterSpacing: "-.015em", marginBottom: 8 }}>
          Nueva contraseña
        </h1>
        <p style={{ fontSize: 15, color: "var(--graphite)", marginBottom: 28 }}>
          Elegí una contraseña segura para tu cuenta.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label htmlFor="password" style={labelStyle}>Nueva contraseña</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="confirm" style={labelStyle}>Confirmar contraseña</label>
            <input
              id="confirm"
              type="password"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repetí la contraseña"
              style={inputStyle}
            />
          </div>

          {error && (
            <p role="alert" aria-live="polite" style={{ fontSize: 13, color: "var(--rust)", background: "var(--apricot)", padding: "10px 14px", borderRadius: 10 }}>
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
            {loading ? "Guardando..." : "Guardar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "var(--fog)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px 16px",
};

const cardStyle: React.CSSProperties = {
  background: "var(--white)",
  borderRadius: 24,
  padding: "40px 36px",
  width: "100%",
  maxWidth: 440,
  boxShadow: "var(--shadow)",
};

const logoStyle: React.CSSProperties = {
  display: "block",
  fontSize: 20,
  fontWeight: 650,
  letterSpacing: "-.45px",
  color: "var(--ink)",
  marginBottom: 32,
};

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
