import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function seed() {
  console.log("🌱 Seeding database...");

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "patch-notes" },
      update: {},
      create: { name: "Patch Notes", slug: "patch-notes", color: "#FF4655" },
    }),
    prisma.category.upsert({
      where: { slug: "hirek" },
      update: {},
      create: { name: "Hírek", slug: "hirek", color: "#ECE8E1" },
    }),
    prisma.category.upsert({
      where: { slug: "esport" },
      update: {},
      create: { name: "Esport", slug: "esport", color: "#00C4B4" },
    }),
    prisma.category.upsert({
      where: { slug: "tippek" },
      update: {},
      create: { name: "Tippek & Útmutatók", slug: "tippek", color: "#F4C430" },
    }),
  ]);

  console.log("✅ Categories created");

  // Admin user
  const hashedPassword = await bcrypt.hash("Admin123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@gamerhirek.hu" },
    update: {},
    create: {
      email: "admin@gamerhirek.hu",
      password: hashedPassword,
      name: "Admin",
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created");

  // Tags
  const tags = await Promise.all([
    prisma.tag.upsert({ where: { slug: "valorant" }, update: {}, create: { name: "Valorant", slug: "valorant" } }),
    prisma.tag.upsert({ where: { slug: "patch" }, update: {}, create: { name: "Patch", slug: "patch" } }),
    prisma.tag.upsert({ where: { slug: "meta" }, update: {}, create: { name: "Meta", slug: "meta" } }),
    prisma.tag.upsert({ where: { slug: "agent" }, update: {}, create: { name: "Agent", slug: "agent" } }),
    prisma.tag.upsert({ where: { slug: "verseny" }, update: {}, create: { name: "Verseny", slug: "verseny" } }),
  ]);

  console.log("✅ Tags created");

  // Articles
  const patchCategory = categories[0];
  const hirekCategory = categories[1];
  const esportCategory = categories[2];
  const tippekCategory = categories[3];

  const articles = [
    {
      title: "Valorant 10.04 Patch Notes — Clove és Vyse buffok, Phantom nerfelés",
      slug: "valorant-1004-patch-notes-clove-vyse-buff-phantom-nerf",
      excerpt: "A Riot Games kiadta a 10.04-es patch-et, amely jelentős változásokat hoz az ügynökök és a fegyverek egyensúlyában. Clove és Vyse erősödik, míg a Phantom gyengül.",
      content: `# Valorant 10.04 Patch Notes

A Riot Games ismét megmutatta, hogy nem fél a merész változtatásoktól. A 10.04-es patch az egyik legmeghatározóbb frissítés az elmúlt hónapokban.

## Ügynök Változások

### Clove — BUFF ✅

**Q képesség — Meddle:**
- A köd sebzése 30-ról **40-re** nőtt
- A hatékony sugár 5m-ről **6m-re** bővült

**E képesség — Pick-Me-Up:**
- Gyógyítás mértéke 50-ről **65-re** emelkedett
- Aktiválási ablak 3mp-ről **4mp-re** nőtt

### Vyse — BUFF ✅

**X végső képesség — Arc Rose:**
- Az ellenfelek lassulása 40%-ról **55%-ra** nőtt
- A végső aktiválási ideje 0.8mp-ről **0.6mp-re** csökkent

## Fegyver Változások

### Phantom — NERF ❌

A Phantom az egyik legtöbbet használt puska volt az elmúlt hónapokban. A Riot úgy döntött, hogy kisebb mértékben gyengíti annak hatékonyságát:

- **25m távolságon:** fejlövés multiplier 2.5x-ről **2.35x-re** csökkent
- **Első golyó pontossága** kissé romlott mozgás közben

### Sheriff — BUFF ✅

- Tár mérete 6-ról **8-ra** nőtt
- Árcsökkenés: 800 → **750 credit**

## Térkép Változások

**Ascent:** Az A Mid konténer területén kisebb látószögek kerültek módosításra, csökkentve az A Box dominanciáját.

## Fejlesztői Megjegyzések

> "Célunk, hogy a meta ne egy-két ügynök köré szűküljön. A Clove és Vyse erősítésével szeretnénk változatosabbá tenni a Controller és Sentinel választékot." — Riot Balance Team

---

*A patch március 19-én érhető el minden szerveren.*`,
      coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80",
      featured: true,
      categoryId: patchCategory.id,
      authorId: admin.id,
      tagIds: [tags[0].id, tags[1].id],
    },
    {
      title: "VCT 2026 EMEA — Natus Vincere legyőzte a Team Liquitot döntőben",
      slug: "vct-2026-emea-natus-vincere-vs-team-liquid-donto",
      excerpt: "Egy feszült, öt meccses sorozat végén a Natus Vincere megszerezte az EMEA regionális bajnoki címet, és kvótát kapott a VCT Masters tornára.",
      content: `# VCT 2026 EMEA Döntő: NaVi vs Liquid

A Barcelona-i Palau Sant Jordi telt ház előtt rendezték meg az EMEA régió egyik legnagyobb eseményét.

## Meccs Összefoglaló

Az 5 meccses döntő mindkét csapat szívéhez közel állt. A Natus Vincere erőltetett menetben jutott el idáig, míg a Team Liquid viszonylag könnyen vette az akadályokat az alsó ágon.

### Rezultátum: NaVi 3 — 2 Liquid

| Meccs | Térkép | Eredmény |
|-------|--------|----------|
| 1. meccs | Ascent | NaVi 13-9 |
| 2. meccs | Lotus | Liquid 13-7 |
| 3. meccs | Icebox | NaVi 13-11 |
| 4. meccs | Haven | Liquid 13-10 |
| 5. meccs | Pearl | NaVi 13-8 |

## A Döntő Legjobb Játékosa

**d3ffo (NaVi)** — ACS: 287, K/D: 1.47, KAST: 82%

A norvég AWP-s egész tornán dominált, és a döntőben is ő volt a csapat gerince, különösen a Pearl-ön nyújtott teljesítmény kiemelkedő volt.

## A Masters Kvóta

A győzelemmel a NaVi biztosította helyét a São Paulo-i VCT Mastersin, ahol az összes régió legjobb csapatai mérik össze tudásukat.`,
      coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
      featured: false,
      categoryId: esportCategory.id,
      authorId: admin.id,
      tagIds: [tags[0].id, tags[4].id],
    },
    {
      title: "5 tipp kezdőknek: Így tanuld meg a Valorant alapjait gyorsan",
      slug: "5-tipp-kezdoknek-valorant-alapok-gyorsan",
      excerpt: "Frissen kezdted a Valorant-ot, és nem tudod, hol kezdj? Összegyűjtöttük az 5 legfontosabb tippet, amelyek segítségével gyorsabban fejlődsz.",
      content: `# 5 Tipp Valorant Kezdőknek

Mindenki valahol kezdi. Ezek a tippek sokat fognak segíteni az első lépéseknél.

## 1. Tanulj meg helyesen célozni

Az aim a Valorant alapja. Célozz mindig fejmagasságra — ez az egyik legfontosabb alapelv, amit el kell sajátítanod.

**Crosshair placement:** Tartsd az egered ott, ahol az ellenfelek feje várható. Ne a talajra nézz!

## 2. Ismerd meg a mozgás és lövés kapcsolatát

Mozgás közben lőni szinte mindig hiba. Állj meg, majd lőj. A precizitás fontosabb a sebességnél.

## 3. Válassz egy egyszerű ügynököt

Kezdőknek az alábbi ügynökök ajánlottak:
- **Brimstone** — Egyszerű smoke-ok, könnyen kezelhető végső képesség
- **Sage** — Gyógyítás, falak, csak a szerepkört kell megérteni
- **Reyna** — Agresszív játékstílus, öngyógyítás ölések után

## 4. Kommunikálj a csapatoddal

Jelentsd az ellenfelek pozícióját. Még ha nincs mikrofonod, a pingrendszer nagyszerű eszköz.

## 5. Nézz oktatóvideókat

A YouTube és a Twitch tele van oktatótartalommal. Figyeld a magas szinten játszókat — rengeteget tanulhatsz tőlük.`,
      coverImage: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&q=80",
      featured: false,
      categoryId: tippekCategory.id,
      authorId: admin.id,
      tagIds: [tags[0].id, tags[2].id],
    },
    {
      title: "Riot Games bejelentett egy új Valorant ügynököt: Ismerkedj meg Korrával",
      slug: "riot-games-uj-valorant-ugynok-korra-bejelentes",
      excerpt: "A Riot Games bejelentette a következő Valorant ügynököt: Korra, egy indonéziai Duelist, aki elektromos alapú képességekkel rendelkezik.",
      content: `# Korra — Az Új Valorant Duelist

A Riot Games ma reggel official trailer formájában mutatta be a legújabb ügynöket: **Korrát**, aki az indonéziai őserdők energiáját hasznosítja harci képességeiben.

## Korra Képességei (Előzetes)

### C — Static Field
Helyez el terepen egy elektromos csapdát. Ha ellenfél lép rá, az egész csapatnak küld egy hangjelzést, és az ellenfélen 15 sebzés keletkezik.

### Q — Chain Lightning  
Korra egy elektromos lövedéket tölt fel és lő ki, amely max. 2 ellenséges célpontot ugrik át.

### E — Grounded
Korra egy rövid ideig önmagát "földeli" — ebben az időszakban a rajta ütő villamos képességek hatástalanok.

### X — Thunderstrike (végső)
Nagy területen egy villámcsapást idéz elő, amely mindenkit a területen megbénít 1 másodpercre és 60 sebzést okoz.

## Megjelenési Dátum

Korra a **10.06-os patch-ben** válik elérhetővé, várhatóan **április 22-én**.

## A Közösség Reakciója

A trailer rengeteg érdeklődést váltott ki. A Valorant subredditen az első 3 órában 45 000 upvote gyűlt össze.`,
      coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80",
      featured: false,
      categoryId: hirekCategory.id,
      authorId: admin.id,
      tagIds: [tags[0].id, tags[3].id],
    },
    {
      title: "Valorant 10.03 Patch Notes — Neon rework, Breeze térkép változások",
      slug: "valorant-1003-patch-notes-neon-rework-breeze-valtozasok",
      excerpt: "A 10.03-as patch az egyik legjelentősebb Neon változást hozza a megjelenése óta, plusz komoly Breeze térkép módosítások.",
      content: `# Valorant 10.03 Patch Notes

## A Nagy Neon Rework

A Neon ügynök alaposan megváltozott ebben a patchben. A Riot beismerte, hogy az ügynök képességei nem illeszkedtek megfelelően a Valorant irányítási rendszerébe.

### C — Fast Lane
- Teljes rework: most csak 1 sávot hoz létre, de az jóval hosszabb és gyorsabb, és az ellenfélnek okoz 15 sebzést, ha átmegy rajta

### Q — Relay Bolt
- A villanás sugara 3m-ről **4.5m-re** nőtt
- A megbénítás ideje 1.5mp-ről **2mp-re** nőtt

### E — High Gear
- Sprintsebesség csökkent (-5%)
- Az új slide távolság +1m

### X — Overdrive  
- Lézersugár szélesebb, de **sebzése 20-ról 17-re csökkent** találatonként

## Breeze Térkép Változások

A Breeze komoly face-lift-et kapott. A legfontosabb módosítások:

- **Mid:** A két egymást szembeölelő boxot távolabb helyezték egymástól
- **A Hall:** Szűkebb lett, csökkentve az AWP dominanciát
- **B Site:** Egy új fedezék jelent meg a platform közelében

---

*A patch elérhető PC-n, Playstation-ön és Xboxon.*`,
      coverImage: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=1200&q=80",
      featured: false,
      categoryId: patchCategory.id,
      authorId: admin.id,
      tagIds: [tags[0].id, tags[1].id, tags[2].id],
    },
  ];

  for (const articleData of articles) {
    const { tagIds, ...data } = articleData;
    await prisma.article.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        tags: {
          create: tagIds.map((tagId) => ({ tagId })),
        },
      },
    });
  }

  console.log("✅ Articles seeded");
  console.log("🎉 Seeding complete!");
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
