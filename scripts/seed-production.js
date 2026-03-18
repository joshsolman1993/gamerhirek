/**
 * Production seed script — futtatás: node scripts/seed-production.js
 * Ez létrehozza az admin felhasználót és az alap kategóriákat.
 * Az EN_SECRET és DATABASE_URL env változóknak be kell lenni állítva.
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const db = new PrismaClient();

async function seed() {
  console.log('🌱 Seedelés indul...');

  // 1. Admin user
  const existingAdmin = await db.user.findUnique({ where: { email: 'admin@gamerhirek.hu' } });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Valorant2026!', 12);
    await db.user.create({
      data: {
        email: 'admin@gamerhirek.hu',
        name: 'Admin',
        password: hashed,
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin user létrehozva: admin@gamerhirek.hu');
  } else {
    console.log('ℹ️  Admin user már létezik');
  }

  // 2. Kategóriák
  const categories = [
    { name: 'Hírek',             slug: 'hirek',             color: '#FF4655' },
    { name: 'Esport',            slug: 'esport',            color: '#00C4B4' },
    { name: 'Patch Notes',       slug: 'patch-notes',       color: '#FFB800' },
    { name: 'Tippek & Útmutatók', slug: 'tippek-utmutatek', color: '#00C4B4' },
  ];

  for (const cat of categories) {
    await db.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Kategóriák létrehozva');

  // 3. Napi Poll
  const existingPoll = await db.poll.findFirst({ where: { active: true } });
  if (!existingPoll) {
    await db.poll.create({
      data: {
        question: 'Ki a legjobb Agent a jelenlegi Valorant metában?',
        options: {
          create: [
            { label: 'Clove' },
            { label: 'Vyse' },
            { label: 'Jett' },
            { label: 'Fade' },
          ],
        },
      },
    });
    console.log('✅ Napi poll létrehozva');
  } else {
    console.log('ℹ️  Poll már létezik');
  }

  console.log('\n🎉 Seed kész! Következő lépés: hozz létre cikkeket az admin panelen.');
}

seed()
  .then(() => db.$disconnect())
  .catch((e) => {
    console.error('❌ Seed hiba:', e);
    db.$disconnect();
    process.exit(1);
  });
