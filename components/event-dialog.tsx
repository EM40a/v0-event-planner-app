"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Calendar, Clock, MapPin, DollarSign } from "lucide-react"
import type { EventWithAttendees } from "@/lib/types"

interface EventDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: { title: string; time: string; location: string; totalCost: number }) => void
  event?: EventWithAttendees | null // If provided, we're editing
}

export function EventDialog({ isOpen, onClose, onSave, event }: EventDialogProps) {
  const [title, setTitle] = useState("")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("")
  const [totalCost, setTotalCost] = useState("")

  const isEditing = !!event

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setTime(event.time)
      setLocation(event.location)
      setTotalCost(event.total_cost.toString())
    } else {
      setTitle("")
      setTime("")
      setLocation("")
      setTotalCost("")
    }
  }, [event, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && time.trim()) {
      onSave({
        title: title.trim(),
        time: time.trim(),
        location: location.trim() || "Por definir",
        totalCost: Number(totalCost) || 0,
      })
      handleClose()
    }
  }

  const handleClose = () => {
    setTitle("")
    setTime("")
    setLocation("")
    setTotalCost("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="h-5 w-5" />
            {isEditing ? "Editar Evento" : "Nuevo Evento"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground">
                Nombre del evento
              </Label>
              <Input
                id="title"
                placeholder="Ej: Asado de cumpleaños"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-input border-border"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-foreground">
                Hora
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-9 bg-input border-border"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-foreground">
                Ubicación
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="Ej: Casa de Juan"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-9 bg-input border-border"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost" className="text-foreground">
                Costo total (opcional)
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="cost"
                  type="number"
                  placeholder="0"
                  value={totalCost}
                  onChange={(e) => setTotalCost(e.target.value)}
                  className="pl-9 bg-input border-border"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? "Guardar cambios" : "Crear evento"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
