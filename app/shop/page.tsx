import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Coins, ShoppingBag, ShieldAlert } from "lucide-react";
import { ShopItemCard } from "@/components/shop/ShopItemCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Belső Bolt | GamerHírek",
  description: "Váltsd be a GamerCoinjaidat exkluzív digitális javakra, egyedi chat emojikra és kitűzőkre.",
  openGraph: {
    title: "Belső Bolt | GamerHírek",
    description: "Váltsd be a GamerCoinjaidat exkluzív digitális javakra, egyedi chat emojikra és kitűzőkre.",
    type: "website",
  },
};

export default async function ShopPage() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login?next=/shop");
  }

  const user = await db.user.findUnique({
    where: { id: session.id },
    include: {
      purchases: true,
    },
  });

  if (!user) {
    redirect("/admin/login");
  }

  const shopItems = await db.shopItem.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" }
  });

  const purchasedItemIds = new Set(user.purchases.map((p) => p.shopItemId));

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <header style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-site-border)", paddingBottom: "2rem", flexWrap: "wrap", gap: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <ShoppingBag style={{ color: "var(--color-esport-teal)" }} size={32} />
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "2.5rem", textTransform: "uppercase", letterSpacing: "0.02em", margin: "0 0 0.5rem 0" }}>
              Gamer Bolt
            </h1>
            <p style={{ color: "var(--color-site-muted)", margin: 0, fontSize: "0.875rem", maxWidth: "400px" }}>
              Váltsd be a megkeresett GamerCoin-jaidat (GC) extra szolgáltatásokra. Ha aktív vagy chaten, minden üzenettel 2 GC-t szerzel!
            </p>
          </div>
        </div>
        
        <div style={{ background: "rgba(0, 255, 127, 0.1)", border: "1px solid rgba(0, 255, 127, 0.3)", borderRadius: "8px", padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <Coins style={{ color: "#00FF7F" }} size={32} />
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", color: "#00FF7F", letterSpacing: "0.1em" }}>
              Egyenleged
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.75rem", color: "var(--color-site-white)" }}>
              {user.gamerCoin} GC
            </div>
          </div>
        </div>
      </header>

      {shopItems.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {shopItems.map((item) => (
            <ShopItemCard
              key={item.id}
              item={item}
              userGamerCoins={user.gamerCoin}
              hasPurchased={purchasedItemIds.has(item.id)}
            />
          ))}
        </div>
      ) : (
        <div style={{ 
          background: "rgba(255,255,255,0.03)", 
          border: "1px dashed var(--color-site-border)", 
          padding: "4rem 2rem", 
          borderRadius: "8px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          color: "var(--color-site-muted)"
        }}>
          <ShieldAlert size={48} opacity={0.3} />
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem", margin: "0 0 0.5rem 0", color: "var(--color-site-white)" }}>
              A bolt jelenleg üres
            </p>
            <p style={{ margin: 0, maxWidth: "400px", marginLeft: "auto", marginRight: "auto" }}>
              Várj a következő patch-re, amikor megnyitjuk a Shopot és bekerülnek a legújabb exkluzív tárgyak és chat emojik!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
