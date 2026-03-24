# Phase 12: Quality of Life & Bugfix Sprint

## 1. Overview (Áttekintés)
A projekt egy külsős fejlesztői kódrevízió (audit) alapján felgyülemlett technikai adósságok és funkcionális hiányosságok (bugok, vakvágányok) javítására fókuszál. A cél a felhasználói élmény optimalizálása, a kód duplikációjának csökkentése (DRY elv), és a már beépített (de még izolált) funkciók teljes integrálása.

## 2. Project Type
**WEB** (Next.js, Prisma, Fullstack Refactoring)

## 3. Scope & Priorities (Problem / Solution)

### P0: Blocker & Típus Hibák (Kritikus javítások)
1. **Match Status eltérés (UPCOMING vs SCHEDULED):**
   - *Probléma:* Az `actions/admin.ts` a `createMatch` során `UPCOMING` státusszal menti a meccset, de a Pick'em logika és a Prisma default érték `SCHEDULED`-et vár.
   - *Megoldás:* Egységesíteni a Enum-szerű Stringet. Mindenhol egységesen `SCHEDULED` státuszt kell használni.
2. **Hibás Login Redirectek:**
   - *Probléma:* A frontend oldalak (pl. Shop, Chat, Profil) egy middleware hiányában (vagy direktből) az `/admin/login` oldalra irányítják a sima usert a saját bejelentkezési kapu `/login` helyett.
   - *Megoldás:* Auth guardok és fallback route-ok javítása az egész appban (keresés `/admin/login`-ra és átírása auth modalra vagy megfelelő user loginra).

### P1: Funkcionális hiányosságok (User Flow javítások)
3. **Hiányzó Hír Archívum (`/hirek`):**
   - *Probléma:* A főoldal hivatkozik rá, de jelenleg az `app/hirek/page.tsx` nem létezik egy dedikált cikk-listázóként.
   - *Megoldás:* Létrehozni az oldalt, ami paginálva megjeleníti a cikkeket kategória/dátum szűréssel.
4. **XP Rendszer Centralizálása (DRY Elv):**
   - *Probléma:* Cikkírás, Quiz kitöltés, Pick'em jóslatok és Shop logika is elszórva osztja az XP-t (`db.user.update` fragmentek), ami sebezhető és karbantarthatatlan.
   - *Megoldás:* Egy globális `awardXP` function létrehozása a `lib/xp.ts`-ben (ami lekezeli a Szintlépést is!), és az Action fájlok refaktorálása ezen metódus használatára.

### P2: Jövőbeli és Befejezetlen Fejlesztések
5. **A Csatolt Shop Készlet Vizualizációja:**
   - *Probléma:* A GamerCoin-ért megvett tárgyak láthatatlanok a profilban és a közösségi oldalakon.
   - *Megoldás:* Ha valaki Chat emojit vett, akkor azt tudja használni a globális chaten; ha "kitűzőt", az jelenjen meg a Profil headerjében / LFG hirdetésnél.
6. **Tier List App Perzisztenciája:**
   - *Probléma:* A Tier List Builder jelenleg egy statikus "homokozó", a mentés gomb nem csinál semmit.
   - *Megoldás:* Új (opcionális) `TierList` adatbázis séma bevezetése, egyedi shareable linkek (URL UUID alapján) generálásával.
7. **Pro Scene Valós Adatok:**
   - *Probléma:* Jelenleg mock adatokból táplálkozik a pro-scene.
   - *Megoldás:* Bevezetni a Pandascore API-t vagy más szabad esport API-t az élő meccsekhez, *vagy* - ha ez túl költséges/bonyolult egyelőre - egyértelműen meghagyni Admin felületből vezérelhetőként a meccseket, csak kivenni a backend fájlból beégetett dummy data listát.

## 4. Task Breakdown & Agent Assignments

### T1: Állapot és Redirect Bugok Fixálása (P0)
- **Agent:** `backend-specialist`
- **Focus:** Kijavítani a státuszokat az adminban és lecserélni a login hardcoded linkeket az app routerben. Erős search & replace az `/admin/login`-okra.

### T2: XP Centralizáció (P1)
- **Agent:** `backend-specialist`
- **Focus:** A `lib/xp.ts` újraírása. Tranzakcióbiztos `grantExperience` metódus implementálása, a quiz/admin/economy fájlok átszövése ezzel.

### T3: Hírek listázó oldal (`/hirek`) és Tierlist Mentés implementálása (P1)
- **Agent:** `frontend-specialist`, `database-architect`
- **Focus:** Tierlist Prisma Modell készítése, majd a frontend Page-ek legenerálása. A `/hirek` mappa feltöltése elegáns layouttal.

### T4: Virtuális Bolti Elemek aktiválása az UI-n (P2)
- **Agent:** `frontend-specialist`
- **Focus:** A Profil nézet (`app/profil`) bővítése egy "Inventory" (Táska) szekcióval, hogy a megvett relikviákat vizuálisan érvényesítse az oldal.

## 5. Phase X: Verification Checklist
- [ ] A Hírek (`/hirek`) route elérhető, és a meglévő cikkek megjelennek.
- [ ] Meccs lézerhozásakor az Admin felületről biztosan `SCHEDULED` állapot jön létre.
- [ ] Egyetlen oldal sem irányít vissza automatikusan az `/admin/login`-ra, csak ha valóban az `/admin` felületére próbálunk belépni. Miden más helyen `/login` van.
- [ ] Az `awardXp` refaktor nem okozott TypeScript build type error-okat (Tesztelve: `npm run lint`).
- [ ] A backend biztonsági metrika változatlanul erős (`security_scan.py`).
