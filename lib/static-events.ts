import { events } from '@/lib/constants';
import type { EventItem } from '@/lib/constants';
import type { IEvent } from '@/lib/types';

const DEFAULT_AGENDA = ['Registration & coffee', 'Keynote', 'Sessions & workshops', 'Networking'];
const DEFAULT_TAGS = ['conference', 'tech', 'developer'];
const DEFAULT_ORGANIZER = 'Dev Events Team';
const DEFAULT_AUDIENCE = 'Developers & technologists';
const FALLBACK_DATE = new Date(0);

function mapStaticToIEvent(item: EventItem): IEvent {
  const mode = item.location.toLowerCase().includes('hybrid') ? 'hybrid' : 'offline';
  return {
    id: item.slug,
    title: item.title,
    slug: item.slug,
    description: `${item.title} brings together developers and technologists for talks, workshops, and networking.`,
    overview: `Join us for ${item.title} — a premier event in ${item.location}.`,
    image: item.image,
    venue: item.location,
    location: item.location,
    date: item.date,
    time: item.time,
    mode,
    audience: DEFAULT_AUDIENCE,
    agenda: DEFAULT_AGENDA,
    organizer: DEFAULT_ORGANIZER,
    tags: DEFAULT_TAGS,
    createdAt: FALLBACK_DATE,
    updatedAt: FALLBACK_DATE,
  };
}

export function getStaticEvents(): IEvent[] {
  return events.map(mapStaticToIEvent);
}

export function getStaticEventBySlug(slug: string): IEvent | null {
  const sanitized = slug.trim().toLowerCase();
  const item = events.find((e) => e.slug.toLowerCase() === sanitized);
  return item ? mapStaticToIEvent(item) : null;
}

export function getStaticSimilarEvents(slug: string): IEvent[] {
  const current = getStaticEventBySlug(slug);
  if (!current) return [];
  return events
    .filter((e) => e.slug.toLowerCase() !== slug.trim().toLowerCase())
    .map(mapStaticToIEvent);
}
