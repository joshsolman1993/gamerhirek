# GamerHírek

> Next.js 15 (App Router) alapú, gamifikált e-sport és hírportál webalkalmazás, beépített közösségi funkciókkal és komplex adminisztrációs panellel.

## 🚀 Quick Start (Gyorsindítás)

A projekt futtatásához szükséges minimális lépések:

1. **Függőségek telepítése:**
   ```bash
   npm install
   ```
2. **Környezeti változók beállítása:**
   Másold le a `.env.example` fájlt `.env` néven, és töltsd ki az adatokat (pl. Neon Postgres URL-ek, Auth Secret):
   ```bash
   cp .env.example .env
   ```
3. **Adatbázis sémák szinkronizálása és adatok seedelése:**
   ```bash
   npm run db:push
   npm run db:seed
   ```
4. **Fejlesztői szerver indítása (Turbopack támogatással a gyors töltéshez):**
   ```bash
   npm run dev
   ```
   A felület a `http://localhost:3000` címen lesz elérhető.

## ✨ Features (Funkciók)

- **Tartalomkezelő Rendszer (CMS):** Teljes körű Markdown-alapú cikkírás (`@uiw/react-md-editor`), publikálás, kategorizálás és címkézés (Tags).
- **Gamifikáció (XP & Szintlépés):** A felhasználók interakciókért (komment, napi kvíz, cikk olvasás) XP-t szereznek, mellyel növelhetik a szintjüket ("Level calculation").
- **Közösségi Élet:**
  - Hozzászólási lehetőség a cikkek alatt.
  - Globális Chatroom és LFG (Looking for Group) játéktárs-kereső felület.
  - Push-szerű belső értesítési rendszer (`Notification`).
- **Napi Aktivitások (Retenció növelése):** Interaktív napi kvízek és E-sport Tippmix/Pick'em (`Match`, `Prediction`).
- **Összetett Adminisztrációs Panel:**
  - Különálló, middleware-rel védett `/admin` felület.
  - Cikkek, Kvízek, kategóriák, Tagek CRUD kezelése (Drag & Drop UI támogatással).
  - Fejlett adatvizualizáció `Recharts`-szal (Felhasználói statisztikák, napi nézettség, top cikkek).
  - Moderációs eszközök (Felhasználók tiltása, spamek törlése, automatikus vagy kézi XP módosítás).
- **E-Sport Integráció (Valorant):** A Henrik API-ra támaszkodva profi színterek (pro-scene), e-sport események és friss hírek követése.

## ⚙️ Configuration (Konfiguráció)

A működéshez szükséges környezeti változók (a `.env` fájlban):

| Változó | Leírás | Alapértelmezett |
|---------|--------|-----------------|
| `DATABASE_URL` | Neon PostgreSQL pooled connection string (Tranzakciókhoz) | - |
| `DIRECT_URL` | Neon PostgreSQL direct connection (Migrációhoz/Prisma-hoz) | - |
| `AUTH_SECRET` | Biztonságos JWT session generáláshoz (min 32 karakter) | - |
| `HENRIK_API_KEY` | E-sport adatok (Valorant) lekéréséhez (`henrikdev.xyz`) | - |
| `ADMIN_PASSWORD` | Kezdeti DB seedeléskor létrehozott admin fiók jelszava | `ErosJelszo2026!` |

## 📚 Documentation (Dokumentáció & Tervek)

A projekthez kapcsolódó további tervezési és fejlesztési dokumentációk, illetve kontextus-fájlok a következő helyeken találhatók:

- [LLMs Context Map (Adatbázis sémák és architektúra)](./llms.txt)
- [Admin UI Terv (Phase 6)](./PLAN-phase-6-admin-ui.md)
- [Adminisztációs Panel Terv (Phase 7)](./PLAN-phase-7-admin-panel.md)
- [Közösségi funkciók Terv (Phase 8)](./PLAN-phase-8-community.md)

## 🤝 Contributing (Közreműködés)

1. Válassz egy nyitott feature-t a `PLAN-*.md` dokumentumokból vagy hozz létre egy új Issue-t.
2. Formázz és lintelj minden kódot commit előtt: `npm run lint`.
3. Adatbázis séma változtatásainál ne felejtsd el futtatni a `npm run db:push` / `npx prisma generate` parancsokat, és frissíteni az `llms.txt` dokumentumot!

## 📄 License (Licenc)

MIT
