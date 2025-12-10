"use client"

import { Button } from "@/components/ui/button"
import { Sun, Moon, Users, Plus, Calendar, CalendarDays } from "lucide-react"

interface HeaderProps {
  isDarkMode: boolean
  onToggleTheme: () => void
  onOpenGuestDrawer: () => void
  onOpenAddEvent: () => void
  onOpenCalendar: () => void
}

export function Header({ isDarkMode, onToggleTheme, onOpenGuestDrawer, onOpenAddEvent, onOpenCalendar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-foreground" />
            <h1 className="text-xl font-bold tracking-tight text-foreground">Eventos</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenAddEvent}
              className="h-10 w-10 cursor-pointer"
              aria-label="Agregar evento"
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenCalendar}
              className="h-10 w-10 cursor-pointer"
              aria-label="Ver calendario"
            >
              <CalendarDays className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenGuestDrawer}
              className="h-10 w-10 cursor-pointer"
              aria-label="Administrar invitados"
            >
              <Users className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleTheme}
              className="h-10 w-10 cursor-pointer"
              aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
