import type { Metadata } from "next";
import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import SocialProof from "@/components/landing/SocialProof";
import Modules from "@/components/landing/Modules";
import HowItWorks from "@/components/landing/HowItWorks";
import DashboardDemo from "@/components/landing/DashboardDemo";
import Pricing from "@/components/landing/Pricing";
import CTAFinal from "@/components/landing/CTAFinal";
import Footer from "@/components/landing/Footer";
import ScrollReveal from "@/components/landing/ScrollReveal";

export const metadata: Metadata = {
  title: "Utilify — Todo tu negocio, en un solo lugar",
  description:
    "La plataforma modular para que gestiones tu bar, cafetería o comercio sin depender de un técnico. Editá tu menú, controlá tus ventas y organizá tu operación desde el celular.",
  alternates: { canonical: "https://utilify.com.ar" },
};

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Utilify",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: "https://utilify.com.ar",
    description:
      "Plataforma modular de gestión para pequeños negocios — bares, cafeterías y comercios de Argentina y LATAM.",
    offers: {
      "@type": "Offer",
      price: "2990",
      priceCurrency: "ARS",
    },
    provider: {
      "@type": "Organization",
      name: "Utilify",
      url: "https://utilify.com.ar",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollReveal />
      <div style={{ minHeight: "100vh", background: "var(--white)" }}>
        <header>
          <Nav />
        </header>
        <main>
          <Hero />
          <SocialProof />
          <Modules />
          <HowItWorks />
          <DashboardDemo />
          <Pricing />
          <CTAFinal />
        </main>
        <Footer />
      </div>
    </>
  );
}
