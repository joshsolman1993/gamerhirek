import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "8rem",
          color: "var(--color-val-red)",
          lineHeight: 1,
          opacity: 0.3,
          marginBottom: "1rem",
        }}
      >
        404
      </div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "2rem",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          marginBottom: "0.75rem",
        }}
      >
        Az oldal nem található
      </h1>
      <p style={{ color: "var(--color-site-muted)", marginBottom: "2rem" }}>
        Ez a cikk vagy oldal nem létezik, vagy törölték.
      </p>
      <Link
        href="/"
        style={{
          background: "var(--color-val-red)",
          color: "white",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "0.9375rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: "0.75rem 1.5rem",
        }}
      >
        ← Vissza a főoldalra
      </Link>
    </div>
  );
}
