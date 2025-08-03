export interface Event {
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
  // Caratteristiche dell'evento
  hasFood: boolean
  hasMusic: boolean
  hasFreeEntry: boolean
  hasTicketTasting: boolean
  hasFireworks: boolean
}
