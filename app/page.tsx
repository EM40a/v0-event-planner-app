"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/header"
import { EventList } from "@/components/event-list"
import { GuestDrawer } from "@/components/guest-drawer"
import { AddEventDialog } from "@/components/add-event-dialog"
import { createClient } from "@/lib/supabase/client"
import type { Event, Guest, EventWithAttendees, EventAttendee } from "@/lib/types"

export default function EventPlanner() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [guests, setGuests] = useState<Guest[]>([])
  const [events, setEvents] = useState<EventWithAttendees[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  const fetchData = useCallback(async () => {
    setIsLoading(true)

    const [guestsRes, eventsRes, attendeesRes] = await Promise.all([
      supabase.from("guests").select("*").order("created_at", { ascending: true }),
      supabase.from("events").select("*").order("created_at", { ascending: true }),
      supabase.from("event_attendees").select("*"),
    ])

    if (guestsRes.data) setGuests(guestsRes.data)

    if (eventsRes.data && attendeesRes.data) {
      const eventsWithAttendees: EventWithAttendees[] = eventsRes.data.map((event: Event) => {
        const eventAttendees = attendeesRes.data.filter((a: EventAttendee) => a.event_id === event.id)
        const attendeesMap: Record<string, boolean> = {}
        eventAttendees.forEach((a: EventAttendee) => {
          attendeesMap[a.guest_id] = a.is_attending
        })
        return { ...event, attendees: attendeesMap }
      })
      setEvents(eventsWithAttendees)
    }

    setIsLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  const toggleAttendance = async (eventId: string, guestId: string) => {
    const event = events.find((e) => e.id === eventId)
    if (!event) return

    const currentStatus = event.attendees[guestId] ?? false
    const newStatus = !currentStatus

    // Optimistic update
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, attendees: { ...e.attendees, [guestId]: newStatus } } : e)),
    )

    // Update in database
    await supabase
      .from("event_attendees")
      .update({ is_attending: newStatus })
      .eq("event_id", eventId)
      .eq("guest_id", guestId)
  }

  const updateEventCost = async (eventId: string, cost: number) => {
    setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, total_cost: cost } : event)))

    await supabase.from("events").update({ total_cost: cost }).eq("id", eventId)
  }

  const addGuest = async (name: string) => {
    const { data: newGuest, error } = await supabase.from("guests").insert({ name }).select().single()

    if (error || !newGuest) return

    setGuests((prev) => [...prev, newGuest])

    // Add new guest to all existing events as not attending
    const attendeeInserts = events.map((event) => ({
      event_id: event.id,
      guest_id: newGuest.id,
      is_attending: false,
    }))

    if (attendeeInserts.length > 0) {
      await supabase.from("event_attendees").insert(attendeeInserts)
    }

    setEvents((prev) =>
      prev.map((event) => ({
        ...event,
        attendees: { ...event.attendees, [newGuest.id]: false },
      })),
    )
  }

  const editGuest = async (id: string, name: string) => {
    setGuests((prev) => prev.map((guest) => (guest.id === id ? { ...guest, name } : guest)))
    await supabase.from("guests").update({ name }).eq("id", id)
  }

  const deleteGuest = async (id: string) => {
    setGuests((prev) => prev.filter((guest) => guest.id !== id))
    setEvents((prev) =>
      prev.map((event) => {
        const { [id]: _, ...remainingAttendees } = event.attendees
        return { ...event, attendees: remainingAttendees }
      }),
    )

    await supabase.from("event_attendees").delete().eq("guest_id", id)
    await supabase.from("guests").delete().eq("id", id)
  }

  const addEvent = async (eventData: { title: string; time: string; location: string; totalCost: number }) => {
    const { data: newEvent, error } = await supabase
      .from("events")
      .insert({
        title: eventData.title,
        time: eventData.time,
        location: eventData.location,
        total_cost: eventData.totalCost,
      })
      .select()
      .single()

    if (error || !newEvent) return

    // Add all guests as attendees (not attending by default)
    const attendeeInserts = guests.map((guest) => ({
      event_id: newEvent.id,
      guest_id: guest.id,
      is_attending: false,
    }))

    if (attendeeInserts.length > 0) {
      await supabase.from("event_attendees").insert(attendeeInserts)
    }

    const attendeesMap: Record<string, boolean> = {}
    guests.forEach((guest) => {
      attendeesMap[guest.id] = false
    })

    setEvents((prev) => [...prev, { ...newEvent, attendees: attendeesMap }])
  }

  const deleteEvent = async (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
    await supabase.from("event_attendees").delete().eq("event_id", eventId)
    await supabase.from("events").delete().eq("id", eventId)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onOpenGuestDrawer={() => setIsDrawerOpen(true)}
        onOpenAddEvent={() => setIsAddEventOpen(true)}
      />
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <EventList
          events={events}
          guests={guests}
          onToggleAttendance={toggleAttendance}
          onUpdateCost={updateEventCost}
          onDeleteEvent={deleteEvent}
        />
      </main>
      <GuestDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        guests={guests}
        onAddGuest={addGuest}
        onEditGuest={editGuest}
        onDeleteGuest={deleteGuest}
      />
      <AddEventDialog isOpen={isAddEventOpen} onClose={() => setIsAddEventOpen(false)} onAddEvent={addEvent} />
    </div>
  )
}
