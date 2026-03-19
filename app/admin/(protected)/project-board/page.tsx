"use client";

import React from "react";
import { CheckCircle2, Circle, Clock, Rocket, Server, ShieldCheck, Flag } from "lucide-react";

type Milestone = {
  title: string;
  description: string;
  status: "done" | "in-progress" | "planned";
  icon: React.ReactNode;
};

const phases: { phase: string; title: string; color: string; milestones: Milestone[] }[] = [
  {
    phase: "Fázis 1",
    title: "Alapok & Cikk Motor",
    color: "var(--color-site-white)",
    milestones: [
      { title: "Szerkesztői Rendszer", description: "Cikkek írása, szerkesztése (Markdown), és törlése belsős admin felületen.", status: "done", icon: <Server size={18} /> },
      { title: "Parallax Hero Banner", description: "Látványos, 3D hatású főoldal kezdőképernyő a K/O agent-el.", status: "done", icon: <Rocket size={18} /> },
      { title: "Admin Hitelesítés", description: "Biztonságos JWT alapú auth és layout védelem.", status: "done", icon: <ShieldCheck size={18} /> },
      { title: "Kereső Overlay", description: "Globális, modális kereső az oldalon található összes cikk között.", status: "done", icon: <Clock size={18} /> },
    ]
  },
  {
    phase: "Fázis 2",
    title: "Esport & Napi Interakciók",
    color: "var(--color-val-red)",
    milestones: [
      { title: "Pro Scene Tracker", description: "Legújabb meccsek, visszaszámláló a következő VCT eseményig, esport statok.", status: "done", icon: <Flag size={18} /> },
      { title: "Napirend", description: "Napi szavazások eltárolással, naponta változó Valorant tippek és meta elemzések.", status: "done", icon: <CheckCircle2 size={18} /> },
      { title: "Henrik API Bekötés", description: "Valós idejű játékos statisztikák és Valorant Act-onkénti kompetitív infók kliens oldalon.", status: "done", icon: <Server size={18} /> },
    ]
  },
  {
    phase: "Fázis 3",
    title: "Közösségi UX & Integrációk",
    color: "var(--color-esport-teal)",
    milestones: [
      { title: "Interaktív Térképek", description: "Kattintható, vizuális canvas alapú line-up és taktikák bemutató pálya nézet.", status: "done", icon: <Rocket size={18} /> },
      { title: "Ágens Tier List", description: "Felhasználó által elkészíthető, dnd-kit alapú drag-and-drop Meta analizáló dashboard.", status: "done", icon: <Rocket size={18} /> },
      { title: "Gamification / RPG Rendszer", description: "Regisztrált játékos profil, XP gyűjtés, szintlépés (Progress Bar) és megnyitható kitűzők.", status: "done", icon: <Flag size={18} /> },
      { title: "Newsletter Modul", description: "Személyre szabott e-mail feliratkoztatás, csapatonkénti bontással.", status: "done", icon: <CheckCircle2 size={18} /> },
    ]
  },
  {
    phase: "Fázis 4",
    title: "Közösségi Bővítés",
    color: "var(--color-esport-teal)",
    milestones: [
      { title: "Match History Vizualizáció", description: "A statisztika aloldal grafikonos bővítése interaktív Recharts diagramokkal.", status: "done", icon: <Server size={18} /> },
      { title: "Esports Fantasy Pick'em", description: "VCT meccs jóslatok, felhasználói XP gyűjtéssel és gamification integrációval.", status: "done", icon: <CheckCircle2 size={18} /> },
      { title: "Keresek Csapatot (LFG)", description: "Valós idejű Valorant csapattárs-kereső fórum optimista UI-jal.", status: "done", icon: <Rocket size={18} /> },
      { title: "Discord Webhook", description: "Automatikus formázott üzenetküldés a Discord közösségi szerveren cikkpublikáláskor.", status: "done", icon: <ShieldCheck size={18} /> },
      { title: "UX & SEO Audit", description: "A rendszer teljes körű felülvizsgálata, frontend teljesítmény optimalizálása és keresőoptimalizálás Meta címkékkel.", status: "done", icon: <CheckCircle2 size={18} /> },
    ]
  },
  {
    phase: "Fázis 5",
    title: "Gamification & Interakciók",
    color: "var(--color-esport-teal)",
    milestones: [
      { title: "Napi Kvíz (Trivia)", description: "Napi kvíz rendszer adatbázis és UI logikával, válaszotok ellenőrzésével és XP jutalmazással.", status: "done", icon: <CheckCircle2 size={18} /> },
      { title: "Automatizált Jelvények", description: "Server action logika a felhasználói mérföldkövek és Badge-ek kiosztására dinamikusan.", status: "done", icon: <CheckCircle2 size={18} /> },
      { title: "Kiterjesztett Profil", description: "Részletes profil statisztikákkal (kommentek, kvízek, jóslatok összesítése).", status: "done", icon: <CheckCircle2 size={18} /> },
    ]
  },
  {
    phase: "Fázis 6",
    title: "Animációk & Globális UI",
    color: "var(--color-val-red)",
    milestones: [
      { title: "Értesítés Rendszer (Bell)", description: "Valós idejű dropdown SWR-el pollingolva jelezve az új kitűzőket.", status: "done", icon: <CheckCircle2 size={18} /> },
      { title: "Hírek Ticker UI", description: "CSS végtelenül pörgő szalag a legfrissebb befejezett e-sport meccseredményekkel.", status: "done", icon: <CheckCircle2 size={18} /> },
      { title: "Particles Background", description: "HTML5 Canvas generált interaktív részecske háló a hősnél.", status: "done", icon: <CheckCircle2 size={18} /> },
    ]
  },
  {
    phase: "Fázis 7",
    title: "Admin Dashboard CRUD",
    color: "var(--color-patch-gold)",
    milestones: [
      { title: "Haladó Rekord Analitika", description: "Recharts vonal- és oszlopdiagramok aggregálva a heti regisztrációkkal és kategóriákkal.", status: "done", icon: <Rocket size={18} /> },
      { title: "Felhasználó Moderáció", description: "Regisztráltak CMS listázása interaktív XP módosító inputokkal és kitiltás (Ban) kapcsolóval.", status: "done", icon: <ShieldCheck size={18} /> },
      { title: "Interaktív Tartalom CMS", description: "Dinamikus JSON tree építő Kvíz-kérdés felülethez és Pick'em meccs lezáró form.", status: "done", icon: <CheckCircle2 size={18} /> },
      { title: "Metaadat Kezelő", description: "Kategóriák vizuális színkódokkal ellátott interaktív táblája, beépített slug-generátorral.", status: "done", icon: <Server size={18} /> },
    ]
  }
];

