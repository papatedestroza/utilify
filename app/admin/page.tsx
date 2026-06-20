import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export const metadata = { title: "Dashboard — Admin" };

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("name, slug, plan")
    .eq("user_id", user.id)
    .single();

  const modules = [
    {
      id: "cms",
      label: "CMS / Web",
      desc: "Editá tu menú, galería y horarios.",
      href: "/admin/cms",
      available: true,
      bg: "var(--apricot)",
      badge: "Activo",
      badgeColor: "var(--rust)",
      badgeBg: "rgba(93,42,26,.12)",
    },
    {
      id: "finanzas",
      label: "Finanzas",
      desc: "Ingreso, gastos y cierre de mes.",
      href: "#",
      available: false,
      bg: "var(--white)",
      badge: "Próximamente",
      badgeColor: "var(--graphite)",
      badgeBg: "var(--fog)",
    },
    {
      id: "gestion",
      label: "Gestión",
      desc: "Turnos, reservas y pedidos.",
      href: "#",
      available: false,
      bg: "var(--white)",
      badge: "Próximamente",
      badgeColor: "var(--graphite)",
      badgeBg: "var(--fog)",
    },
    {
      id: "marketing",
      label: "Marketing",
      desc: "Posts, campañas y métricas.",
      href: "#",
      available: false,
      bg: "var(--sky)",
      badge: "Próximamente",
      badgeColor: "#1a4a8a",
      badgeBg: "rgba(26,74,138,.1)",
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 550,
            color: "var(--ink)",
            letterSpacing: "-.012em",
            marginBottom: 4,
          }}
        >
          Bienvenido, {user.email?.split("@")[0]}
        </h1>
        <p style={{ fontSize: 14, color: "var(--graphite)" }}>
          {business?.name ?? "Tu negocio"} · Plan{" "}
          <span style={{ textTransform: "capitalize" }}>{business?.plan ?? "Starter"}</span>
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {modules.map((mod) => {
          const content = (
            <div
              style={{
                background: mod.bg,
                borderRadius: 20,
                padding: 24,
                boxShadow: "var(--shadow)",
                cursor: mod.available ? "pointer" : "default",
                opacity: mod.available ? 1 : 0.75,
                transition: "transform .2s ease, box-shadow .2s ease",
              }}
              className={mod.available ? "hov-card" : ""}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: "var(--ink)",
                  }}
                >
                  {mod.label}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: mod.badgeColor,
                    background: mod.badgeBg,
                    padding: "2px 10px",
                    borderRadius: 9999,
                  }}
                >
                  {mod.badge}
                </span>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--ash)",
                  lineHeight: 1.5,
                }}
              >
                {mod.desc}
              </p>
              {mod.available && (
                <div
                  style={{
                    marginTop: 16,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--rust)",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  Abrir módulo →
                </div>
              )}
            </div>
          );

          return mod.available ? (
            <Link key={mod.id} href={mod.href} style={{ textDecoration: "none" }}>
              {content}
            </Link>
          ) : (
            <div key={mod.id}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}
