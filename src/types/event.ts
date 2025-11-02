export interface Event {
  id: string;
  name: string;
  description?: string;
  mediaUrl?: string;
  eventDate?: string;
  creatorId: string;
  createdAt: string;
}

export interface EventInterest {
  eventId: string;
  userId: string;
  isInterested: boolean;
}
