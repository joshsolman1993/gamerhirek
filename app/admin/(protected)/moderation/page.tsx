import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { ModerationActions } from "./ModerationActions";

export const dynamic = "force-dynamic";

export default async function AdminModerationPage() {
  const [chats, comments] = await Promise.all([
    db.globalChat.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { user: { select: { name: true, email: true } } },
    }),
    db.comment.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  return (
    <div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "1.75rem",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          marginBottom: "0.25rem",
        }}
      >
        Moderáció
      </h1>
      <p style={{ color: "var(--color-site-muted)", marginBottom: "2rem" }}>
        Kezeld a Kocsma üzeneteket és Cikk hozzászólásokat. Minden bejegyzés azonnal élesedik jóváhagyás nélkül, itt csak utólagos törlésre van lehetőség.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Global Chats */}
        <div style={{ background: "var(--color-site-card)", border: "1px solid var(--color-site-border)", borderRadius: "4px", padding: "1.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", marginBottom: "1rem", color: "var(--color-site-white)" }}>
            Friss Kocsma Üzenetek
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {chats.map(chat => (
              <div key={chat.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-esport-teal)" }}>{chat.user.name} <span style={{ color: "var(--color-site-muted)", fontWeight: 400 }}>({chat.user.email})</span></div>
                  <div style={{ fontSize: "0.9rem", color: "var(--color-site-white)", marginTop: "0.25rem" }}>{chat.content}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-site-muted)", marginTop: "0.25rem" }}>{formatDate(chat.createdAt)}</div>
                </div>
                <ModerationActions id={chat.id} type="CHAT" />
              </div>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div style={{ background: "var(--color-site-card)", border: "1px solid var(--color-site-border)", borderRadius: "4px", padding: "1.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", marginBottom: "1rem", color: "var(--color-site-white)" }}>
            Friss Kommentek
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {comments.map(c => (
              <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-val-red)" }}>{c.authorName} <span style={{ color: "var(--color-site-muted)", fontWeight: 400 }}>({c.authorEmail || "Vendég"})</span></div>
                  <div style={{ fontSize: "0.9rem", color: "var(--color-site-white)", marginTop: "0.25rem" }}>{c.content}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-site-muted)", marginTop: "0.25rem" }}>{formatDate(c.createdAt)}</div>
                </div>
                <ModerationActions id={c.id} type="COMMENT" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
