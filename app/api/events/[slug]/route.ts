import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { mapEventToIEvent } from '@/lib/db-utils';

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(req: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { slug } = await params;

    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json(
        { message: 'Invalid or missing slug parameter' },
        { status: 400 }
      );
    }

    const sanitizedSlug = slug.trim().toLowerCase();

    const event = await prisma.event.findUnique({
      where: { slug: sanitizedSlug },
    });

    if (!event) {
      return NextResponse.json(
        { message: `Event with slug '${sanitizedSlug}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Event fetched successfully', event: mapEventToIEvent(event) },
      { status: 200 }
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching event by slug:', error);
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { message: 'Failed to fetch event', error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
