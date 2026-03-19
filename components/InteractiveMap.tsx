"use client";

import { useState } from "react";
import Image from "next/image";
import type { ValorantMap, MapPoint } from "@/lib/maps";
import { Info, Target, Lightbulb, MapPin } from "lucide-react";

export function InteractiveMap({ mapData }: { mapData: ValorantMap }) {
  const [activePoint, setActivePoint] = useState<MapPoint | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case "callout": return <MapPin size={16} />;
      case "strategy": return <Lightbulb size={16} />;
      case "lineup": return <Target size={16} />;
      default: return <Info size={16} />;
    }
  };

  const getColor = (type: string, atk?: boolean) => {
    if (atk === true) return "var(--color-val-red)";
    if (atk === false) return "var(--color-esport-teal)";
    if (type === "lineup") return "var(--color-esport-teal)";
    return "var(--color-site-white)";
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem", alignItems: "start" }}>
      
      {/* ── LEFT: INTERACTIVE IMAGE OVERLAY ── */}
      <div 
        style={{ 
          position: "relative", 
          width: "100%", 
          aspectRatio: "1/1",
          background: "var(--color-site-card)",
          border: "1px solid var(--color-site-border)",
          borderRadius: "8px",
          overflow: "hidden"
        }}
      >
        <Image 
          src={mapData.minimapUrl} 
          alt={`Minimap: ${mapData.name}`} 
          fill 
          style={{ objectFit: "contain", padding: "1rem" }} 
        />

        {/* The overlay points */}
        {mapData.points.map((pt) => {
          const isActive = activePoint?.id === pt.id;
          const color = getColor(pt.type, pt.attackerSide);

          return (
            <button
              key={pt.id}
              onClick={() => setActivePoint(pt)}
              style={{
                position: "absolute",
                top: `${pt.y}%`,
                left: `${pt.x}%`,
                transform: "translate(-50%, -50%)",
                width: isActive ? "32px" : "24px",
                height: isActive ? "32px" : "24px",
                borderRadius: "50%",
                background: isActive ? "var(--color-site-bg)" : "rgba(15,25,35,0.8)",
                border: `2px solid ${color}`,
                color: color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                zIndex: isActive ? 10 : 2,
                cursor: "pointer",
                boxShadow: isActive ? `0 0 20px ${color}` : "0 4px 6px rgba(0,0,0,0.5)",
              }}
              className="map-marker-btn"
              title={pt.label}
            >
              {getIcon(pt.type)}
            </button>
          );
        })}
      </div>

      {/* ── RIGHT: DETAIL PANEL ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {activePoint ? (
          <div
            style={{
              background: "var(--color-site-card)",
              border: "1px solid var(--color-site-border)",
              borderLeft: `4px solid ${getColor(activePoint.type, activePoint.attackerSide)}`,
              padding: "2rem 1.5rem",
              borderRadius: "4px",
              animation: "slideInRight 0.3s ease-out"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", color: getColor(activePoint.type, activePoint.attackerSide) }}>
              {getIcon(activePoint.type)}
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {activePoint.type} {activePoint.attackerSide !== undefined && (activePoint.attackerSide ? "(Támadó)" : "(Védő)")}
              </span>
            </div>
            
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.75rem", margin: "0 0 1rem 0", textTransform: "uppercase", letterSpacing: "0.02em" }}>
              {activePoint.label}
            </h3>
            
            <p style={{ color: "var(--color-site-muted)", fontSize: "1.0625rem", lineHeight: 1.6, margin: 0 }}>
              {activePoint.description}
            </p>
          </div>
        ) : (
          <div style={{ 
            background: "rgba(255,255,255,0.03)", 
            border: "1px dashed var(--color-site-border)", 
            padding: "3rem 1.5rem", 
            borderRadius: "4px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            color: "var(--color-site-muted)"
          }}>
            <MapPin size={32} opacity={0.5} />
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", margin: "0 0 0.5rem 0", color: "var(--color-site-white)" }}>Válassz ki egy pontot</p>
              <p style={{ margin: 0, fontSize: "0.875rem" }}>Kattints a térképen lévő ikonok egyikére, hogy részletes leírást kapj az adott calloutról vagy taktikáról.</p>
            </div>
          </div>
        )}

        <div style={{ background: "var(--color-site-card)", border: "1px solid var(--color-site-border)", padding: "1.5rem", borderRadius: "4px" }}>
          <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem", textTransform: "uppercase", margin: "0 0 1rem 0", letterSpacing: "0.05em", color: "var(--color-site-white)", borderBottom: "1px solid var(--color-site-border)", paddingBottom: "0.5rem" }}>Jelmagyarázat</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <li style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--color-site-muted)", fontSize: "0.875rem" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--color-site-bg)", border: "2px solid var(--color-val-red)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-val-red)" }}><MapPin size={10} /></div>
              Támadó Callout / Irány
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--color-site-muted)", fontSize: "0.875rem" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--color-site-bg)", border: "2px solid var(--color-esport-teal)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-esport-teal)" }}><MapPin size={10} /></div>
              Védő Callout / Irány
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--color-site-muted)", fontSize: "0.875rem" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--color-site-bg)", border: "2px solid var(--color-esport-teal)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-esport-teal)" }}><Target size={10} /></div>
              Lineup (Taktikai képesség)
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--color-site-muted)", fontSize: "0.875rem" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--color-site-bg)", border: "2px solid var(--color-site-white)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-site-white)" }}><Lightbulb size={10} /></div>
              Stratégiai zóna / Általános
            </li>
          </ul>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .map-marker-btn:hover {
          transform: translate(-50%, -50%) scale(1.2) !important;
          z-index: 5 !important;
        }
      `}} />
    </div>
  );
}
