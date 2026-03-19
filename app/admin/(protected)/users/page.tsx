import { db } from "@/lib/db";
import { UserActions } from "./UserActions";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          articles: true,
          comments: true,
          globalChats: true,
          predictions: true,
          quizAttempts: true,
        },
      },
    },
  });

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
        Felhasználók
      </h1>
      <p style={{ color: "var(--color-site-muted)", marginBottom: "2rem" }}>
        Menedzseld a regisztrált tagok szintjét, XP-jét vagy korlátozd a hozzáférésüket.
      </p>

      <div style={{ background: "var(--color-site-card)", border: "1px solid var(--color-site-border)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-site-border)" }}>
              {["Tag", "Szint", "XP", "Aktivitás", "Regisztrált", "Állapot"].map((h) => (
                <th
                  key={h}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-site-muted)",
                    padding: "0.75rem 1rem",
                    textAlign: "left",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <td style={{ padding: "1rem", color: "var(--color-site-white)", fontWeight: 600 }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>{user.name}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-site-muted)" }}>{user.email}</span>
                  </div>
                </td>
                <td style={{ padding: "1rem", color: "var(--color-esport-teal)", fontWeight: 700 }}>
                  Szint {user.level}
                </td>
                <td style={{ padding: "1rem", color: "var(--color-site-muted)" }}>
                  {user.xp} XP
                </td>
                <td style={{ padding: "1rem", fontSize: "0.8rem", color: "var(--color-site-muted)" }}>
                  📝 {user._count.comments} | 🗣️ {user._count.globalChats} | 🎯 {user._count.predictions}
                </td>
                <td style={{ padding: "1rem", fontSize: "0.85rem", color: "var(--color-site-muted)" }}>
                  {formatDate(user.createdAt)}
                </td>
                <td style={{ padding: "1rem" }}>
                  <UserActions userId={user.id} currentXp={user.xp} role={user.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
