import { Utensils, Music, DoorOpen, Ticket, Sparkles } from "lucide-react"

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

interface EventIconsProps {
  event: Event
  size?: "sm" | "md" | "lg"
}

export function EventIcons({ event, size = "md" }: EventIconsProps) {
  const iconSize = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5"
  const containerClass = size === "sm" ? "gap-2" : size === "lg" ? "gap-3" : "gap-2"

  return (
    <div className={`flex items-center flex-wrap ${containerClass}`}>
      {event.hasFood && (
        <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full text-xs">
          <Utensils className={iconSize} />
          <span>Cibo</span>
        </div>
      )}

      {event.hasMusic && (
        <div className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full text-xs">
          <Music className={iconSize} />
          <span>Musica</span>
        </div>
      )}

      {event.hasFreeEntry && (
        <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs">
          <DoorOpen className={iconSize} />
          <span>Ingresso Libero</span>
        </div>
      )}

      {event.hasTicketTasting && (
        <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
          <Ticket className={iconSize} />
          <span>Ticket Degustazione</span>
        </div>
      )}

      {event.hasFireworks && (
        <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full text-xs animate-pulse">
          <Sparkles className={iconSize} />
          <span>Fuochi</span>
        </div>
      )}
    </div>
  )
}
