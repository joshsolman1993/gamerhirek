"use client";

import { useState, useTransition } from "react";
import { loginAction } from "@/actions/auth";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-site-black)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Logo */}
        <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "2rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "var(--color-site-white)",
              marginBottom: "0.5rem",
            }}
          >
            Gamer<span style={{ color: "var(--color-val-red)" }}>Hírek</span>
          </div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.875rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-site-muted)",
            }}
          >
            Admin Panel
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "var(--color-site-card)",
            border: "1px solid var(--color-site-border)",
            padding: "2rem",
          }}
        >
          {/* Red top line */}
          <div
            style={{
              height: "3px",
              background: "var(--color-val-red)",
              margin: "-2rem -2rem 1.75rem",
            }}
          />

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.375rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            Bejelentkezés
          </h1>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-site-muted)",
                  marginBottom: "0.5rem",
                }}
              >
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="admin-input"
                placeholder="admin@gamerhirek.hu"
                defaultValue="admin@gamerhirek.hu"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-site-muted)",
                  marginBottom: "0.5rem",
                }}
              >
                Jelszó
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="admin-input"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div
                style={{
                  background: "rgba(255, 70, 85, 0.1)",
                  border: "1px solid rgba(255, 70, 85, 0.4)",
                  padding: "0.625rem 0.875rem",
                  fontSize: "0.875rem",
                  color: "var(--color-val-red)",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="admin-btn-primary"
              style={{ marginTop: "0.5rem", opacity: isPending ? 0.7 : 1, cursor: isPending ? "not-allowed" : "pointer" }}
            >
              {isPending ? "Bejelentkezés..." : "Belépés"}
            </button>
          </form>

          <p style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "var(--color-site-muted)", textAlign: "center" }}>
            Demo: admin@gamerhirek.hu / Admin123!
          </p>
        </div>
      </div>
    </div>
  );
}
