"use client"

import { Calendar, Clock, MapPin, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EventCard } from "./event-card"

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
}

interface CurrentEventsSectionProps {
  events: Event[]
}

export function CurrentEventsSection({ events }: CurrentEventsSectionProps) {
  const getCurrentAndUpcomingEvents = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const currentEvents = events.filter((event) => {
      const startDate = new Date(event.startDate)
      const endDate = new Date(event.endDate)
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(0, 0, 0, 0)

      return today >= startDate && today <= endDate
    })

    const upcomingEvents = events
      .filter((event) => {
        const startDate = new Date(event.startDate)
        startDate.setHours(0, 0, 0, 0)

        const diffTime = startDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        return diffDays > 0 && diffDays <= 7
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

    return { currentEvents, upcomingEvents }
  }

  const { currentEvents, upcomingEvents } = getCurrentAndUpcomingEvents()

  if (currentEvents.length === 0 && upcomingEvents.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-serif mb-4 flex items-center justify-center gap-2">
            <Clock className="h-8 w-8 text-green-600" />
            Eventi di Oggi e Prossimi Giorni
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Non perdere gli eventi che stanno accadendo ora o inizieranno presto!
          </p>
        </div>

        {/* Current Events */}
        {currentEvents.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-green-500 w-4 h-4 rounded-full animate-pulse"></div>
              <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">
                In Corso Oggi ({currentEvents.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {currentEvents.map((event) => (
                <div key={event.id} className="relative">
                  <div className="absolute -top-2 -right-2 z-10">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                      LIVE
                    </span>
                  </div>
                  <EventCard event={event} showDateStatus={true} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle className="h-6 w-6 text-orange-500" />
              <h3 className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                Prossimi 7 Giorni ({upcomingEvents.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} showDateStatus={true} />
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg inline-block">
            <h4 className="font-bold mb-3">Azioni Rapide</h4>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("eventi")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Vedi Tutti gli Eventi
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date().toISOString().split("T")[0]
                  const todayEvents = events.filter((event) => event.startDate <= today && event.endDate >= today)
                  if (todayEvents.length > 0) {
                    alert(`Oggi ci sono ${todayEvents.length} eventi in corso!`)
                  } else {
                    alert("Nessun evento in corso oggi")
                  }
                }}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Eventi Vicini
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
