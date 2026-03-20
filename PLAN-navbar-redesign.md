# 🚀 Fázis 9: Navigáció és Navbar Újratervezése (Navbar Redesign)

## 📌 Áttekintés (Overview)
A felhasználói élmény és a letisztult dizájn érdekében a jelenlegi túlzsúfolt (gördíthető) navigációs sáv átalakítása szükséges. Célunk egy modern, esport portálokhoz és webalkalmazásokhoz illő "Premium" navigációs struktúra létrehozása, amely reszponzív, átlátható és könnyen bővíthető a jövőben.

**Project Type:** WEB

## 🎯 Sikerkritériumok (Success Criteria)
1. Nincs horizontális scroll a főmenüben asztali és tablet nézeteken.
2. Átlátható kategóriák hierarchikus elrendezésben (pl. Főmenü + Almenük).
3. Reszponzív hamburger/oldalsó sáv (off-canvas) mobil nézeten.
4. Prémium dizájn (blur effektek, animált hover, ikonok).

## 💡 Koncepció - Melyik Opciót Válasszuk? (Socratic Gate)
A fejlesztés megkezdése előtt be kell állítanunk a koncepciót. Jelenleg 3 javaslat van az asztalon:

### Opció A: Mega Menu (Javasolt!)
A fejlécben csak 4-5 "Fő Kategória" szerepel (pl. *Hírek, Esport, Közösség, Adatbázis*). Rájuk húzva az egeret egy gyönyörű, ikonokkal teli széles almenü (Mega Menu) nyílik le, benne a Tier List, Térképek, Klánok, stb.
*Előnye:* Extrém tiszta, modern (mint a Riot Games oldalai).

### Opció B: Kétszintes (Double-Row) Navbar
A felső sorban: Logó, Keresés, Profil, Értesítések.
Az alsó (vékonyabb) sorban: Az összes link elosztva, jobban elférve.
*Előnye:* Minden azonnal látható marad egyetlen kattintással.

### Opció C: App-szerű Oldalsó Sáv (Sidebar)
Mint a Discord. Bal oldalon egy kinyitható vékony sáv gyűjti össze az összes menüpontot, a felső sávban csak a globális profil / keresés marad.
*Előnye:* Maximális függőleges hely, gaming/app érzés.

---

## 🏗️ Technológiai Stack & Fájl Struktúra
* **Technológia:** Next.js (App Router), React (`useState`, `usePathname`), CSS Module / Inline Styles, Lucide Icons.
* **Fájlok:**
  - Módosítva: `components/Navbar.tsx`
  - Új (opcionális, A/C választás esetén): `components/MegaMenu.tsx` vagy `components/Sidebar.tsx`
  - Új: `components/MobileMenu.tsx` (mobil hamburger gombhoz)

## 📋 Feladatok (Task Breakdown)

### Task 1: Koncepció véglegesítése
- **Agent:** `orchestrator`
- **Leírás:** A felhasználó (USER) kiválasztja a fenti opciók egyikét, és rögzítjük az új menüpont hierarchiát.
- **Verification:** A koncepció kiválasztásra került.

### Task 2: Új Navigációs Struktúra implementálása (Asztali nézet)
- **Agent:** `frontend-specialist`
- **Priority:** P2
- **Leírás:** A `Navbar.tsx` átalakítása a választott elrendezés szerint. Térközök, hover animációk beállítása.
- **Input:** Kiválasztott Opció 
- **Output:** Működő új `Navbar.tsx` asztali nézeten.
- **Verify:** Nincs horizontális scroll 1024px felett.

### Task 3: Mobil Reszponzivitás (Off-canvas Hamburger Menü)
- **Agent:** `frontend-specialist`
- **Priority:** P2
- **Leírás:** Teljes képernyős vagy balról/jobbról beúszó mobil menü létrehozása a telefonos nézetekre.
- **Output:** `components/MobileMenu.tsx` integrálása.
- **Verify:** Mobil nézetben (768px alatt) megjelenik a Hamburger ikon, és gombra nyílik.

### Task 4: Design Audit & E2E Tesztelés
- **Agent:** `frontend-specialist`
- **Priority:** P3
- **Leírás:** Z-index ellenőrzése (ne lógjanak bele cikkek/Térképek), színek tesztelése.
- **Output:** Gyönyörűen vizualizált, reszponzív navbar.
- **Verify:** Kattintások és navigáció megfelelően működik.

---

## ✅ PHASE X: Végső Ellenőrzés (Verification)
- [ ] Színek megfelelőek (Sötét módhoz igazítva, keine purple/violet)
- [ ] UX rendben: 1920x1080 és 375x667 nézeten is olvasható
- [ ] Build hiba nélkül lefut (`npx next build`)
- [ ] Z-index hibák tesztelése kereső/mega menu között
