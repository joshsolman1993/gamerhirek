"use client";

import { useState } from "react";
import { joinGuild } from "@/actions/social";
import { Loader2, UserPlus, UserMinus } from "lucide-react";
import { useRouter } from "next/navigation";

export function JoinGuildButton({ guildId, isMember, isAuthenticated }: { guildId: string, isMember: boolean, isAuthenticated: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!isAuthenticated) {
      router.push("/admin/login?next=/guilds/" + guildId);
      return;
    }

    setLoading(true);
    const res = await joinGuild(guildId);
    setLoading(false);

    if (res.error) {
      alert(res.error);
    }
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={loading}
      className={`admin-btn-${isMember ? 'secondary' : 'primary'}`}
      style={{
        display: "flex", alignItems: "center", gap: "0.5rem",
        opacity: loading ? 0.7 : 1,
        transition: "all 0.2s ease"
      }}
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : isMember ? <UserMinus size={18} /> : <UserPlus size={18} />}
      {isMember ? "Kilépés a Klánból" : "Csatlakozás a Klánhoz"}
    </button>
  );
}
