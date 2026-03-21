# Phase 11: Valós Játékinfók (Riot Games API Integráció)

## 1. Overview (Áttekintés)
A projekt célja a felhasználók hitelességének és az oldal prémium érzésének növelése azáltal, hogy a felhasználók weben található profilját összekötjük a tényleges Valorant (Riot Games) fiókjukkal. Egy nem hivatalos API (HenrikDev API vagy Tracker.gg adatok) vagy publikus végpont segítségével automatikusan szinkronizáljuk a játékon belüli rangjukat és szintjüket, ami hitelessé varázsolja a Csapatkereső (LFG) hirdetéseket.

## 2. Project Type
**WEB** (Next.js App Router, Prisma ORM, Server Actions backend)

## 3. Success Criteria
- [ ] A felhasználók a Profil oldalon összeköthetik fiókjukat egy Riot ID megadásával (pl. `PlayerOne#EUNE`).
- [ ] Az oldal validálja a Riot ID-t egy külső API-n (pl. HenrikDev Valorant API) keresztül.
- [ ] Sikeres szinkronizáció esetén az adatbázis elmenti a valós in-game Rangot (Rank) és Szintet (Account Level).
- [ ] Az LFG (Csapatkereső) rendszerben a manuálisan beírt rang helyett a hivatalos, szinkronizált (Verified) rang jelenik meg egy "Hitelesített" jelölt plecsnivel.
- [ ] Opcionálisan beállítható, hogy a rangjuk elavulása esetén (pl. utolsó szinkronizáció több, mint 7 napja történt) a rendszer frissítést kérjen.

## 4. Tech Stack & Architecture
- **Adatbázis (Prisma):** Új mezők a meglévő `User` modellben a Riot adatok (ID, Rang, Szint, Utolsó Szinkronizáció) tárolására.
- **Backend (Next.js Server Actions / APIs):** API Wrapper a HenrikDev (vagy hasonló publikus) API-hoz cacheléssel, hogy elkerüljük a rate limiteket.
- **Frontend (React, TailwindCSS):** "Riot Account Csatolása" vizuális komponens beépítése a profilba, Valorant Rang ikonok vizuális megjelenítése a hitelesített felhasználóknál.

## 5. File Structure
```text
prisma/
  └── schema.prisma              # Adatbázis sémák frissítése
app/(main)/
  └── profil/
      └── page.tsx               # Csatolási UI beillesztése
components/
  ├── profile/
  │   └── RiotSyncCard.tsx       # Fiók hitelesítő űrlap komponens
  └── lfg/
      └── LFGPostCard.tsx        # Módosítás: Verified Rank kijelzése
lib/
  └── riot-api.ts                # Külső API hívások (HenrikDev) kezelése és típusai
actions/
  └── riot.ts                    # Server Actions a szinkronizáláshoz és az adatbázis frissítéséhez
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
  - *Output:* `User` bővítve: `riotId` (String? @unique), `riotRank` (String?), `riotLevel` (Int?), `lastRiotSync` (DateTime?).
  - *Verify:* `npx prisma db push` sikeresen lefut adattörlés nélkül, a Prisma Client frissül.

### Task 2: Külső API Wrapper és Backend Logika
- **ID:** T2
- **Agent:** `backend-specialist`
- **Skills:** `api-patterns`, `clean-code`
- **Priority:** P1
- **Dependencies:** T1
- **INPUT → OUTPUT → VERIFY:**
  - *Input:* HenrikDev API dokumentáció (Riot account endpointok).
  - *Output:* `lib/riot-api.ts` fetch függvények hibakezeléssel. `actions/riot.ts` a Next.js actionökhöz (`verifyAndSyncRiotAccount`, `unlinkRiotAccount`).
  - *Verify:* Egy létező, publikus Valorant névvel a szerver action hiba nélkül lekéri és az adatbázisba beírja a Silver/Gold/stb. rangot. Nem létező név esetén kulturált hibaüzenetet ad.

### Task 3: Riot Sync Komponens (Profil UI)
- **ID:** T3
- **Agent:** `frontend-specialist`
- **Skills:** `react-best-practices`
- **Priority:** P1
- **Dependencies:** T1, T2
- **INPUT → OUTPUT → VERIFY:**
  - *Input:* Új Riot Server action-ök.
  - *Output:* `RiotSyncCard.tsx` form létrehozása. Két állapot: Nincs csatolva (Input field a Név#TAG-nek és Gomb) -> Csatolva van (Jelenlegi in-game szint és rang kiírása, "Szinkronizáció Frissítése" és "Lecsatolás" gombok).
  - *Verify:* A Profil oldalon sikeresen csatolható és frissíthető a Riot ID anélkül, hogy az oldal teljesen újratöltene (optimistic UI vagy startTransition használata).

### Task 4: LFG és Hitelesített Rangok Integrációja
- **ID:** T4
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P2
- **Dependencies:** T1
- **INPUT → OUTPUT → VERIFY:**
  - *Input:* `LFGPost` típusok és komponensek.
  - *Output:* Ha egy LFG posztot létrehozó felhasználónak van érvényes `riotRank`-ja, felülirjuk a dropdownból választott manuális rangot, és kap egy "✔ Verified" zöld pipát a rang ikonja mellé.
  - *Verify:* Vizuálisan jól megkülönböztethető LFG oldalon, ha valaki mögött valódi bekötött Riot fiók áll, szemben azzal, aki csak beírta manuálisan.

## 7. Phase X: Verification Checklist
Mielőtt a fázist lezárjuk, a "Final Checks" parancsnak (vagy a manuális listának) teljesülnie kell:
- [ ] **Biztonság (Security):** Nincs kiállítva sensistive API kulcs kliens oldalra (Strict server actions). Ugyanazt a Riot ID-t nem csatolhatja két különböző User beépített @unique miatt.
- [ ] **Lint & Typings:** `npm run lint` és `npx tsc --noEmit` sikeres. 
- [ ] **Külső API Hibatűrés:** Mi van, ha a HenrikDev API épp nem elérhető? A Try-Catch blokkok szépen fedik el a timeoutot a kliens felé visszajelzést adó error toastokkal.
- [ ] **Valós adatbázis szinkron:** Az LFG kártyák reagálnak a szinkronizált Riot adatokra a manuális inputtal ellentétben.
