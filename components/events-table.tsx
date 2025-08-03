"use client"

import { ExternalLink } from "lucide-react"

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

interface EventsTableProps {
  events: Event[]
}

export function EventsTable({ events }: EventsTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const sortedEvents = [...events].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

  return (
    <section id="tabella" className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold font-serif mb-8 text-center">Consultazione: sagre in formato tabellare</h2>

        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead>
              <tr className="bg-orange-500 text-white">
                <th className="py-3 px-4 text-left">Data Inizio</th>
                <th className="py-3 px-4 text-left">Data Fine</th>
                <th className="py-3 px-4 text-left">Evento</th>
                <th className="py-3 px-4 text-left">Località/Frazione</th>
                <th className="py-3 px-4 text-left">Orario</th>
                <th className="py-3 px-4 text-left">Descrizione sintesi</th>
                <th className="py-3 px-4 text-left">Costo</th>
                <th className="py-3 px-4 text-left">Google Maps</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <td className="py-3 px-4">{formatDate(event.startDate)}</td>
                  <td className="py-3 px-4">{formatDate(event.endDate)}</td>
                  <td className="py-3 px-4 font-semibold">{event.title}</td>
                  <td className="py-3 px-4">{event.location}</td>
                  <td className="py-3 px-4">{event.time}</td>
                  <td className="py-3 px-4 max-w-xs">
                    <div className="truncate" title={event.description}>
                      {event.tags.join(", ")}
                    </div>
                  </td>
                  <td className="py-3 px-4">{event.cost}</td>
                  <td className="py-3 px-4">
                    <a
                      href={event.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-600 transition"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
