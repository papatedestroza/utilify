import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
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
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Utilify" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Utilify — Todo tu negocio, en un solo lugar",
    description: "La plataforma modular para pequeños negocios de Argentina y LATAM.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${sourceSerif4.variable}`}>
      <head>
        <meta name="theme-color" content="#17191c" />
      </head>
      <body>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
