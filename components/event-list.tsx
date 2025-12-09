"use client"

import { EventCard } from "@/components/event-card"
import type { EventWithAttendees, Guest } from "@/lib/types"

interface EventListProps {
  events: EventWithAttendees[]
  guests: Guest[]
  onToggleAttendance: (eventId: string, guestId: string) => void
  onUpdateCost: (eventId: string, cost: number) => void
  onDeleteEvent: (eventId: string) => void
}

export function EventList({ events, guests, onToggleAttendance, onUpdateCost, onDeleteEvent }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground text-lg">No hay eventos programados</p>
        <p className="text-muted-foreground text-sm mt-1">Toca el botón + para agregar uno</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          guests={guests}
          onToggleAttendance={onToggleAttendance}
          onUpdateCost={onUpdateCost}
          onDeleteEvent={onDeleteEvent}
        />
      ))}
    </div>
  )
}
