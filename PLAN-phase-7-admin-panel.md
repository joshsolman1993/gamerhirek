# PROJECT PLAN: Phase 7 - Fejlett Admin Panel és Analitika

## 📌 Overview
Ez a terv a GamerHírek projekt 7. fázisát részletezi, melynek fókuszában az adminisztrációs felület (`/admin`) teljes körű kibővítése áll. A rendszer egy "Mindkettő" opciót lefedő (Tartalom + Gamification) CMS-sé fejlődik, ahol a moderáció és a vizuális analitika egyaránt főszerepet kap.
**A fő célkitűzések:**
1. Grafikus adattáblák és szerkesztők létrehozása: Napi Kvízek, Pick'em Meccsek, Pollok, Kategóriák és Címkék kezelésére (CRUD felületek).
2. Haladó Analitikai Dashboard Chartokkal (Regisztrációs statisztikák, napi nézettségi tendenciák, Top 3 legolvasottabb cikk heti szinten).
3. "Felhasználók" és "Moderáció" fül: Regisztrált tagok kitiltása (ban), XP szerkesztése, illetve renitens kommentek és Kocsma üzenetek törlése, mindennemű előzetes komment-karantén/jóváhagyás kötelezettség NÉLKÜL.

---

## 🏗️ Project Type
**WEB** (Next.js App Router, Prisma ORM, Recharts / Tailwind CSS)

Primary Agent: `frontend-specialist` (UI grafikonok, táblázatok) és `backend-specialist` (Admin API végpontok).

---

## Ellenőrzési pontok (Verification)

- [x] Látványos adattábla aggregálva `recharts` vizualizációval az `/admin` landing felületen.
- [x] Új Felhasználók (/admin/users) menüpont elérhető és listázza a regisztráltakat.
- [x] A felhasználóknál módosítható egy form/gomb segítségével az `xp` mező (tesztelési célból vagy büntetésre).
- [x] A felhasználói sor mellett van egy "Kitiltás" gomb, ami a User role-t átírja `"BANNED"`-re, ezzel kizárva az interakciókból.
- [x] Új Moderáció (/admin/moderation) menüpont elérhető, felsorolja a `GlobalChat` üzeneteket és `Comment` bejegyzéseket.
- [x] A moderációs listák elemeinél "Törlés" gomb elérhető.
- [x] A napi kvíz kezelése (létrehozás, opcionális kérdések felvétele vizuális builder-rel).
- [x] Pick'em meccsek felülírása és lezárása funkció integrálva biztosítva az elhatárolt backend API endpointtal.
- [x] Létrehozható új kategória, aminek dinamikus slug auto-generálódik, és egyedi HEX szín rendelhető hozzá.

---
**Fázis 7 Zárása**: Siker esetén futtassuk az `/orchestrate` (UX audit) parancsot vagy haladjunk a következő fázissal.

---

## ⚙️ Tech Stack & Decisions
* **Diagramok:** `recharts` könyvtár a reszponzív, tiszta grafikonokért.
* **Táblázatok és Formok:** Hagyományos Next.js Server Actions űrlapok és optimalizált React hook alapú modálok felugró szerkesztéshez.
* **Jogosultság-kezelés:** Minden új Server Action ellenőrzi a `session.role === "ADMIN"` flag-et.

---

## 📂 Expected File Structure
Új vagy bővülő fájlok:
```
├── app/admin/(protected)/page.tsx                  (Módosul: Analitikai Dashboard felület grafikonokkal)
├── app/admin/(protected)/users/page.tsx            (ÚJ: Felhasználó menedzsment és XP szerkesztő)
├── app/admin/(protected)/moderation/page.tsx       (ÚJ: Spam kommentek és Chat üzenetek törlése)
├── app/admin/(protected)/quiz/page.tsx             (ÚJ: Napi Trivia / Quiz adatközpont)
├── app/admin/(protected)/matches/page.tsx          (ÚJ: Pick'em eredmény hirdető és kiíró)
├── app/admin/(protected)/metadata/page.tsx         (ÚJ: Kategória és Tag szerkesztő)
└── components/admin/AdminSidebar.tsx               (Módosul: Kibővített kategória-ikonok)
```

