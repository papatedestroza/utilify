"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export function SessionGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const noPersist = localStorage.getItem("sb-no-persist");
    const sessionActive = sessionStorage.getItem("sb-session-active");

    // User logged in without "remember me" and browser was reopened (sessionStorage cleared)
    if (noPersist === "1" && !sessionActive) {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          supabase.auth.signOut().then(() => {
            localStorage.removeItem("sb-no-persist");
            router.push("/auth/login");
          });
        } else {
          localStorage.removeItem("sb-no-persist");
        }
      });
    }
  }, [pathname, router]);

  return null;
}
