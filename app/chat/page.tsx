import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { LiveChat } from "./LiveChat";
import { MessageSquare } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Globál Kocsma | GamerHírek",
  description: "Beszélgess élőben a többi Valorant játékossal a Globál Kocsmában!",
};

export default async function ChatPage() {
  const session = await getSession();

  // Fetch full user data including level if logged in
  let currentUser = null;
  if (session) {
    const user = await db.user.findUnique({
      where: { id: session.id },
      select: { id: true, name: true, avatarUrl: true, role: true, level: true },
    });
    if (user) {
      currentUser = {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role,
        level: user.level,
      };
    }
  }

  return (
    <div style={{ margin: "0 auto", padding: "3rem 1.5rem" }} className="w-full max-w-5xl">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ background: "rgba(0,196,180,0.1)", padding: "1rem", borderRadius: "12px", border: "1px solid var(--color-esport-teal)" }}>
          <MessageSquare size={32} style={{ color: "var(--color-esport-teal)" }} />
        </div>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "2.5rem", textTransform: "uppercase", margin: 0, lineHeight: 1.1 }}>
            Globál <span style={{ color: "var(--color-esport-teal)" }}>Kocsma</span>
          </h1>
          <p style={{ color: "var(--color-site-muted)", margin: "0.5rem 0 0 0", fontSize: "1rem", lineHeight: 1.5 }}>
            Pihenj meg két ranked meccs között és oszd meg a tapasztalataidat a többiekkel valós időben!
          </p>
        </div>
      </div>

      <LiveChat currentUser={currentUser} />
    </div>
  );
}
