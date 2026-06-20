"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        height: 68,
        background: "var(--white)",
        borderBottom: "1px solid var(--dove)",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,.07)" : "none",
        transition: "box-shadow .2s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 28px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 32,
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: 18,
            fontWeight: 650,
            letterSpacing: "-.45px",
            color: "var(--ink)",
            flexShrink: 0,
          }}
        >
          Utilify
        </Link>

        {/* Desktop nav links */}
        <div
          className="nav-links"
          style={{ display: "flex", gap: 28, alignItems: "center" }}
        >
          {[
            { href: "#modulos", label: "Producto" },
            { href: "#modulos", label: "Módulos" },
            { href: "#precios", label: "Precios" },
            { href: "#clientes", label: "Clientes" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hov-nav"
              style={{
                fontSize: 15,
                fontWeight: 450,
                letterSpacing: "-.009em",
                color: "var(--ink)",
              }}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexShrink: 0 }}>
          <Link
            href="/auth/login"
            className="nav-ingresar hov-link"
            style={{ fontSize: 15, fontWeight: 450, letterSpacing: "-.009em", color: "var(--ink)" }}
          >
            Ingresar
          </Link>
          <Link
            href="/auth/register"
            className="hov-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "var(--ink)",
              color: "var(--white)",
              fontSize: 15,
              fontWeight: 450,
              letterSpacing: "-.009em",
              padding: "9px 22px",
              borderRadius: 9999,
              whiteSpace: "nowrap",
            }}
          >
            Probar gratis
          </Link>
          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="nav-ham"
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              background: "none",
              border: "1px solid var(--dove)",
              borderRadius: 9,
              cursor: "pointer",
              fontSize: 18,
              color: "var(--ink)",
            }}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: 68,
            left: 0,
            right: 0,
            background: "var(--white)",
            borderBottom: "1px solid var(--dove)",
            padding: "20px 28px",
            flexDirection: "column",
            gap: 0,
            zIndex: 190,
            display: "flex",
          }}
        >
          {[
            { href: "#modulos", label: "Producto" },
            { href: "#modulos", label: "Módulos" },
            { href: "#precios", label: "Precios" },
            { href: "#clientes", label: "Clientes" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                fontSize: 16,
                fontWeight: 450,
                color: "var(--ink)",
                padding: "14px 0",
                borderBottom: "1px solid var(--fog)",
              }}
            >
              {item.label}
            </a>
          ))}
          <div
            style={{
              paddingTop: 20,
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            <Link href="/auth/login" style={{ fontSize: 15, fontWeight: 450, color: "var(--ink)" }}>
              Ingresar
            </Link>
            <Link
              href="/auth/register"
              style={{
                display: "inline-flex",
                background: "var(--ink)",
                color: "var(--white)",
                fontSize: 15,
                fontWeight: 450,
                padding: "9px 22px",
                borderRadius: 9999,
              }}
            >
              Probar gratis
            </Link>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 760px) {
          .nav-links { display: none !important; }
          .nav-ingresar { display: none !important; }
          .nav-ham { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
