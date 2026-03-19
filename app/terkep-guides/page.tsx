import Image from "next/image";
import Link from "next/link";
import { getAllMaps } from "@/lib/maps";
import { Map, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Valorant Interaktív Térképek | GamerHírek",
  description: "Részletes, interaktív Valorant térkép útmutatók calloutokkal és taktikákkal.",
};

export default async function MapsDirectoryPage() {
  const maps = await getAllMaps();

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <header style={{ marginBottom: "3rem", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", textAlign: "center" }}>
        <div style={{ background: "rgba(0, 196, 180, 0.1)", color: "var(--color-esport-teal)", padding: "0.5rem 1rem", borderRadius: "100px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
          <Map size={16} />
          Útmutatók Pro Stratégiákhoz
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3.5rem)", textTransform: "uppercase", letterSpacing: "0.02em", margin: 0, lineHeight: 1.1 }}>
          Interaktív <span style={{ color: "var(--color-val-red)" }}>Térképek</span>
        </h1>
        <p style={{ color: "var(--color-site-muted)", maxWidth: "600px", fontSize: "1.125rem", margin: 0 }}>
          Sajátítsd el az összes Valorant pálya legfontosabb szögeit, fedezékeit és neveit! Válassz egy térképet a professzionális calloutok és lineup-ok megtekintéséhez.
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
        {maps.map((map) => (
          <Link
            href={`/terkep-guides/${map.id}`}
            key={map.id}
            style={{
              display: "block",
              background: "var(--color-site-card)",
              borderRadius: "8px",
              border: "1px solid var(--color-site-border)",
              position: "relative",
              overflow: "hidden",
              transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
            }}
            className="map-card hover-lift"
          >
            <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
              <div style={{ position: "absolute", zIndex: 1, inset: 0, background: "linear-gradient(180deg, transparent 0%, rgba(15,25,35,0.9) 100%)" }} />
              <Image src={map.imageUrl} alt={map.name} fill style={{ objectFit: "cover", transition: "transform 0.5s ease" }} className="map-img-hover" />
              <h2 style={{ position: "absolute", bottom: "1rem", left: "1.5rem", zIndex: 2, fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "2rem", textTransform: "uppercase", margin: 0, letterSpacing: "0.05em", color: "var(--color-site-white)", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
                {map.name}
              </h2>
            </div>
            
            <div style={{ padding: "1.5rem", position: "relative" }}>
               {/* Mini-map decorative overlay */}
               <div style={{ position: "absolute", right: "1rem", top: "-1rem", width: "80px", height: "80px", opacity: 0.2, zIndex: 0, pointerEvents: "none" }}>
                  <Image src={map.minimapUrl} alt={`${map.name} minimap`} fill style={{ objectFit: "contain" }} />
               </div>

              <p style={{ color: "var(--color-site-muted)", fontSize: "0.9375rem", lineHeight: 1.6, margin: "0 0 1.5rem 0", position: "relative", zIndex: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {map.description}
              </p>
              
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
                <span style={{ fontSize: "0.8125rem", color: "var(--color-site-muted)", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <MapPin size={14} /> {map.points.length} interaktív pont
                </span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem", color: "var(--color-esport-teal)", textTransform: "uppercase" }}>Térkép Megnyitása →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hover-lift:hover {
          transform: translateY(-6px);
          border-color: var(--color-esport-teal) !important;
          box-shadow: 0 10px 25px -10px rgba(0, 196, 180, 0.3) !important;
        }
        .map-card:hover .map-img-hover {
          transform: scale(1.05);
        }
      `}} />
    </div>
  );
}
