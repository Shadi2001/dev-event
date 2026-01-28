'use server';

import { prisma } from '@/lib/prisma';
import { mapEventToIEvent } from '@/lib/db-utils';
import type { IEvent } from '@/lib/types';

export async function getEvents(): Promise<IEvent[]> {
  try {
    const list = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return list.map(mapEventToIEvent);
  } catch {
    return [];
  }
}

export async function getEventBySlug(slug: string): Promise<IEvent | null> {
  try {
    const sanitized = slug.trim().toLowerCase();
    const event = await prisma.event.findUnique({
      where: { slug: sanitized },
    });
    return event ? mapEventToIEvent(event) : null;
  } catch {
    return null;
  }
}

export async function getSimilarEventsBySlug(slug: string): Promise<IEvent[]> {
  try {
    const event = await prisma.event.findUnique({
      where: { slug },
    });

    if (!event) return [];

    const tags = JSON.parse(event.tags) as string[];
    if (!tags.length) return [];

    const others = await prisma.event.findMany({
      where: { id: { not: event.id } },
    });

    const similar = others.filter((e) => {
      const t = JSON.parse(e.tags) as string[];
      return t.some((tag) => tags.includes(tag));
    });

    return similar.map(mapEventToIEvent);
  } catch {
    return [];
  }
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
