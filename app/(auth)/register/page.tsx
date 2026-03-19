"use client";

import { useActionState, Suspense } from "react";
import { userRegisterAction } from "@/actions/user-auth";
import { UserPlus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function RegisterForm() {
  const [state, formAction, isPending] = useActionState(userRegisterAction, null);
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem" }}>
      <div style={{ width: "100%", maxWidth: "450px", background: "var(--color-site-card)", border: "1px solid var(--color-site-border)", borderTop: "3px solid var(--color-esport-teal)", padding: "3rem 2rem", borderRadius: "12px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}>
        
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2.5rem", textAlign: "center" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(0, 196, 180, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-esport-teal)", marginBottom: "1rem" }}>
            <UserPlus size={32} />
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "2rem", textTransform: "uppercase", margin: "0 0 0.5rem 0", letterSpacing: "0.02em" }}>
            Légy a Csapat Tagja
          </h1>
          <p style={{ color: "var(--color-site-muted)", margin: 0, fontSize: "0.9375rem" }}>
            A GamerHírek regisztrált felhasználójaként XP-t gyűjthetsz, szinteket és kitűzőket szerezhetsz a napi interakciókkal.
          </p>
        </div>

        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {state?.error && (
            <div style={{ background: "rgba(255, 70, 85, 0.1)", border: "1px solid var(--color-val-red)", color: "var(--color-val-red)", padding: "1rem", borderRadius: "4px", fontSize: "0.875rem", fontFamily: "var(--font-display)", fontWeight: 600, textAlign: "center" }}>
              {state.error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label htmlFor="name" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-site-muted)" }}>
              Felhasználónév (Bungie/Riot ID)*
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Pl.: JettMain#EUNE"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--color-site-border)", color: "#fff", padding: "0.875rem 1rem", borderRadius: "4px", fontSize: "1rem", transition: "border-color 0.2s ease" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label htmlFor="email" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-site-muted)" }}>
              E-mail Címed *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="pelda@gamer.hu"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--color-site-border)", color: "#fff", padding: "0.875rem 1rem", borderRadius: "4px", fontSize: "1rem", transition: "border-color 0.2s ease" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label htmlFor="password" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-site-muted)" }}>
              Jelszó * (min. 6 karakter)
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--color-site-border)", color: "#fff", padding: "0.875rem 1rem", borderRadius: "4px", fontSize: "1rem", transition: "border-color 0.2s ease" }}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="admin-btn-primary"
            style={{ 
              marginTop: "1rem",
              background: "var(--color-esport-teal)", 
              color: "#000", 
              border: "none", 
              padding: "1rem",
              opacity: isPending ? 0.7 : 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontSize: "1rem"
            }}
          >
            {isPending ? "Regisztráció folyik..." : "Készíts Fiókot"} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center", borderTop: "1px solid var(--color-site-border)", paddingTop: "1.5rem" }}>
          <p style={{ color: "var(--color-site-muted)", fontSize: "0.875rem", margin: 0 }}>
            Már van profilod?{" "}
            <Link href={`/login${nextParam ? `?next=${nextParam}` : ""}`} style={{ color: "var(--color-esport-teal)", fontWeight: 700, textDecoration: "none" }}>
              Lépj be!
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem" }}><div style={{ width: "100%", maxWidth: "450px", background: "var(--color-site-card)", border: "1px solid var(--color-site-border)", borderTop: "3px solid var(--color-esport-teal)", padding: "3rem 2rem", borderRadius: "12px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", color: "var(--color-site-muted)", textAlign: "center", fontFamily: "var(--font-display)" }}>Betöltés...</div></div>}>
      <RegisterForm />
    </Suspense>
  );
}
