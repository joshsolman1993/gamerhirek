# Fázis 8 - Kiterjesztett Közösségi Funkciók

## Áttekintés (Overview)
Ez a fázis a GamerHírek meglévő közösségi alapjaira épít, és egy teljes értékű közösségi ökoszisztémát hoz létre. A felhasználók közvetlenül kommunikálhatnak, baráti kapcsolatokat építhetnek, közösségeket (klánokat/teameket) hozhatnak létre, és a gamifikáció révén egy szorosabb közösséget alakíthatunk ki.

## Fő Célkitűzések és Feladatok (Task Breakdown)

### 1️⃣ Közvetlen Üzenetküldés (Direct Messages)
- **Adatbázis (Prisma):** `DirectMessage` modell létrehozása (`senderId`, `receiverId`, `content`, `readAt`).
- **Backend:** Üzenetek küldése, olvasott státusz frissítése, korábbi beszélgetések lekérése.
- **UI/UX:** 1:1 privát chat felület (pl. `/chat/[userId]`), üzenet előzmények megjelenítése.
- **Valós idejű funkciók:** Aktív/inaktív státusz jelzése, "is typing..." (típolásjelzés) implementálása (opcionálisan Pusher / WebSockets / SWR short-polling segítségével).

### 2️⃣ Felhasználói Profilok & Követés (Profiles & Following)
- **Adatbázis (Prisma):** `Follow` modell (`followerId`, `followingId`) bevezetése.
- **Backend:** Követés / kikövetés (follow/unfollow) Server Action-ök.
- **UI/UX:** Kiterjesztett publikus felhasználói profil oldal (`/profil/[id]`), nyilvános statisztikák (XP, szint, eredmények) megjelenítése.
- **Feed:** "Követett felhasználók" feed létrehozása (pl. barátok legutóbbi aktivitásai, kommentjei, elért kitűzői).

### 3️⃣ Közösségek / Szervezetek (Communities / Guilds)
- **Adatbázis (Prisma):** `Guild` (Közösség) modell, valamint `GuildMember` kapcsolótábla (szerepkörökkel: Founder, Moderator, Member). `GuildChat` modell a specifikus csatornákhoz.
- **Backend:** Közösség alapítása, tagok meghívása/csatlakozása, szerepkörök módosítása, guild-szintű statisztikák aggregálása.
- **UI/UX:** Közösség kereső/felfedező oldal (`/guilds`), Dedikált közösségi oldal és belső chat csatornák (`/guilds/[id]`).

### 4️⃣ Fel-/Lemenő Rendszer (Kudos / Upvote System)
- **Adatbázis (Prisma):** `Upvote` modell (`userId`, `commentId` / `articleId`). Cikkek és Kommentek sémájának bővítése reputációs pontokkal.
- **UI/UX:** "Szív" vagy "Taps" gombok a hozzászólásoknál és cikkeknél.
- **Gamifikáció:** Reputációs pontok (Kudos) számítása és Top közreműködők kiemelése a profilokon vagy egy globális Leaderboardon.

### 5️⃣ Felhasználó Ajánlások & Barátok
- **Backend Logika:** "Javasolt barátok" (Suggested friends) algoritmus (pl. közös közösségek, azonos cikkekhez írt kommentek, vagy hasonló érdeklődés alapján).
- **UI/UX:** Oldalsáv widget vagy dedikált blokk a javasolt barátok listázására gyors "Követés" gombbal.

---

## Tervezett Architektúra / Technológiák
- **Adatbázis Módosítás:** `schema.prisma` frissítése és migrációja.
- **Valós idejűség:** SWR polling vagy Pusher a chat és típúsjelzésekhez.
- **Szerver Oldali Akciók (Server Actions):** Komment upvote, DM küldés, Guild módosítások.
- **Vizuális elemek:** Tailwind CSS, `lucide-react` ikonok.

---

## Ellenőrzési pontok (Verification Checklist)
- [ ] Prisma séma kiegészítve (`DirectMessage`, `Follow`, `Guild`, `GuildMember`, `Upvote`).
- [ ] Sikeres adatbázis migráció és `prisma generate` futtatása.
- [ ] 1:1 Chat felület elkészült, és az üzenetek valós időben (vagy gyors pollinggal) frissülnek.
- [ ] Felhasználói profilok lekérhetőek publikus URL-en statisztikákkal, működő "Követés" gombbal.
- [ ] Guild (klán) létrehozható, felhasználók csatlakozhatnak, és van egy közös belső chat fal.
- [ ] Kommentek "lájkolhatóak" / "upvote"-olhatóak, és ez növeli a szerző XP-jét vagy Reputációját.
- [ ] Dashboardon vagy oldalsávon megjelennek a "Javasolt Barátok".

---
**Fázis 8 Zárása**: Siker esetén futtassuk az `/orchestrate` (UX audit) parancsot vagy lépjünk a fejlesztés utolsó fázisába.
