"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: { name: string; color: string; slug: string };
  coverImage: string;
}

export function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    if (!open) { setQuery(""); setResults([]); }
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 2) { setResults([]); setLoading(false); return; }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.articles ?? []);
      setLoading(false);
    }, 300);
  }, [query]);

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Keresés"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "rgba(42,58,74,0.6)",
          border: "1px solid var(--color-site-border)",
          color: "var(--color-site-muted)",
          padding: "0.375rem 0.875rem",
          cursor: "pointer",
          fontFamily: "var(--font-body)",
          fontSize: "0.8125rem",
          transition: "all 0.2s ease",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <span className="search-hint-text">Keresés</span>
        <kbd style={{
          fontSize: "0.6875rem",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid var(--color-site-border)",
          padding: "0.1rem 0.35rem",
          borderRadius: "3px",
          lineHeight: 1,
        }}>Ctrl K</kbd>
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,25,35,0.85)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "10vh",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(640px, 92vw)",
              background: "var(--color-site-dark)",
              border: "1px solid var(--color-site-border)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,70,85,0.1)",
            }}
          >
            {/* Input */}
            <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid var(--color-site-border)", padding: "0 1rem" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-val-red)" strokeWidth="2" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Keress cikkeket, patch notes-t..."
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--color-site-white)",
                  fontFamily: "var(--font-body)",
                  fontSize: "1.0625rem",
                  padding: "1rem 0.875rem",
                }}
              />
              {loading && (
                <div style={{
                  width: "16px", height: "16px",
                  border: "2px solid var(--color-site-border)",
                  borderTopColor: "var(--color-val-red)",
                  borderRadius: "50%",
                  animation: "spin 0.6s linear infinite",
                }} />
              )}
            </div>

            {/* Results */}
            <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
              {results.length > 0 ? results.map((r) => (
                <Link
                  key={r.id}
                  href={`/hirek/${r.slug}`}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex",
                    gap: "0.875rem",
                    padding: "0.875rem 1.25rem",
                    borderBottom: "1px solid rgba(42,58,74,0.5)",
                    transition: "background 0.15s ease",
                  }}
                  className="search-result-item"
                >
                  <div style={{
                    width: "56px", height: "40px", flexShrink: 0,
                    background: `url(${r.coverImage}) center/cover`,
                    border: "1px solid var(--color-site-border)",
                  }} />
                  <div>
                    <span
                      className="cat-badge"
                      style={{ color: r.category.color, fontSize: "0.6rem", marginBottom: "0.25rem", display: "block" }}
                    >
                      {r.category.name}
                    </span>
                    <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.9375rem", margin: 0, lineHeight: 1.3 }}>
                      {r.title}
                    </p>
                  </div>
                </Link>
              )) : query.length >= 2 && !loading ? (
                <p style={{ padding: "2rem 1.25rem", color: "var(--color-site-muted)", textAlign: "center", fontFamily: "var(--font-display)" }}>
                  Nincs találat: „{query}&quot;
                </p>
              ) : (
                <p style={{ padding: "1.5rem 1.25rem", color: "var(--color-site-muted)", fontSize: "0.8125rem", textAlign: "center" }}>
                  Írj be legalább 2 karaktert a kereséshez
                </p>
              )}
            </div>

            {/* Footer */}
            <div style={{
              display: "flex", gap: "1rem", padding: "0.625rem 1.25rem",
              borderTop: "1px solid var(--color-site-border)",
              fontSize: "0.75rem", color: "var(--color-site-muted)",
            }}>
              <span><kbd style={{ background: "rgba(255,255,255,0.06)", padding: "0.1rem 0.3rem", borderRadius: "2px", border: "1px solid var(--color-site-border)" }}>↵</kbd> megnyitás</span>
              <span><kbd style={{ background: "rgba(255,255,255,0.06)", padding: "0.1rem 0.3rem", borderRadius: "2px", border: "1px solid var(--color-site-border)" }}>Esc</kbd> bezárás</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
