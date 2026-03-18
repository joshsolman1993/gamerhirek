const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function seedPoll() {
  const existing = await db.poll.findFirst({ where: { active: true } });
  if (existing) {
    console.log('Poll already exists:', existing.question);
    return;
  }
  const poll = await db.poll.create({
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
  console.log('Poll seeded:', poll.id);
}

seedPoll()
  .then(() => db.$disconnect())
  .catch((e) => { console.error(e); db.$disconnect(); process.exit(1); });
