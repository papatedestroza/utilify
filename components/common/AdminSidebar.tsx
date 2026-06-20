"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

const modules = [
  { label: "Dashboard", href: "/admin", active: true },
  { label: "CMS / Web", href: "/admin/cms", active: true },
  { label: "Finanzas", href: "#", active: false },
  { label: "Gestión", href: "#", active: false },
  { label: "Marketing", href: "#", active: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside
      style={{
        width: 220,
        background: "var(--white)",
        borderRight: "1px solid var(--dove)",
        padding: "24px 0",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        minHeight: "calc(100vh - 52px)",
      }}
    >
      <div
        style={{
          padding: "0 16px 8px",
          fontSize: 11,
          fontWeight: 500,
          color: "var(--dove)",
          letterSpacing: ".07em",
          textTransform: "uppercase",
        }}
      >
        Módulos
      </div>

      {modules.map((m) =>
        m.active ? (
          <Link
            key={m.label}
            href={m.href}
            style={{
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: 11,
              margin: "2px 8px",
              borderRadius: 10,
              background:
                pathname === m.href || (m.href !== "/admin" && pathname.startsWith(m.href))
                  ? "var(--fog)"
                  : "transparent",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background:
                  pathname === m.href || (m.href !== "/admin" && pathname.startsWith(m.href))
                    ? "var(--ink)"
                    : "var(--dove)",
                border:
                  pathname === m.href || (m.href !== "/admin" && pathname.startsWith(m.href))
                    ? "none"
                    : "1.5px solid var(--dove)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight:
                  pathname === m.href || (m.href !== "/admin" && pathname.startsWith(m.href))
                    ? 500
                    : 400,
                color:
                  pathname === m.href || (m.href !== "/admin" && pathname.startsWith(m.href))
                    ? "var(--ink)"
                    : "var(--ash)",
              }}
            >
              {m.label}
            </span>
          </Link>
        ) : (
          <div
            key={m.label}
            style={{
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: 11,
              margin: "2px 8px",
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "transparent",
                border: "1.5px solid var(--dove)",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 14, color: "var(--dove)" }}>{m.label}</span>
            <span
              style={{
                fontSize: 10,
                color: "var(--dove)",
                marginLeft: "auto",
                background: "var(--fog)",
                padding: "1px 7px",
                borderRadius: 9999,
                border: "1px solid var(--dove)",
              }}
            >
              soon
            </span>
          </div>
        )
      )}

      <div style={{ flex: 1 }} />

      <div
        style={{
          padding: "0 8px",
          borderTop: "1px solid var(--dove)",
          paddingTop: 12,
          margin: "0 8px 0",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "10px 8px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "none",
            border: "none",
            cursor: "pointer",
            borderRadius: 10,
            fontFamily: "inherit",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="var(--graphite)"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M10 3h3a1 1 0 011 1v8a1 1 0 01-1 1h-3" />
            <polyline points="7,11 10,8 7,5" />
            <line x1="10" y1="8" x2="2" y2="8" />
          </svg>
          <span style={{ fontSize: 13, color: "var(--graphite)" }}>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