---

## 📝 Task Breakdown

### Task 1: Haladó Dashboard Analitika UI
- **Agent/Skill:** `frontend-specialist` & `recharts`
- **Priority:** P1
- **INPUT:** `app/admin/(protected)/page.tsx`
- **OUTPUT:** Látványos adatbázis vonal- és oszlopdiagramok (pl. Recharts `LineChart` és `BarChart`), melyek aggregálják az elmúlt idők top 3 cikkét, valamint az `User.createdAt` alapján regisztráltakat.
- **VERIFY:** A Dashboard szép, dark-mode animált, reszponzív felületként működik, nem omlik össze, ha nincs adat.

### Task 2: Felhasználók és Moderáció Menü (CRUD)
- **Agent/Skill:** `backend-specialist` & `clean-code`
- **Priority:** P1
- **INPUT:** `User`, `Comment`, `GlobalChat` modellek beolvasása Server Actions-el (csak ha ADMIN).
- **OUTPUT:** Listajellegű oldalak a `/admin/(protected)/users` és `/moderation` alatt. Törlés (`btn`, delete query), fiók XP felülírása modal formon át.
- **VERIFY:** Gombnyomásra az adott felhasználó profilja módosul, vagy kommentje törlődik. A fiók letiltása esetében a fiókkal nem lehet bejelentkezni (Session invalidation / Middleware role szűrés).

### Task 3: Gamification Kvíz és Pick'em Tartalom Szerkesztő
- **Agent/Skill:** `frontend-specialist` & `backend-specialist`
- **Priority:** P2
- **INPUT:** `/admin/(protected)/quiz` & `matches` oldalak építése. Kapcsolódó Server Actions-el kiegészítve.
- **OUTPUT:** Lehetőség egy új Kvíz (és kérdések/opciók) űrlap létrehozására, amit aztán a napi rutin élesít. Meccsek lezárása és nyertes mapping beállítása grafikusan a Pick'emhez.
- **VERIFY:** Kvíz űrlap kitöltése után az felkerül a kezdőlapra / `/trivia`-ra. Nyertes kiválasztásakor frissül a DB state.

### Task 4: Metadata Szerkesztő (Kategóriák és Tagek)
- **Agent/Skill:** `backend-specialist`
- **Priority:** P3
- **INPUT:** `Category`, `Tag` és `Poll` modellek.
- **OUTPUT:** Belső vezérlőpult a kategóriák átnevezésére, szín módosításra, és a Napi Poll kiírására.
- **VERIFY:** Szín átszerkesztése után a Live Site hírcímkéi a frissült színnel jelennek meg.

---

## ✅ PHASE X: Verification & Completion Checklist
*(A feladat végrehajtójának kell pipálnia mielőtt készre jelenti a teljes Fázis 7-et!)*

### P0. Check
- [ ] Admin jogosultsági verifikáció: Minden új route csak ADMIN szerepkörrel nyitható meg.
- [ ] Védi-e a rendszer az alap kommentek beküldését manuális jóváhagyás elvárása (approved check) NÉLKÜL?

### P1. Execute Scripts
- [ ] `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .` - Admin auth leak nincsen!
- [ ] `python .agent/skills/frontend-design/scripts/ux_audit.py .`
- [ ] `npm run lint && npx tsc --noEmit` - Szabványos kód.
- [ ] `npm run build` - SSG/RSC render hibátlan.

### P2. Manual Verification
- [ ] Nyiss le egy Felhasználó fület, adj neki +200 XP-t, és nézd meg, frissül-e a normál /profil felületén!
- [ ] Hozz létre egy Kamu Meccset, majd töröld vagy állítsd be a győztest, lekezelve a Pick'em változást.
- [ ] Látod a Grafikonokat a Dashboard-on? Reszponzív (összehúzásra összenyomódik)?

### P3. Sign Off
- Date: [Fill when completed]
- Status: READY TO DEPLOY
