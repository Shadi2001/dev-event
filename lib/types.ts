// API response shapes (replaces Mongoose IEvent / IBooking)

export interface IEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IBooking {
  id: string;
  eventId: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
