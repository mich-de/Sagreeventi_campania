"use client"

import { Calendar, MapPin, Clock, Euro, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getMonthColor } from "@/utils/getMonthColor" // Import getMonthColor
import { EditEventDialog } from "./edit-event-dialog"
import { useAuth } from "./auth-provider"
import { EventIcons } from "./event-icons"

interface Event {
  id: string
  title: string
  startDate: string
  endDate: string
  location: string
  address: string
  time: string
  month: string
  category: string
  description: string
  cost: string
  organizer: string
  tags: string[]
  mapUrl: string
  featured: boolean
  hasFood: boolean
  hasMusic: boolean
  hasFreeEntry: boolean
  hasTicketTasting: boolean
  hasFireworks: boolean
}

interface EventCardProps {
  event: Event
  showDateStatus?: boolean
  onEditEvent?: (event: Event) => void
  onDeleteEvent?: (eventId: string) => void
}

export function EventCard({ event, showDateStatus = false, onEditEvent, onDeleteEvent }: EventCardProps) {
  const formatDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
    })

    if (startDate === endDate) {
      return start
    }

    const end = new Date(endDate).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
    })

    return `${start} - ${end}`
  }

  const getDateStatus = () => {
    const today = new Date()
    const startDate = new Date(event.startDate)
    const endDate = new Date(event.endDate)

    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0)
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)

    if (today >= startDate && today <= endDate) {
      return { status: "today", label: "Oggi", color: "bg-green-500 text-white" }
    }

    const diffTime = startDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return { status: "tomorrow", label: "Domani", color: "bg-blue-500 text-white" }
    } else if (diffDays > 1 && diffDays <= 7) {
      return { status: "soon", label: `Tra ${diffDays} giorni`, color: "bg-orange-500 text-white" }
    }

    return null
  }

  const dateStatus = showDateStatus ? getDateStatus() : null

  const { user } = useAuth()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="md:flex">
        <div className="md:w-2/3 p-6">
          <div className="flex flex-wrap justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold font-serif bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  {event.title}
                </h3>
                {dateStatus && (
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${dateStatus.color} animate-pulse`}>
                    {dateStatus.label}
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 flex items-center mb-3">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(event.startDate, event.endDate)}
              </p>
              <EventIcons event={event} size="sm" />
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getMonthColor(event.month)}`}>
              {event.month.charAt(0).toUpperCase() + event.month.slice(1)}
            </span>
          </div>

          <p className="mb-4 text-gray-700 dark:text-gray-300">{event.description}</p>

          <div className="flex flex-wrap gap-4 text-sm mb-4">
            <div className="flex items-center text-orange-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center text-orange-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center text-orange-600">
              <Euro className="h-4 w-4 mr-1" />
              <span>{event.cost}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="md:w-1/3 bg-gray-50 dark:bg-gray-700 p-4 flex flex-col justify-between">
          <div>
            <h4 className="font-bold mb-2">Organizzatore</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">{event.organizer}</p>
          </div>
          <Button asChild className="mt-4 bg-orange-500 hover:bg-orange-600">
            <a
              href={event.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Visualizza su Mappa
            </a>
          </Button>
        </div>
      </div>
      {user && onEditEvent && onDeleteEvent && (
        <div className="px-6 pb-4 flex gap-2">
          <EditEventDialog event={event} onEditEvent={onEditEvent} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm("Sei sicuro di voler eliminare questo evento?")) {
                onDeleteEvent(event.id)
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white border-red-500"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Elimina
          </Button>
        </div>
      )}
    </div>
  )
}
