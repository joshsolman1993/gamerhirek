# Phase 10: E-sport és Interaktivitás (Terv)

## 1. Overview (Áttekintés)
A projekt célja az E-sport fogadások (Pick'em) köré épülő interaktivitás növelése egy virtuális gazdaság (GamerCoin) bevezetésével, és a felhasználók lojalitásának jutalmazásával a "Csapat-szurkolói státusz" implementálásával. A Stream Galéria (Twitch/YouTube) a megállapodás szerint egyelőre kikerült a scope-ból.

## 2. Project Type
**WEB** (Next.js App Router, Prisma ORM, tRPC/Server Actions backend)

## 3. Success Criteria
- [ ] A felhasználók rendelkeznek GamerCoin (GC) virtuális egyenleggel.
- [ ] Felhasználói aktivitások (pl. chat, komment) révén limitált mennyiségű GC-rehet szert tenni naponta (farming és flood blokkolás).
- [ ] Működik egy belső Bolt (Shop), ahol a GC-t digitális javakra, pl. egyedi globális chat emojikra válthatják.
- [ ] A felhasználók kiválaszthatják kedvenc csapatukat egy szigorú, 3 órás időzített váltási limittel (cooldown).
- [ ] E-sport meccsek lezárásakor, ha a "Kedvenc" csapat győz, az őt támogató felhasználók extra XP jóváírást kapnak.

## 4. Tech Stack & Architecture
- **Adatbázis (Prisma):** Új mezők a meglévő `User` modellben (GC és cooldown tárolás), illetve új `ShopItem` és `UserPurchase` modellek a vásárolható virtuális tárgyakhoz.
- **Backend (Next.js Server Actions / APIs):** Biztonságos tranzakciós logika a bolti beváltásokhoz (Concurrency védelem). Limitkövető rendszer az XP/GamerCoin növeléshez.
- **Frontend (React, TailwindCSS):** Új UI a Bolt számára, valamint a Profil oldal kiegészítése a választott csapathoz illeszkedő dinamikus színek megváltoztatásához.

## 5. File Structure
```text
prisma/
  └── schema.prisma              # Adatbázis sémák frissítése
app/(main)/
  └── shop/
      └── page.tsx               # Belső Bolt frontend oldala (Terméklista)
components/
  ├── shop/
  │   └── ShopItemCard.tsx       # Bolt termékek UI eleme (GamerCoin árral)
  └── profile/
      └── TeamSelector.tsx       # Kedvenc csapat kiválasztó (3 órás cooldown kijelzéssel)
lib/
  └── economy.ts                 # Napi GamerCoin cap logikát és tranzakciókat tartalmazó util fájl
```

## 6. Task Breakdown

### Task 1: Adatbázis Séma Kibővítése
- **ID:** T1
- **Agent:** `database-architect`
- **Skills:** `database-design`
- **Priority:** P0 (Blokkoló)
- **Dependencies:** Nincs
- **INPUT → OUTPUT → VERIFY:**
  - *Input:* Meglévő `schema.prisma`.
  - *Output:* `User` bővítve (`gamerCoin` INT def 0, `dailyGCEarned` INT, `lastGCDAte` DATETIME, `favoriteTeamId` STRING (relation to Team), `favoriteTeamChangedAt` DATETIME). Új `ShopItem`, `UserPurchase` tábla.
  - *Verify:* `npx prisma db push` (vagy `prisma generate`) hiba nélkül lefut, a típusok validak.

### Task 2: Virtuális Gazdaság Backend Logika (GamerCoin & Bolt)
- **ID:** T2
- **Agent:** `backend-specialist`
- **Skills:** `api-patterns`, `clean-code`
- **Priority:** P1
- **Dependencies:** T1
- **INPUT → OUTPUT → VERIFY:**
  - *Input:* Adatbázis modellek definiálva.
  - *Output:* API útvonalak / Server Action-ök a napi GC farmolási sapka betartására (pl. max. 100 GC/nap) és a bolti tranzakciók lebonyolítására (elég GC ellenőrzése -> vásárlás).
  - *Verify:* Backend szinten védve van a negatív egyenleg és a limit feletti napi GC kiutalás a tesztelés során.

### Task 3: Csapat-Váltás és Cooldown Rendszer (Profil & UX)
- **ID:** T3
- **Agent:** `frontend-specialist` (vagy fullstack orchestrator)
- **Skills:** `react-best-practices`
- **Priority:** P1
- **Dependencies:** T1, T2
- **INPUT → OUTPUT → VERIFY:**
  - *Input:* Csapatváltást lehetővé tevő új API és a profil oldal forráskódja.
  - *Output:* `TeamSelector` komponens, mely 3 órás cooldown-t valósít meg vizuálisan (UI gomb letiltva + hátralévő idő), az oldal bizonyos elemei dinamikusan felveszik a csapat színeit.
  - *Verify:* Tesztelésnél megváltoztatom a csapatot -> lezárul az input. Visszajelzés megfelelő az UI-on.

### Task 4: Belső Bolt UI és Globális Chat Integráció
- **ID:** T4
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`, `tailwind-patterns`
- **Priority:** P2
- **Dependencies:** T2
- **INPUT → OUTPUT → VERIFY:**
  - *Input:* Shop API végpontok (vásárolható csomagok lekérése, tranzakció indítás).
  - *Output:* Új `/shop` útvonal csinos kártyákkal (pl. egyedi chat emojik megvásárlásához). A Chat rendszer pedig frissítve, hogy a megvett digitális extra engedélyezésre kerüljön.
  - *Verify:* GC hiányában a vásárlás gomb inaktív. Vásárlás után azonnal levonásra kerül a GamerCoin, és használhatóvá válik a funkció (pl. Chat).

### Task 5: Meccs Kiértékelés Frissítése (Nyertes XP)
- **ID:** T5
- **Agent:** `backend-specialist`
- **Skills:** `api-patterns`
- **Priority:** P2
- **Dependencies:** T1
- **INPUT → OUTPUT → VERIFY:**
  - *Input:* Meglévő Pick'em / Meccs lezárást intéző backend funkció.
  - *Output:* Amikor véget ér egy meccs, egy mass-update SQL lekéréssel a nyertes csapathoz hűséges (`favoriteTeamId == nyertes`) játékosok kapnak előre definiált mennyiségű XP-t.
  - *Verify:* Admin által kiértékelt fiktív meccs után a szurkolók User rekordjában növekszik az XP.

## 7. Phase X: Verification Checklist
Mielőtt a fázist véglegesen átadnánk (Run all verifications):
- [ ] **Biztonság (Security):** Negatív egyenleges tranzakció tesztelése és "Race condition" elleni védelem (tranzakciós zárolás a Shop-ban).
- [ ] **Lint & Typings:** `npm run lint` és `npx tsc --noEmit` teljesen lefut hibamentesen.
- [ ] **UX/UI Audit:** A kedvenc csapat beállítás 3 órás visszaszámlálója kliens oldalon jól jelenik meg, backend oldalon szigorúan védve van.
- [ ] **GamerCoin Flood Test:** Ha hirtelen 50 új üzenetet ír valaki a global chaten, a GC egyenleg nem lépheti át a napi max kapacitás sapkát.
- [ ] A tervet a `project-planner` és a `brainstorming` (Socratic Gate) skill szabályai alapján alakítottuk ki.
