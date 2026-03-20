# 🚀 Fázis 9: Cikk Szerkesztő Képbeágyazás (Markdown + Cloudinary)

## 📌 Áttekintés (Overview)
A meglévő adminisztrációs cikk szerkesztő felület fejlesztése egy professzionális képfeltöltési integrációval. A felületen a felhasználó (író/szerkesztő) képes lesz egy gombnyomással képeket feltölteni a Cloudinary felhőtárhelyre, amely sikeres feltöltés után automatikusan generálja a megfelelő Markdown szintaxist (kép URL-t) és beilleszti a szövegbe. A publikus felület (frontend) pedig automatikusan rendereli ezeket a képeket.

**Project Type:** WEB

## 🎯 Sikerkritériumok (Success Criteria)
1. Képfeltöltés integráció a meglévő Markdown szerkesztőbe (`@uiw/react-md-editor`).
2. Cloudinary Upload Widget sikeres megnyitása és képek befogadása.
3. Sikeres feltöltés után Markdown szintaxis `![képnév](url)` automatikus beszúrása a kurzor pozíciójában.
4. `react-markdown` integráció a publikus cikkoldalon (`app/hirek/[slug]/page.tsx`), hogy a beszúrt képek gyönyörűen, reszponzívan jelenjenek meg (akár `next/image` használatával optimalizálva).

---

## 🏗️ Technológiai Stack & Fájl Struktúra
* **Technológia:** Next.js (App Router), `next-cloudinary`, `react-markdown`, `@uiw/react-md-editor`, Tailwind / Inline CSS.
* **Fájlok módosulnak:**
  - `app/admin/(protected)/articles/new/page.tsx` és `app/admin/(protected)/articles/[id]/edit/page.tsx` (Vagy ahogy a meglévő szerkesztő űrlap van kialakítva)
  - `app/hirek/[slug]/page.tsx` (A Markdown vizuális renderelésének frissítése)
* **Környezeti változók:**
  - `.env` fájl kiegészítése a Cloudinary változóval (pl. `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`).

---

## 📋 Feladatok (Task Breakdown)

### Task 1: Függőségek és Környezet Beállítása
- **Agent:** `backend-specialist`
- **Priority:** P1
- **Leírás:** A `next-cloudinary` és `react-markdown` NPM csomagok telepítése. A kód előkészítése a Cloudinary konfigurációk (`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` és `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`) fogadására. 
- **Input:** Csomagtelepítések (npm install).
- **Output:** Frissített `package.json`, szerver futóképességének megtartása.
- **Verify:** A függőségek bekerültek, a dev szerver újraindítható. (Kérjük meg a felhasználót, hogy a `.env`-ben adja meg az adatokat).

### Task 2: Cloudinary Upload Widget Integrációja a Szerkesztőhöz
- **Agent:** `frontend-specialist`
- **Priority:** P2
- **Leírás:** Az Admin cikk szerkesztő felületen (`ArticleForm` vagy a megfelelő admin page) egy "Kép Beszúrása" gomb elhelyezése a `@uiw/react-md-editor` testreszabott eszköztárában vagy felette. A `CldUploadWidget` implementálása.
- **Input:** `next-cloudinary` importálása.
- **Output:** Egy gomb, ami megnyitja a feltöltő űrlapot az adminnak.
- **Verify:** Kattintásra a Cloudinary ablak megjelenik az adminban.

### Task 3: Markdown Auto-Beszúrás Logikája
- **Agent:** `frontend-specialist`
- **Priority:** P2
- **Leírás:** A Cloudinary `onSuccess` callback lekezelése során a fájl `secure_url` értékének kinyerése, és a Markdown tartalom (state) kibővítése: `![feltöltött_kép](https://res.cloudinary.com/...)`.
- **Input:** Kép URL a callback-ből.
- **Output:** A szerkesztő bemeneti mezőjében megjelenik az új Markdown text.
- **Verify:** Feltöltés után a szerkesztőben azonnal látszik a Markdown kód és a Preview ablakkép is megkezdi a betöltését.

### Task 4: Publikus renderelés Frontend oldalon (`react-markdown`)
- **Agent:** `frontend-specialist`
- **Priority:** P2
- **Leírás:** A meglévő egyszerű szövegdarabolás lecserélése a `app/hirek/[slug]/page.tsx` fájlban a `react-markdown` csomagra. Képek esetén testreszabott renderer használata, amely a `next/image` beépített komponenst is felhasználhatja az optimalizációhoz (és biztonságosan kezeli a méretezéseket).
- **Input:** Nyers markdown szöveg az adatbázisból.
- **Output:** Valós HTML (`<h1>`, `<p>`, `<img>` / `<Image>`) renderelődés a felhasználók felé.
- **Verify:** A megírt cikk a rajta lévő beágyazott képekkel vizuálisan helyesen, reszponzívan és törésmentesen jelenik meg az oldalon.

---

## 🛑 Socratic Gate (Kérdések a User felé)
Mielőtt elindítod a fejlesztést, gondolj át pár kérdést:
1. Rendelkezel már a Cloudinary regisztrációval és a *Upload Preset* névvel, amit be tudsz állítani a `.env` fájlba, mikor a kód megkívánja?
2. Jelenleg a `react-markdown`-hoz engedélyezzük a HTML tagek beágyazását is (`rehypeRaw`), vagy maradjon szigorú Markdown?

---

## ✅ PHASE X: Végső Ellenőrzés (Verification Checklist)
- [ ] A `next-cloudinary` és `react-markdown` stabilan működik, nincsenek csomaghibák.
- [ ] Olyan cikk létrehozása során feltöltött kép megfelelően belekerül a Cloudinary tárhelybe.
- [ ] A kép linkje mentésre kerül az adatbázisba a cikk `content` mezejében (Markdownként).
- [ ] Cikk megtekintése frontend oldalon gyönyörűen jeleníti meg a tartalmat, design szétcsúszások nélkül.
- [ ] Next.js Build sikeresen lefut TypeScript típus hibák nélkül.
