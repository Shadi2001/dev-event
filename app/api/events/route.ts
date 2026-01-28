import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

import { prisma } from '@/lib/prisma';
import { mapEventToIEvent } from '@/lib/db-utils';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    let event: Record<string, unknown>;

    try {
      event = Object.fromEntries(formData.entries()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ message: 'Invalid JSON data format' }, { status: 400 });
    }

    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ message: 'Image file is required' }, { status: 400 });
    }

    const tags = JSON.parse((formData.get('tags') as string) ?? '[]') as string[];
    const agenda = JSON.parse((formData.get('agenda') as string) ?? '[]') as string[];

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {
          if (error) return reject(error);
          resolve(results!);
        })
        .end(buffer);
    });

    const created = await prisma.event.create({
      data: {
        title: event.title as string,
        slug: (event.slug as string) ?? '',
        description: (event.description as string) ?? '',
        overview: (event.overview as string) ?? '',
        image: uploadResult.secure_url,
        venue: (event.venue as string) ?? '',
        location: (event.location as string) ?? '',
        date: (event.date as string) ?? '',
        time: (event.time as string) ?? '',
        mode: (event.mode as string) ?? 'offline',
        audience: (event.audience as string) ?? '',
        agenda: JSON.stringify(agenda),
        organizer: (event.organizer as string) ?? '',
        tags: JSON.stringify(tags),
      },
    });

    return NextResponse.json(
      { message: 'Event created successfully', event: mapEventToIEvent(created) },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknown' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const list = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const events = list.map(mapEventToIEvent);

    return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { message: 'Event fetching failed', error: String(e) },
      { status: 500 }
    );
  }
}
