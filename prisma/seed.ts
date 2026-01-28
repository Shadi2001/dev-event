import { PrismaClient } from '@prisma/client';
import { events } from '../lib/constants';

const prisma = new PrismaClient();

function defaults(item: { title: string; slug: string; location: string; date: string; time: string; image: string }) {
  return {
    title: item.title,
    slug: item.slug,
    description: `${item.title} brings together developers and technologists for talks, workshops, and networking.`,
    overview: `Join us for ${item.title} — a premier event in ${item.location}.`,
    image: item.image,
    venue: item.location,
    location: item.location,
    date: item.date,
    time: item.time,
    mode: item.location.toLowerCase().includes('hybrid') ? 'hybrid' : 'offline',
    audience: 'Developers & technologists',
    agenda: JSON.stringify(['Registration & coffee', 'Keynote', 'Sessions & workshops', 'Networking']),
    organizer: 'Dev Events Team',
    tags: JSON.stringify(['conference', 'tech', 'developer']),
  };
}

async function main() {
  await prisma.booking.deleteMany();
  await prisma.event.deleteMany();

  for (const e of events) {
    await prisma.event.create({ data: defaults(e) });
  }

  console.log(`Seeded ${events.length} events.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
