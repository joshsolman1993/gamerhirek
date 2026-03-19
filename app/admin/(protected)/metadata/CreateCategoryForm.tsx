"use client";

import { useState } from "react";
import { createCategory } from "@/actions/admin";

export function CreateCategoryForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [color, setColor] = useState("#00C4B4");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await createCategory({
      name,
      slug,
      color
    });
    setLoading(false);
    setOpen(false);
    setName("");
    setSlug("");
    setColor("#00C4B4");
  };

  const generateSlug = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
  };

  if (!open) {
    return (
      <button className="admin-btn-primary" onClick={() => setOpen(true)}>
        + Új Kategória Setup
      </button>
    );
  }

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.8)",
      zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "var(--color-site-card)",
        border: "1px solid var(--color-esport-teal)",
        padding: "2rem",
        borderRadius: "8px",
        width: "90%",
        maxWidth: "400px",
      }}>
        <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-site-white)", marginTop: 0, textTransform: "uppercase" }}>Kategória Konfiguráció</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          <input required placeholder="Kategória Név (pl. VALORANT Hírek)" value={name} onChange={(e) => generateSlug(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", background: "var(--color-site-bg)", border: "1px solid var(--color-site-border)", color: "white" }} />

          <input required placeholder="Rendszer Slug (generált)" value={slug} onChange={(e) => setSlug(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", background: "var(--color-site-bg)", border: "1px dashed var(--color-site-border)", color: "var(--color-site-muted)" }} />

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <label style={{ color: "var(--color-site-muted)", fontSize: "0.85rem", fontWeight: 700 }}>Márka Szín:</label>
            <input required type="color" value={color} onChange={(e) => setColor(e.target.value)}
              style={{ width: "100%", padding: "0", background: "var(--color-site-bg)", border: "none" }} />
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button type="submit" disabled={loading} className="admin-btn-primary" style={{ flex: 1, textAlign: "center", opacity: loading ? 0.5 : 1 }}>Létrehozás</button>
            <button type="button" disabled={loading} onClick={() => setOpen(false)} className="admin-btn-secondary" style={{ padding: "0 2rem" }}>Mégse</button>
          </div>
        </form>
      </div>
    </div>
  );
}
