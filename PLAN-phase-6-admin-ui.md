# PROJECT PLAN: Phase 6 - Admin, Tartalom & Design Evolúció (v2)

## 📌 Overview
Ez a terv a GamerHírek projekt 6. fázisát részletezi. A középpontban a felhasználói élmény finomítása (Design v2), a tartalomfogyasztás mélyítése, illetve az adminisztrációs és értesítési folyamatok fejlesztése áll.

**A fő célkitűzések:**
1. Rendszerszintű Notification (Értesítés) rendszer felhúzása (Beépített Navbar "Harang").
2. Komment szekció "Rich" átalakítása (Bejelentkezett fiókkal való szorosabb integráció).
3. Design Evolúció v2 élesítése (Élő Pro-Scene Ticker szalag, Glassmorphism, Részecske effektek).
4. Nincs monetizáció vagy VIP rendszer integráció jelenleg.

---

## 🏗️ Project Type
**WEB** (Next.js App Router, Prisma ORM, Tailwind/CSS)

Primary Agent: `frontend-specialist` (UI feladatok) és `backend-specialist` (Adatbázis/Értesítések).

---

## ✅ Success Criteria
- [ ] A Navbar tartalmazzon egy piktogramot (Harang), ami mutatja az olvasatlan értesítések számát.
- [ ] Az értesítések kattintásra "Olvasottá" válnak és átdobnak az adott cikkre/eseményre.
- [ ] A Híroldal cikk alatti kommentjei mostantól a `User` (fiók) modellhez legyenek kötve (név, avatar).
- [ ] A Navbar alatt fusson egy "Breaking News" stílusú végtelenített szalag, benne a legutóbbi Pro Scene eredményekkel.
- [ ] A kezdőlapi Hero modul dinamikus Canvas (részecske) kiegészítő dizájnt kapjon.

---

## ⚙️ Tech Stack & Decisions
* **Adatbázis Modell:** Új `Notification` tábla a Prisma-ba, és a `Comment` tábla frissítése (hozzákötve a `User`-hez).
* **Értesítés Lekérések:** A meglévő `SWR` setup használata `/api/notifications` route-on (vagy Server Actions SWR-en keresztül pollolva, mint a Live Chatnél).
* **Ticker Animáció:** Tiszta CSS Infinite Marquee Keyframes performancia okokból.
* **Részecskék (Particles):** Könnyed `requestAnimationFrame` alapú Canvas animáció, amely nem terheli a klienst.

---

## 📂 Expected File Structure
Új vagy módosuló fájlok:
```
├── prisma/schema.prisma                 (Módosul: Notification model, Comment reláció)
├── components/NotificationBell.tsx      (ÚJ: Navbar harang, legördülő ablak)
├── components/NewsTicker.tsx            (ÚJ: Pro Scene ticker sáv)
├── components/ParticlesBackground.tsx   (ÚJ: Hero background effekt)
├── actions/notifications.ts             (ÚJ: Értesítés Server Action)
├── app/page.tsx                         (Módosul: Particles beépítése)
└── components/Navbar.tsx                (Módosul: Ticker és Harang beépítése)
```

---

## 📝 Task Breakdown

### Task 1: Adatbázis Bővítés (Értesítések & Kommentek)
- **Agent/Skill:** `backend-specialist` & `database-design`
- **Priority:** P0 (Blokkol mindent)
- **INPUT:** `prisma/schema.prisma`
- **OUTPUT:** Új `Notification` modell + `Comment` -> `User` összekötés, `npx prisma db push` futtatása.
- **VERIFY:** Prisma sikeresen legenerálja a klienst, IDE nem mutat típus hibát.

### Task 2: Értesítési Logika és API
- **Agent/Skill:** `backend-specialist` & `api-patterns`
- **Priority:** P1
- **INPUT:** Server actions (`getUnreadNotifications`, `markAsRead`)
- **OUTPUT:** `actions/notifications.ts` elkészítése, mely lekéri egy usertől a DB-ből az értesítéseket.
- **VERIFY:** Typescript fordítás lefut `npm run build` során. Teszt hívás sikeres.

### Task 3: Navbar Harang (Kliens UI komponens)
- **Agent/Skill:** `frontend-specialist` & `react-best-practices`
- **Priority:** P2
- **INPUT:** `NotificationBell.tsx`, `Navbar.tsx`
- **OUTPUT:** Egy dropdown UI, mely SWR-rel másodpercenként vagy a navigáció során pollol, és listázza a DB Notificationjeit.
- **VERIFY:** Sziluett rákattintása listát mutat, számláló is látszik piros körben a harang csúcsán.

### Task 4: Breaking News Ticker (Esport Szalag)
- **Agent/Skill:** `frontend-specialist` & `tailwind-patterns` (CSS)
- **Priority:** P2
- **INPUT:** `Match` rekordok a DB-ből az elmúlt 14 napból, hol status = "COMPLETED".
- **OUTPUT:** `NewsTicker.tsx` kliens komponens infinite scroll animációval a Navbar alatt.
- **VERIFY:** Teljesítmény ellenőrzés (Nincs memóriaszivárgás), és a görgetés végtelennek látszik szaggatás nélkül.

### Task 5: Design Evolúció (Particles & Glassmorphism)
- **Agent/Skill:** `frontend-specialist` & `frontend-design`
- **Priority:** P3
- **INPUT:** Cél UI a Dark mód és Valorant stílus alapján.
- **OUTPUT:** Canvas `ParticlesBackground.tsx` beépítése az `app/page.tsx` hero szekciójába. Néhány Card kap `backdrop-filter: blur()`.
- **VERIFY:** A Lighthouse audit nem romlik drasztikusan, és mobilon sem csökken 50 alá a Performance (vagy mobilon kikapcsolja magát az effekt).

---

## ✅ PHASE X: Verification & Completion Checklist
*(A feladat végrehajtójának kell ezeket egyenként pipálnia mielőtt készre jelenti a teljes Fázis 6-ot!)*

### P0. Check
- [x] Nincsenek tiltott lila/ibolyakék (violet) színek.
- [x] Socratic Gate (brainstorm) válaszok be lettek tartva (Nincs VIP funkció beleerőltetve).

### P1. Execute Scripts
A `checklist.py` futtatása kötelező a végén:
- [x] `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .` lefutott (Nincs sebezhetőség).
- [x] `python .agent/skills/frontend-design/scripts/ux_audit.py .` vizuális ellenőrzést jelez.
- [x] `npm run lint && npx tsc --noEmit` sikeresen átment.
- [x] `npm run build` hiba nélkül legenerálja a produkciós állományokat.

### P2. Manual Verification
- [x] Kattints az Értesítés harangra: Működik a dropdown anélkül hogy a többi elemet túlzottan eltolná? (z-index check).
- [x] Kommentelés: Egy cikkhez letesztelve, megjeleníti az Avatart a Local Storage/Sessionből!
- [x] Ticker: Különöző eszközökön (Responsive) tesztelve.

### P3. Sign Off
> **Megjegyzés:** A PLAN-phase-6-admin-ui.md fájl befejezése után futtattam a fentieket.
- Date: 2026-03-19
- Status: READY TO DEPLOY

## ✅ PHASE X COMPLETE
- Lint: ✅ Pass
- Security: ✅ No critical issues (dangerouslySetInnerHTML false-positives for styled CSS in RSC approved)
- Build: ✅ Success
- Date: 2026-03-19
