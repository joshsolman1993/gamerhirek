export function Footer() {
  return (
    <footer
      style={{
        background: "var(--color-site-dark)",
        borderTop: "1px solid var(--color-site-border)",
        marginTop: "5rem",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "3rem 1.5rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "2rem",
        }}
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.5rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            Gamer<span style={{ color: "var(--color-val-red)" }}>Hírek</span>
          </div>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-site-muted)",
              lineHeight: 1.6,
              maxWidth: "240px",
            }}
          >
            Magyar nyelvű gaming hírek versenyjátékosoknak. Valorant patch notes, esport eredmények és tippek.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.875rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-val-red)",
              marginBottom: "1rem",
            }}
          >
            Kategóriák
          </h4>
          {["Patch Notes", "Hírek", "Esport", "Tippek & Útmutatók"].map((cat) => (
            <div key={cat} style={{ marginBottom: "0.5rem" }}>
              <a
                href="#"
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-site-muted)",
                  transition: "color 0.2s ease",
                }}
              >
                {cat}
              </a>
            </div>
          ))}
        </div>

        {/* Info */}
        <div>
          <h4
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.875rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-val-red)",
              marginBottom: "1rem",
            }}
          >
            Kapcsolat
          </h4>
          <p style={{ fontSize: "0.875rem", color: "var(--color-site-muted)" }}>
            info@gamerhirek.hu
          </p>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid var(--color-site-border)",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "1.25rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ fontSize: "0.75rem", color: "var(--color-site-muted)" }}>
          © 2026 GamerHírek. Minden jog fenntartva.
        </p>
        <p style={{ fontSize: "0.75rem", color: "var(--color-site-muted)" }}>
          A Valorant a Riot Games védjegye.
        </p>
      </div>
    </footer>
  );
}
