import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://utilify.com.ar"),
  title: {
    default: "Utilify — Todo tu negocio, en un solo lugar",
    template: "%s | Utilify",
  },
  description:
    "La plataforma modular para que gestiones tu bar, cafetería o comercio sin depender de un técnico. Editá tu menú, controlá tus ventas y organizá tu operación desde el celular.",
  keywords: ["menú digital", "gestión de bar", "CMS menú", "gestión de comercio", "Argentina", "LATAM"],
  openGraph: {
    title: "Utilify — Todo tu negocio, en un solo lugar",
    description: "La plataforma modular para pequeños negocios de Argentina y LATAM.",
    url: "https://utilify.com.ar",
    siteName: "Utilify",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Utilify — Todo tu negocio, en un solo lugar",
    description: "La plataforma modular para pequeños negocios de Argentina y LATAM.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300..700;1,8..60,300..700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#17191c" />
      </head>
      <body>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
