"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Trophy, Newspaper, Wrench, Gamepad2, Target, Users, 
  ShieldCheck, UserPlus, MessagesSquare, Lightbulb, BarChart2, 
  List, Map, Menu, X, BrainCircuit 
} from "lucide-react";

const links = [
  { section: "Hírek & Esport" },
  { href: "/kategoria/hirek", label: "Általános Hírek", icon: <Newspaper size={18} /> },
  { href: "/kategoria/esport", label: "Esportok", icon: <Trophy size={18} /> },
  { href: "/patch-notes", label: "Patch Notes", icon: <Wrench size={18} /> },
  { href: "/pro-scene", label: "Pro Scene Tracker", icon: <Gamepad2 size={18} /> },
  { href: "/pro-scene/pickem", label: "VCT Pick'em", icon: <Target size={18} /> },
  
  { section: "Közösségi Élet" },
  { href: "/kozosseg", label: "Közösségi Hub", icon: <Users size={18} /> },
  { href: "/guilds", label: "Klán Listák", icon: <ShieldCheck size={18} /> },
  { href: "/lfg", label: "Csapatkereső (LFG)", icon: <UserPlus size={18} /> },
  { href: "/chat", label: "Kocsma Csevegés", icon: <MessagesSquare size={18} /> },
  { href: "/trivia", label: "Napi Trivia", icon: <BrainCircuit size={18} /> },

  { section: "Adatbázis" },
  { href: "/stats", label: "Statisztikák", icon: <BarChart2 size={18} /> },
  { href: "/tier-list", label: "Ügynök Tier List", icon: <List size={18} /> },
  { href: "/terkep-guides", label: "Térkép Taktikák", icon: <Map size={18} /> },
  { href: "/kategoria/tippek-utmutatek", label: "Tippek & Útmutatók", icon: <Lightbulb size={18} /> },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Close sidebar on mobile when route changes
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Kinyitógomb Mobilon */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setIsOpen(true)}
        style={{
          display: "none", // Ezt CSS-ből fogjuk vezérelni
          position: "fixed",
          top: "16px",
          left: "16px",
          background: "var(--color-site-card)",
          border: "1px solid var(--color-site-border)",
          color: "white",
          padding: "8px",
          borderRadius: "8px",
          zIndex: 900
        }}
      >
        <Menu size={24} />
      </button>

      {/* Mobilos Sötétítő (Backdrop) */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="sidebar-backdrop"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            zIndex: 990,
          }}
        />
      )}

      {/* A Sidebar maga */}
      <aside 
        className={`sidebar-container ${isOpen ? 'open' : ''}`}
        style={{
          width: "280px",
          height: "100vh",
          position: "sticky",
          top: 0,
          background: "var(--color-site-dark)",
          borderRight: "1px solid var(--color-site-border)",
          display: "flex",
          flexDirection: "column",
          zIndex: 999,
          overflowY: "auto",
        }}
      >
        {/* LOGÓ Tér */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--color-site-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "1.25rem",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}>
              <div style={{
                width: "24px", height: "24px",
                background: "var(--color-val-red)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.75rem", fontWeight: 900, color: "white",
                clipPath: "polygon(0 0, 100% 0, 100% 75%, 75% 100%, 0 100%)",
              }}>G</div>
              Gamer<span style={{ color: "var(--color-val-red)" }}>Hírek</span>
            </div>
          </Link>
          
          <button 
            className="mobile-close-btn"
            onClick={() => setIsOpen(false)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--color-site-muted)",
              cursor: "pointer",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Linkek hálózata */}
        <div style={{ padding: "1.5rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {links.map((item, i) => {
            if ("section" in item) {
              return (
                <div key={i} style={{ 
                  marginTop: i === 0 ? "0" : "1.5rem",
                  marginBottom: "0.5rem",
                  paddingLeft: "0.5rem",
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "0.6875rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "var(--color-site-muted)"
                }}>
                  {item.section}
                </div>
              );
            }

            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link 
                key={item.href} 
                href={item.href!}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: isActive ? "var(--color-site-bg)" : "var(--color-site-white)",
                  background: isActive ? "var(--color-esport-teal)" : "transparent",
                  transition: "all 0.2s ease"
                }}
                className={isActive ? "" : "sidebar-link-hover"}
              >
                <div style={{ color: isActive ? "var(--color-site-bg)" : "var(--color-site-muted)", display: "flex", alignItems: "center" }}>
                  {item.icon}
                </div>
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Copyright */}
        <div style={{ marginTop: "auto", padding: "1.5rem", borderTop: "1px solid var(--color-site-border)", fontSize: "0.75rem", color: "var(--color-site-muted)", textAlign: "center" }}>
          GamerHírek &copy; 2026<br/>
          Minden jog fenntartva.
        </div>
      </aside>

      <style jsx global>{`
        .sidebar-link-hover:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          transform: translateX(4px);
        }
        
        .mobile-close-btn { display: none !important; }

        @media screen and (max-width: 1024px) {
          .mobile-menu-btn { display: block !important; }
          .mobile-close-btn { display: block !important; }
          .sidebar-container {
            position: fixed !important;
            top: 0;
            left: 0;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 10px 0 30px rgba(0,0,0,0.5);
          }
          .sidebar-container.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
