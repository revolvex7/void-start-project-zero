export interface Event {
  id: string;
  name: string;
  description?: string;
  mediaUrl?: string;
  eventDate?: string;
  creatorId: string;
  createdAt: string;
  liveStreamLink?: string;
  isFree?: boolean;
  memberShipId?: string;
}

export interface EventInterest {
  eventId: string;
  userId: string;
  isInterested: boolean;
}
