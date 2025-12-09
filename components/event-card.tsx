"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, MapPin, DollarSign, ChevronDown, ChevronUp, Users, Trash2 } from "lucide-react"
import type { EventWithAttendees, Guest } from "@/lib/types"

interface EventCardProps {
  event: EventWithAttendees
  guests: Guest[]
  onToggleAttendance: (eventId: string, guestId: string) => void
  onUpdateCost: (eventId: string, cost: number) => void
  onDeleteEvent: (eventId: string) => void
}

export function EventCard({ event, guests, onToggleAttendance, onUpdateCost, onDeleteEvent }: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const confirmedCount = Object.values(event.attendees).filter(Boolean).length
  const totalCount = guests.length
  const costPerPerson = confirmedCount > 0 ? Math.ceil(event.total_cost / confirmedCount) : 0

  return (
    <Card className="overflow-hidden transition-all duration-200 bg-card border-border">
      <CardHeader className="cursor-pointer p-4 pb-3" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-card-foreground truncate">{event.title}</h3>
              <Badge variant="secondary" className="shrink-0 bg-secondary text-secondary-foreground">
                <Users className="h-3 w-3 mr-1" />
                {confirmedCount}/{totalCount}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span className="font-medium text-foreground">{event.time}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{event.location}</span>
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-8 w-8"
            aria-label={isExpanded ? "Colapsar" : "Expandir"}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm">Total:</span>
            <span className="font-bold text-foreground">${event.total_cost.toLocaleString()}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground">Por persona</span>
            <p className="text-lg font-bold text-foreground">${costPerPerson.toLocaleString()}</p>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 px-4 pb-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <label htmlFor={`cost-${event.id}`} className="text-sm text-muted-foreground whitespace-nowrap">
                Costo total:
              </label>
              <div className="relative flex-1">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id={`cost-${event.id}`}
                  type="number"
                  value={event.total_cost}
                  onChange={(e) => onUpdateCost(event.id, Number(e.target.value) || 0)}
                  className="pl-9 bg-input border-border"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-3">Asistentes confirmados</p>
              <ScrollArea className="h-[200px] pr-3">
                <div className="space-y-2">
                  {guests.map((guest) => (
                    <label
                      key={guest.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={event.attendees[guest.id] || false}
                        onCheckedChange={() => onToggleAttendance(event.id, guest.id)}
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className="flex-1 text-sm text-foreground">{guest.name}</span>
                      {event.attendees[guest.id] && (
                        <Badge variant="outline" className="text-xs border-success/50 text-success bg-success/10">
                          Confirmado
                        </Badge>
                      )}
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteEvent(event.id)
                }}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar evento
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