export default function ProjectBoardPage() {
  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", paddingBottom: "4rem" }}>
      <header style={{ marginBottom: "3rem" }}>
        <h1 style={{ 
          fontFamily: "var(--font-display)", 
          fontWeight: 900, 
          fontSize: "2.5rem", 
          textTransform: "uppercase", 
          letterSpacing: "0.02em", 
          margin: "0 0 0.5rem 0",
          color: "var(--color-site-white)"
        }}>
          GamerHírek <span style={{ color: "var(--color-val-red)" }}>Fejlesztési Terv</span>
        </h1>
        <p style={{ color: "var(--color-site-muted)", margin: 0 }}>
          Nyomon követheted az aktuálisan lefejlesztett vizuális és technikai funkciókat az első fázistól a mai napig.
        </p>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
        {phases.map((phaseData, i) => (
          <div key={i} style={{ 
            background: "rgba(15,25,35,0.4)", 
            border: "1px solid var(--color-site-border)", 
            borderLeft: `3px solid ${phaseData.color}`,
            borderRadius: "12px", 
            padding: "2rem",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "150px", height: "150px", background: `radial-gradient(circle, ${phaseData.color} 0%, transparent 70%)`, opacity: 0.1 }} />
            
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem" }}>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: "0.5rem 1rem", borderRadius: "100px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: phaseData.color }}>
                {phaseData.phase}
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.5rem", margin: 0, textTransform: "uppercase" }}>
                {phaseData.title}
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {phaseData.milestones.map((ms, j) => (
                <div key={j} style={{
                  background: "rgba(0,0,0,0.2)",
                  border: "1px solid var(--color-site-border)",
                  borderRadius: "8px",
                  padding: "1.5rem",
                  display: "flex",
                  gap: "1rem",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "default"
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 30px -10px rgba(0,0,0,0.5)"; e.currentTarget.style.borderColor = "var(--color-site-muted)"; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "var(--color-site-border)"; }}
                >
                  <div style={{ 
                    color: ms.status === "done" ? "var(--color-esport-teal)" : ms.status === "in-progress" ? "var(--color-val-red)" : "var(--color-site-muted)",
                    marginTop: "0.25rem"
                  }}>
                    {ms.status === "done" ? <CheckCircle2 size={24} /> : ms.status === "in-progress" ? <Clock size={24} /> : <Circle size={24} strokeDasharray="4 4" />}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", margin: "0 0 0.5rem 0", color: "var(--color-site-white)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {ms.title}
                    </h3>
                    <p style={{ color: "var(--color-site-muted)", fontSize: "0.875rem", margin: 0, lineHeight: 1.5 }}>
                      {ms.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: "4rem", textAlign: "center", padding: "3rem", border: "1px dashed var(--color-site-border)", borderRadius: "12px", background: "rgba(255,255,255,0.02)" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.25rem", margin: "0 0 1rem 0", textTransform: "uppercase" }}>Jövőbeli Vízió</h3>
        <p style={{ color: "var(--color-site-muted)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
          A GamerHírek projekt a kezdeti admin portál elképzelésből egy komplex, közösségi és interaktív gamer portállá nőtte ki magát. A következő lépés éles környezetben (Production) validálni a fejlesztéseket.
        </p>
      </div>
    </div>
  );
}
