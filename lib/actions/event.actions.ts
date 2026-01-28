'use server';

import { prisma } from '@/lib/prisma';
import { mapEventToIEvent } from '@/lib/db-utils';
import type { IEvent } from '@/lib/types';
import {
  getStaticEvents,
  getStaticEventBySlug,
  getStaticSimilarEvents,
} from '@/lib/static-events';

export async function getEvents(): Promise<IEvent[]> {
  try {
    const list = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (list.length > 0) return list.map(mapEventToIEvent);
  } catch {
    /* DB unavailable, use static fallback */
  }
  return getStaticEvents();
}

export async function getEventBySlug(slug: string): Promise<IEvent | null> {
  try {
    const sanitized = slug.trim().toLowerCase();
    const event = await prisma.event.findUnique({
      where: { slug: sanitized },
    });
    if (event) return mapEventToIEvent(event);
  } catch {
    /* DB unavailable, use static fallback */
  }
  return getStaticEventBySlug(slug);
}

export async function getSimilarEventsBySlug(slug: string): Promise<IEvent[]> {
  try {
    const sanitized = slug.trim().toLowerCase();
    const event = await prisma.event.findUnique({
      where: { slug: sanitized },
    });

    if (event) {
      const tags = JSON.parse(event.tags) as string[];
      if (tags.length > 0) {
        const others = await prisma.event.findMany({
          where: { id: { not: event.id } },
        });
        const similar = others.filter((e) => {
          const t = JSON.parse(e.tags) as string[];
          return t.some((tag) => tags.includes(tag));
        });
        return similar.map(mapEventToIEvent);
      }
    }
  } catch {
    /* DB unavailable, use static fallback */
  }
  return getStaticSimilarEvents(slug);
}

export async function getBookingCount(eventId: string): Promise<number> {
  try {
    return await prisma.booking.count({
      where: { eventId },
    });
  } catch {
    return 0;
  }
}
