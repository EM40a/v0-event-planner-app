"use client"

import { useMemo } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin } from "lucide-react"
import type { EventWithAttendees } from "@/lib/types"

interface CalendarDrawerProps {
  isOpen: boolean
  onClose: () => void
  events: EventWithAttendees[]
}

type EventStatus = "past" | "today" | "future"

interface EventWithStatus extends EventWithAttendees {
  status: EventStatus
}

export function CalendarDrawer({ isOpen, onClose, events }: CalendarDrawerProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const getEventStatus = (eventDate: string): EventStatus => {
    const date = new Date(eventDate + "T00:00:00")
    date.setHours(0, 0, 0, 0)

    if (date.getTime() < today.getTime()) return "past"
    if (date.getTime() === today.getTime()) return "today"
    return "future"
  }

  const eventsWithStatus: EventWithStatus[] = useMemo(() => {
    return events
      .map((event) => ({
        ...event,
        status: getEventStatus(event.event_date),
      }))
      .sort((a, b) => {
        const dateA = new Date(a.event_date + "T" + a.time)
        const dateB = new Date(b.event_date + "T" + b.time)
        return dateA.getTime() - dateB.getTime()
      })
  }, [events])

  const groupedEvents = useMemo(() => {
    const groups: Record<string, EventWithStatus[]> = {}

    eventsWithStatus.forEach((event) => {
      const date = event.event_date
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(event)
    })

    return Object.entries(groups).sort(([dateA], [dateB]) => {
      return new Date(dateA).getTime() - new Date(dateB).getTime()
    })
  }, [eventsWithStatus])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusStyles = (status: EventStatus) => {
    switch (status) {
      case "past":
        return {
          border: "border-l-muted-foreground/50",
          bg: "bg-muted/30",
          text: "text-muted-foreground",
          badge: "bg-muted text-muted-foreground",
          badgeLabel: "Pasado",
        }
      case "today":
        return {
          border: "border-l-emerald-500",
          bg: "bg-emerald-500/10",
          text: "text-foreground",
          badge: "bg-emerald-500 text-white",
          badgeLabel: "Hoy",
        }
      case "future":
        return {
          border: "border-l-blue-500",
          bg: "bg-blue-500/10",
          text: "text-foreground",
          badge: "bg-blue-500 text-white",
          badgeLabel: "Próximo",
        }
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-background border-border">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="h-5 w-5" />
            Calendario de Eventos
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          {groupedEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mb-4 opacity-50" />
              <p>No hay eventos programados</p>
            </div>
          ) : (
            <div className="space-y-6 pr-4">
              {groupedEvents.map(([date, dateEvents]) => {
                const status = getEventStatus(date)
                return (
                  <div key={date}>
                    <div className="flex items-center gap-2 mb-3">
                      <h3
                        className={`text-sm font-semibold capitalize ${status === "past" ? "text-muted-foreground" : "text-foreground"}`}
                      >
                        {formatDate(date)}
                      </h3>
                      {status === "today" && <Badge className="bg-emerald-500 text-white text-xs">Hoy</Badge>}
                    </div>
                    <div className="space-y-2">
                      {dateEvents.map((event) => {
                        const styles = getStatusStyles(event.status)
                        return (
                          <div
                            key={event.id}
                            className={`p-3 rounded-lg border-l-4 ${styles.border} ${styles.bg} transition-colors`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`font-medium ${styles.text}`}>{event.title}</h4>
                              <Badge className={`${styles.badge} text-xs shrink-0`}>{styles.badgeLabel}</Badge>
                            </div>
                            <div className={`flex flex-wrap gap-3 mt-2 text-sm ${styles.text} opacity-80`}>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {event.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {event.location}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
