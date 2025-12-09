"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Pencil, Trash2, Link, Plus, Check, X, Users } from "lucide-react"
import type { Guest } from "@/lib/types"

interface GuestDrawerProps {
  isOpen: boolean
  onClose: () => void
  guests: Guest[]
  onAddGuest: (name: string) => void
  onEditGuest: (id: string, name: string) => void
  onDeleteGuest: (id: string) => void
}

export function GuestDrawer({ isOpen, onClose, guests, onAddGuest, onEditGuest, onDeleteGuest }: GuestDrawerProps) {
  const [newGuestName, setNewGuestName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleAddGuest = () => {
    if (newGuestName.trim()) {
      onAddGuest(newGuestName.trim())
      setNewGuestName("")
    }
  }

  const handleStartEdit = (guest: Guest) => {
    setEditingId(guest.id)
    setEditingName(guest.name)
  }

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      onEditGuest(editingId, editingName.trim())
      setEditingId(null)
      setEditingName("")
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName("")
  }

  const handleCopyLink = async (guest: Guest) => {
    const inviteLink = `${typeof window !== "undefined" ? window.location.origin : ""}/invite/${guest.id}`
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopiedId(guest.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-background border-border">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <Users className="h-5 w-5" />
            Administrar Invitados
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-8rem)] px-4">
          <div className="py-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nombre del invitado"
                value={newGuestName}
                onChange={(e) => setNewGuestName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddGuest()}
                className="bg-input border-border"
              />
              <Button onClick={handleAddGuest} size="icon" className="shrink-0">
                <Plus className="h-4 w-4" />
                <span className="sr-only">Agregar invitado</span>
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-2 pb-4">
              {guests.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No hay invitados. Agrega uno arriba.</p>
              ) : (
                guests.map((guest) => (
                  <div key={guest.id} className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border">
                    {editingId === guest.id ? (
                      <>
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit()
                            if (e.key === "Escape") handleCancelEdit()
                          }}
                          className="flex-1 h-8 bg-input border-border"
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleSaveEdit}
                          className="h-8 w-8 text-success hover:text-success"
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Guardar</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleCancelEdit} className="h-8 w-8">
                          <X className="h-4 w-4" />
                          <span className="sr-only">Cancelar</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-sm font-medium text-foreground">{guest.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyLink(guest)}
                          className="h-8 w-8"
                          aria-label="Copiar link de invitación"
                        >
                          {copiedId === guest.id ? (
                            <Check className="h-4 w-4 text-success" />
                          ) : (
                            <Link className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStartEdit(guest)}
                          className="h-8 w-8"
                          aria-label="Editar invitado"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteGuest(guest.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          aria-label="Eliminar invitado"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
