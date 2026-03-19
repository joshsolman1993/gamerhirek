import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ChatInput } from "./ChatInput";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ userId: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const user = await db.user.findUnique({ where: { id: resolvedParams.userId } });
  if (!user) return { title: "Nem található" };
  return { title: `Chat: ${user.name} | GamerHírek` };
}

export default async function DirectMessagePage({ params }: { params: Promise<{ userId: string }> }) {
  const resolvedParams = await params;
  const session = await getSession();
  
  if (!session?.id) {
    redirect("/admin/login?next=/chat/" + resolvedParams.userId);
  }

  const targetUser = await db.user.findUnique({
    where: { id: resolvedParams.userId },
  });

  if (!targetUser) {
    return notFound();
  }

  // Fetch messages between these two users
  const messages = await db.directMessage.findMany({
    where: {
      OR: [
        { senderId: session.id, receiverId: targetUser.id },
        { senderId: targetUser.id, receiverId: session.id },
      ]
    },
    orderBy: { createdAt: "asc" },
  });

  // Mark all unread messages sent BY the target user TO the session user as read
  await db.directMessage.updateMany({
    where: {
      senderId: targetUser.id,
      receiverId: session.id,
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1.5rem", height: "calc(100vh - 80px)", display: "flex", flexDirection: "column" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "1rem", borderBottom: "1px solid var(--color-site-border)", paddingBottom: "1rem", marginBottom: "1rem" }}>
        <Link href={`/profil/${targetUser.id}`} style={{ color: "var(--color-site-muted)", display: "flex", alignItems: "center" }}>
          <ArrowLeft size={20} />
        </Link>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", border: "2px solid var(--color-site-border)" }}>
          {targetUser.avatarUrl ? (
            <Image src={targetUser.avatarUrl} alt={targetUser.name} width={40} height={40} style={{ objectFit: "cover" }} />
          ) : (
            <Image src="https://media.valorant-api.com/playercards/9fb348bc-41a0-91ad-8a3e-b18035c4e661/displayicon.png" alt="Avatar" width={40} height={40} style={{ objectFit: "cover" }} />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", margin: 0, color: "var(--color-site-white)", textTransform: "uppercase" }}>
            {targetUser.name}
          </h1>
          <div style={{ fontSize: "0.75rem", color: "var(--color-esport-teal)", fontWeight: 700 }}>Privát Üzenet</div>
        </div>
      </header>

      <div style={{ flex: 1, overflowY: "auto", paddingRight: "0.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {messages.length === 0 ? (
          <div style={{ margin: "auto", color: "var(--color-site-muted)", fontSize: "0.875rem", textAlign: "center" }}>
            Nincsenek üzenetek. Kezdj el beszélgetni!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === session.id;
            return (
              <div key={msg.id} style={{
                alignSelf: isMe ? "flex-end" : "flex-start",
                maxWidth: "75%",
                background: isMe ? "var(--color-esport-teal)" : "var(--color-site-card)",
                color: isMe ? "#000" : "var(--color-site-white)",
                padding: "0.75rem 1rem",
                borderRadius: isMe ? "12px 12px 0 12px" : "12px 12px 12px 0",
                border: isMe ? "none" : "1px solid var(--color-site-border)",
                fontWeight: isMe ? 500 : 400,
                position: "relative"
              }}>
                <div style={{ marginBottom: "0.25rem", wordBreak: "break-word", lineHeight: 1.4 }}>{msg.content}</div>
                <div style={{ fontSize: "0.65rem", opacity: 0.7, textAlign: "right" }}>
                  {msg.createdAt.toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })}
                  {isMe && msg.readAt && <span style={{ marginLeft: "0.5rem" }}>✓✓</span>}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <ChatInput receiverId={targetUser.id} />
      </div>
    </div>
  );
}
