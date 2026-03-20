"use client";

import { useState, useTransition } from "react";
import { buyShopItem } from "@/actions/economy";

type ShopItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  type: string;
  imageUrl: string | null;
};

type Props = {
  item: ShopItem;
  userGamerCoins: number;
  hasPurchased: boolean;
};

export function ShopItemCard({ item, userGamerCoins, hasPurchased }: Props) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);

  const canAfford = userGamerCoins >= item.price;

  function handleBuy() {
    if (!canAfford || hasPurchased) return;

    startTransition(async () => {
      const result = await buyShopItem(item.id);
      if ("error" in result && result.error) {
        setMessage({ text: String(result.error), type: "error" });
      } else {
        setMessage({ text: "Sikeres vásárlás!", type: "success" });
      }
    });
  }

  return (
    <div style={{
      background: "var(--color-site-card)",
      border: "1px solid var(--color-site-border)",
      borderRadius: "8px",
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "1rem"
    }}>
      <div style={{ fontSize: "3rem", textAlign: "center", textShadow: "0 0 20px rgba(0,255,127,0.2)" }}>
        {item.imageUrl || "🎁"}
      </div>
      
      <div>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", margin: "0 0 0.5rem 0", color: "var(--color-site-white)" }}>
          {item.name}
        </h3>
        {item.description && (
          <p style={{ color: "var(--color-site-muted)", fontSize: "0.875rem", margin: 0 }}>
            {item.description}
          </p>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <span style={{ fontWeight: 700, color: "#00FF7F", display: "flex", alignItems: "center", gap: "0.25rem" }}>
          🪙 {item.price} GC
        </span>
        
        {hasPurchased ? (
          <span style={{ color: "var(--color-site-muted)", fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase" }}>Megvásárolva</span>
        ) : (
          <button
            onClick={handleBuy}
            disabled={!canAfford || isPending || hasPurchased}
            style={{
              background: canAfford ? "var(--color-esport-teal)" : "rgba(255,255,255,0.05)",
              color: canAfford ? "#000" : "var(--color-site-muted)",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              textTransform: "uppercase",
              fontSize: "0.875rem",
              cursor: (!canAfford || isPending) ? "not-allowed" : "pointer"
            }}
          >
            {isPending ? "Vásárlás..." : "Vásárlás"}
          </button>
        )}
      </div>

      {message && (
        <div style={{ padding: "0.5rem", background: message.type === "error" ? "rgba(255, 70, 85, 0.1)" : "rgba(0, 255, 127, 0.1)", color: message.type === "error" ? "var(--color-val-red)" : "#00FF7F", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, textAlign: "center" }}>
          {message.text}
        </div>
      )}
    </div>
  );
}
