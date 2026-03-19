import { getMapById, getAllMaps } from "@/lib/maps";
import { InteractiveMap } from "@/components/InteractiveMap";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Map } from "lucide-react";
import type { Metadata } from "next";

interface MapPageProps {
  params: Promise<{ map: string }>;
}

export async function generateMetadata({ params }: MapPageProps): Promise<Metadata> {
  const { map } = await params;
  const mapData = await getMapById(map);
  if (!mapData) return { title: "Térkép nem található | GamerHírek" };
  return { title: `${mapData.name} - Valorant Térkép Útmutató | GamerHírek` };
}

export async function generateStaticParams() {
  const maps = await getAllMaps();
  return maps.map((m) => ({ map: m.id }));
}

export default async function MapGuidePage({ params }: MapPageProps) {
  const { map } = await params;
  const mapData = await getMapById(map);

  if (!mapData) {
    notFound();
  }

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <Link 
        href="/terkep-guides" 
        style={{ 
          display: "inline-flex", 
          alignItems: "center", 
          gap: "0.5rem", 
          color: "var(--color-site-muted)", 
          fontFamily: "var(--font-display)", 
          fontWeight: 700, 
          fontSize: "0.75rem", 
          textTransform: "uppercase", 
          letterSpacing: "0.1em",
          marginBottom: "2rem",
          transition: "color 0.2s ease"
        }}
        className="back-link"
      >
        <ArrowLeft size={16} /> Összes Térkép Listája
      </Link>

      <header style={{ marginBottom: "3rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ background: "rgba(0, 196, 180, 0.1)", color: "var(--color-esport-teal)", padding: "0.5rem 1rem", borderRadius: "100px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            <Map size={16} /> Interaktív Útmutató
          </div>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(2.5rem, 5vw, 4rem)", textTransform: "uppercase", letterSpacing: "0.02em", margin: 0, lineHeight: 1 }}>
          <span style={{ color: "var(--color-site-white)" }}>Térkép:</span> <span style={{ color: "var(--color-val-red)" }}>{mapData.name}</span>
        </h1>
        <p style={{ color: "var(--color-site-muted)", maxWidth: "800px", fontSize: "1.125rem", margin: "1rem 0 0 0", lineHeight: 1.6 }}>
          {mapData.description}
        </p>
      </header>

      <div style={{ padding: "2rem", background: "rgba(15,25,35,0.4)", border: "1px solid var(--color-site-border)", borderRadius: "12px", boxShadow: "0 20px 40px -20px rgba(0,0,0,0.5)" }}>
        <InteractiveMap mapData={mapData} />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .back-link:hover {
          color: var(--color-site-white) !important;
        }
      `}} />
    </div>
  );
}
