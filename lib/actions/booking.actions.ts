'use server';

import { prisma } from '@/lib/prisma';

export async function createBooking({
  eventId,
  email,
}: {
  eventId: string;
  slug: string;
  email: string;
}) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return { success: false };
    }

    await prisma.booking.create({
      data: { eventId, email },
    });

    return { success: true };
  } catch (e) {
    console.error('create booking failed', e);
    return { success: false };
  }
}
