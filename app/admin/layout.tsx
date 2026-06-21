import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import AdminSidebar from "@/components/common/AdminSidebar";
import { InactivityGuard } from "@/components/common/InactivityGuard";
import { SessionGuard } from "@/components/common/SessionGuard";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id, name, slug")
    .eq("user_id", user.id)
    .single();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--fog)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <header
        style={{
          height: 52,
          background: "var(--white)",
          borderBottom: "1px solid var(--dove)",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 16,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <span
          style={{
            fontSize: 15,
            fontWeight: 650,
            letterSpacing: "-.4px",
            color: "var(--ink)",
          }}
        >
          Utilify
        </span>
        <span style={{ width: 1, height: 18, background: "var(--dove)" }} />
        <span style={{ fontSize: 13, color: "var(--graphite)" }}>Panel</span>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--delta)",
            }}
          />
          <span style={{ fontSize: 12, color: "var(--graphite)" }}>
            {business?.name ?? "Tu negocio"}
          </span>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "var(--ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: "var(--white)",
              fontWeight: 600,
            }}
          >
            {user.email?.[0]?.toUpperCase() ?? "U"}
          </div>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        <AdminSidebar />
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
      <InactivityGuard />
      <SessionGuard />
    </div>
  );
}
