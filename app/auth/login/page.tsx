"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

const LOCK_KEY = "sb-login-lock";
const LOCK_DURATION_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function getRemainingLockMs(): number {
  try {
    const raw = localStorage.getItem(LOCK_KEY);
    if (!raw) return 0;
    const remaining = parseInt(raw, 10) - Date.now();
    return remaining > 0 ? remaining : 0;
  } catch {
    return 0;
  }
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [lockMinutes, setLockMinutes] = useState(0);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Restore lockout state from localStorage on mount
  useEffect(() => {
    const remaining = getRemainingLockMs();
    if (remaining > 0) {
      setLockedUntil(Date.now() + remaining);
      setLockMinutes(Math.ceil(remaining / 1000 / 60));
    }
    const oauthError = searchParams.get("error");
    if (oauthError === "oauth") {
      setError("No pudimos autenticarte con Google. Intentá de nuevo.");
    }
  }, [searchParams]);

  // Update lockout minutes countdown
  useEffect(() => {
    if (!lockedUntil) return;
    const id = setInterval(() => {
      const remaining = lockedUntil - Date.now();
      if (remaining <= 0) {
        setLockedUntil(0);
        setLockMinutes(0);
        setFailedAttempts(0);
        localStorage.removeItem(LOCK_KEY);
      } else {
        setLockMinutes(Math.ceil(remaining / 1000 / 60));
      }
    }, 15000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  const isLocked = lockedUntil > 0;

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError("");
    const supabase = createClient();
    const redirect = searchParams.get("redirect");
    const next = redirect?.startsWith("/") ? redirect : "/admin";
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setGoogleLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setEmailNotConfirmed(false);

    // Block if locked out
    const remainingLock = getRemainingLockMs();
    if (remainingLock > 0) {
      const mins = Math.ceil(remainingLock / 1000 / 60);
      setError(`Cuenta bloqueada temporalmente por seguridad. Intenta de nuevo en ${mins} minuto${mins !== 1 ? "s" : ""}.`);
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      const newAttempts = failedAttempts + 1;

      // Lock account after MAX_ATTEMPTS
      if (newAttempts >= MAX_ATTEMPTS) {
        const lockUntil = Date.now() + LOCK_DURATION_MS;
        localStorage.setItem(LOCK_KEY, lockUntil.toString());
        setLockedUntil(lockUntil);
        setLockMinutes(15);
        setError("Cuenta bloqueada temporalmente por seguridad. Intenta de nuevo en 15 minutos.");
        setForm((f) => ({ ...f, password: "" }));
        setLoading(false);
        return;
      }

      setFailedAttempts(newAttempts);
      const attemptsLeft = MAX_ATTEMPTS - newAttempts;

      const msg = authError.message ?? "";
      if (msg.toLowerCase().includes("email not confirmed") || msg.includes("not confirmed")) {
        setEmailNotConfirmed(true);
        setError("Tu email aún no fue confirmado. Revisá tu bandeja de entrada o la carpeta de spam.");
      } else if (
        msg.toLowerCase().includes("invalid login credentials") ||
        msg.toLowerCase().includes("invalid credentials")
      ) {
        setError(
          `El correo o la contraseña son incorrectos.${attemptsLeft > 0 ? ` Te queda${attemptsLeft !== 1 ? "n" : ""} ${attemptsLeft} intento${attemptsLeft !== 1 ? "s" : ""} antes del bloqueo.` : ""}`
        );
      } else if (msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("too many")) {
        setError("Demasiados intentos. Esperá unos minutos e intentá de nuevo.");
      } else {
        setError("No pudimos iniciar sesión. Intentá de nuevo.");
      }

      // Keep email, clear only password
      setForm((f) => ({ ...f, password: "" }));
      setLoading(false);
      return;
    }

    // Successful login — apply remember me preference
    if (rememberMe) {
      localStorage.removeItem("sb-no-persist");
    } else {
      localStorage.setItem("sb-no-persist", "1");
    }
    sessionStorage.setItem("sb-session-active", "1");
    localStorage.removeItem(LOCK_KEY);

    const redirect = searchParams.get("redirect");
    const dest = redirect?.startsWith("/") ? redirect : "/admin";
    router.push(dest);
    router.refresh();
  }

  async function handleResendConfirmation() {
    if (!form.email) {
      setError("Ingresá tu email para reenviar la confirmación.");
      return;
    }
    setResetLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resend({ type: "signup", email: form.email });
    setResetLoading(false);
    if (error) {
      setError("No pudimos reenviar el email: " + error.message);
    } else {
      setError("");
      setResetSent(true);
      setEmailNotConfirmed(false);
    }
  }

  async function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email) {
      setError("Ingresá tu email para recuperar la contraseña.");
      return;
    }
    setResetLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    setResetLoading(false);
    if (error) {
      setError("No pudimos enviar el email: " + error.message);
    } else {
      setResetSent(true);
      setError("");
    }
  }

  if (resetSent) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <div style={{ fontSize: 40, marginBottom: 16, textAlign: "center" }}>📬</div>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--ink)", letterSpacing: "-.015em", marginBottom: 12, textAlign: "center" }}>
            Revisá tu correo
          </h1>
          <p style={{ fontSize: 15, color: "var(--graphite)", lineHeight: 1.6, marginBottom: 24, textAlign: "center" }}>
            Te enviamos un email a{" "}
            <strong style={{ color: "var(--ink)" }}>{form.email}</strong>.
            <br />
            {resetMode ? "Hacé clic en el link para restablecer tu contraseña." : "Hacé clic en el link para confirmar tu cuenta."}
          </p>
          <button
            onClick={() => { setResetSent(false); setResetMode(false); }}
            style={linkButtonStyle}
          >
            ← Volver al login
          </button>
        </div>
      </div>
    );
  }

  if (resetMode) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <Link href="/" style={logoStyle}>Utilify</Link>
          <h1 style={titleStyle}>Recuperar contraseña</h1>
          <p style={{ fontSize: 15, color: "var(--graphite)", marginBottom: 28 }}>
            Te enviamos un link para restablecer tu contraseña.
          </p>
          <form onSubmit={handlePasswordReset} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label htmlFor="reset-email" style={labelStyle}>Email</label>
              <input
                id="reset-email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="vos@tunegocio.com"
                style={inputStyle}
              />
            </div>
            {error && <p role="alert" aria-live="polite" style={errorStyle}>{error}</p>}
            <button
              type="submit"
              disabled={resetLoading}
              style={{ ...submitStyle, background: resetLoading ? "var(--dove)" : "var(--ink)", cursor: resetLoading ? "not-allowed" : "pointer" }}
            >
              {resetLoading ? "Enviando..." : "Enviar link de recuperación"}
            </button>
          </form>
          <button onClick={() => { setResetMode(false); setError(""); }} style={linkButtonStyle}>
            ← Volver al login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <Link href="/" style={logoStyle}>Utilify</Link>

        <h1 style={titleStyle}>Ingresá a tu cuenta</h1>
        <p style={{ fontSize: 15, color: "var(--graphite)", marginBottom: 28 }}>
          Bienvenido de vuelta.
        </p>

        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || isLocked}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            background: "var(--white)",
            border: "1px solid var(--dove)",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 15,
            color: "var(--ink)",
            cursor: googleLoading || isLocked ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            fontWeight: 500,
            opacity: isLocked ? 0.5 : 1,
            marginBottom: 20,
            transition: "background .15s ease",
            boxSizing: "border-box",
          }}
        >
          <GoogleIcon />
          {googleLoading ? "Redirigiendo..." : "Continuar con Google"}
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "var(--dove)" }} />
          <span style={{ fontSize: 12, color: "var(--ash)", whiteSpace: "nowrap" }}>o ingresá con email</span>
          <div style={{ flex: 1, height: 1, background: "var(--dove)" }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Email */}
          <div>
            <label htmlFor="email" style={labelStyle}>Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="vos@tunegocio.com"
              style={{ ...inputStyle, opacity: isLocked ? 0.6 : 1 }}
              disabled={isLocked}
            />
          </div>

          {/* Password with visibility toggle */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label htmlFor="password" style={{ ...labelStyle, marginBottom: 0 }}>Contraseña</label>
              <button
                type="button"
                onClick={() => { setResetMode(true); setError(""); setEmailNotConfirmed(false); }}
                style={{ fontSize: 12, color: "var(--graphite)", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                style={{ ...inputStyle, paddingRight: 44, opacity: isLocked ? 0.6 : 1 }}
                disabled={isLocked}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                tabIndex={-1}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--ash)",
                  padding: 2,
                  display: "flex",
                  alignItems: "center",
                  lineHeight: 1,
                }}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          {/* Remember me */}
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: isLocked ? "not-allowed" : "pointer", userSelect: "none" }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLocked}
              style={{ width: 16, height: 16, cursor: isLocked ? "not-allowed" : "pointer", accentColor: "var(--ink)" }}
            />
            <span style={{ fontSize: 14, color: "var(--graphite)" }}>Recordarme</span>
          </label>

          {/* Error / lockout message */}
          {(error || (isLocked && !error)) && (
            <div
              role="alert"
              aria-live="polite"
              style={{
                fontSize: 13,
                color: "var(--rust)",
                background: "var(--apricot)",
                padding: "10px 14px",
                borderRadius: 10,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <span>
                {isLocked && !error
                  ? `Cuenta bloqueada temporalmente por seguridad. Intenta de nuevo en ${lockMinutes} minuto${lockMinutes !== 1 ? "s" : ""}.`
                  : error}
              </span>
              {emailNotConfirmed && (
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={resetLoading}
                  style={{
                    fontSize: 12,
                    color: "var(--rust)",
                    background: "none",
                    border: "1px solid var(--rust)",
                    borderRadius: 6,
                    padding: "4px 10px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    alignSelf: "flex-start",
                  }}
                >
                  {resetLoading ? "Reenviando..." : "Reenviar email de confirmación"}
                </button>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || isLocked}
            style={{
              ...submitStyle,
              background: loading || isLocked ? "var(--dove)" : "var(--ink)",
              cursor: loading || isLocked ? "not-allowed" : "pointer",
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", background: "var(--fog)", display: "flex", alignItems: "center", justifyContent: "center" }} />
      }
    >
      <LoginForm />
    </Suspense>
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

const titleStyle: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 500,
  color: "var(--ink)",
  letterSpacing: "-.015em",
  marginBottom: 8,
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

const errorStyle: React.CSSProperties = {
  fontSize: 13,
  color: "var(--rust)",
  background: "var(--apricot)",
  padding: "10px 14px",
  borderRadius: 10,
};

const submitStyle: React.CSSProperties = {
  color: "var(--white)",
  border: "none",
  borderRadius: 9999,
  padding: "12px 28px",
  fontSize: 15,
  fontWeight: 500,
  fontFamily: "inherit",
  marginTop: 4,
  transition: "background .15s ease",
  width: "100%",
};

const linkButtonStyle: React.CSSProperties = {
  marginTop: 20,
  fontSize: 13,
  color: "var(--graphite)",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontFamily: "inherit",
  padding: 0,
  display: "block",
  textAlign: "center",
  width: "100%",
};
