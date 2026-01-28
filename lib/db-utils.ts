import type { Event } from '@prisma/client';
import type { IEvent } from './types';

export function mapEventToIEvent(e: Event): IEvent {
  return {
    id: e.id,
    title: e.title,
    slug: e.slug,
    description: e.description,
    overview: e.overview,
    image: e.image,
    venue: e.venue,
    location: e.location,
    date: e.date,
    time: e.time,
    mode: e.mode,
    audience: e.audience,
    agenda: JSON.parse(e.agenda) as string[],
    organizer: e.organizer,
    tags: JSON.parse(e.tags) as string[],
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  };
}
