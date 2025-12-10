export interface Guest {
  id: string
  name: string
  created_at?: string
}

export interface Event {
  id: string
  title: string
  event_date: string
  time: string
  location: string
  total_cost: number
  created_at?: string
}

export interface EventAttendee {
  id: string
  event_id: string
  guest_id: string
  is_attending: boolean
}

export interface EventWithAttendees extends Event {
  attendees: Record<string, boolean>
}
