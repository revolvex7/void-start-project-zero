import { Event } from '@/types/event';

export const staticEvents: Event[] = [
  {
    id: 'event-1',
    name: 'Live Q&A Session',
    description: 'Join me for an exclusive live Q&A where I answer your burning questions!',
    mediaUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    eventDate: '2024-02-15T18:00:00Z',
    creatorId: 'creator-1',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'event-2',
    name: 'Workshop: Digital Art Basics',
    description: 'Learn the fundamentals of digital art in this hands-on workshop.',
    mediaUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop',
    eventDate: '2024-02-20T14:00:00Z',
    creatorId: 'creator-1',
    createdAt: '2024-01-20T14:00:00Z'
  },
  {
    id: 'event-3',
    name: 'Community Meetup',
    description: 'Meet fellow fans and connect with the community in person!',
    mediaUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
    eventDate: '2024-02-25T16:00:00Z',
    creatorId: 'creator-1',
    createdAt: '2024-01-25T18:00:00Z'
  }
];
