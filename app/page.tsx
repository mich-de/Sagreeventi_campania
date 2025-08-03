"use client"

import { useState, useEffect } from "react"
import { Utensils, Sun, Moon, Menu, Search, Calendar, MapPin, Star, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AuthProvider, useAuth } from "@/components/auth-provider"
import { LoginDialog } from "@/components/login-dialog"
import { AddEventDialog } from "@/components/add-event-dialog"
import { EventCard } from "@/components/event-card"
import { CurrentEventsSection } from "@/components/current-events-section"
import { CountdownTimer } from "@/components/countdown-timer"
import { EventsTable } from "@/components/events-table"
import { BulkImportDialog } from "@/components/bulk-import-dialog"
import eventsData from "@/data/events.json"

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
  hasPaidEntry: boolean
  hasFireworks: boolean
}

function HomePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [activeTab, setActiveTab] = useState("luglio")
  const [searchTerm, setSearchTerm] = useState("")
  const [monthFilter, setMonthFilter] = useState("all")
  const [isDark, setIsDark] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuth()

  // Load events from localStorage or default data
  useEffect(() => {
    const savedEvents = localStorage.getItem("sagre-events")
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents)
        setEvents(parsedEvents)
      } catch (error) {
        console.error("Error parsing saved events:", error)
        setEvents(eventsData.events)
      }
    } else {
      setEvents(eventsData.events)
    }
  }, [])

  // Save events to localStorage whenever events change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("sagre-events", JSON.stringify(events))
    }
  }, [events])

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, monthFilter, activeTab])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    if (newTheme) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const filterEvents = () => {
    let filtered = events

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by month
    if (monthFilter !== "all") {
      filtered = filtered.filter((event) => event.month === monthFilter)
    }

    // Filter by active tab
    filtered = filtered.filter((event) => event.month === activeTab)

    setFilteredEvents(filtered)
  }

  const addEvent = (newEvent: Event) => {
    const updatedEvents = [...events, newEvent]
    setEvents(updatedEvents)
  }

  const editEvent = (updatedEvent: Event) => {
    const updatedEvents = events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    setEvents(updatedEvents)
  }

  const deleteEvent = (eventId: string) => {
    const updatedEvents = events.filter((event) => event.id !== eventId)
    setEvents(updatedEvents)
  }

  const bulkImportEvents = (newEvents: Event[]) => {
    const updatedEvents = [...events, ...newEvents]
    setEvents(updatedEvents)
  }

  const featuredEvents = events.filter((event) => event.featured)

  const getNextEvent = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const upcomingEvents = events
      .filter((event) => {
        const startDate = new Date(event.startDate)
        startDate.setHours(0, 0, 0, 0)
        return startDate > today
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

    return upcomingEvents[0] || null
  }

  const nextEvent = getNextEvent()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {/* Header */}
      <header className="fixed w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Utensils className="text-orange-500 text-2xl" />
            <h1 className="text-xl font-bold font-serif">Sagre Campane 2025</h1>
          </div>

          <nav className="hidden md:flex space-x-6">
            <a href="#eventi" className="hover:text-orange-500 transition">
              Eventi
            </a>
            <a href="#guida" className="hover:text-orange-500 transition">
              Guida
            </a>
            <a href="#tabella" className="hover:text-orange-500 transition">
              Tabella
            </a>
            <a href="#come-usare" className="hover:text-orange-500 transition">
              Come Usare
            </a>
          </nav>

          <div className="flex items-center space-x-2">
            <LoginDialog />
            {user && (
              <>
                <AddEventDialog onAddEvent={addEvent} />
                <BulkImportDialog onBulkImport={bulkImportEvents} />
              </>
            )}
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="p-2">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700">
            <div className="px-4 py-2 space-y-2">
              <a href="#eventi" className="block py-2 hover:text-orange-500 transition">
                Eventi
              </a>
              <a href="#guida" className="block py-2 hover:text-orange-500 transition">
                Guida
              </a>
              <a href="#tabella" className="block py-2 hover:text-orange-500 transition">
                Tabella
              </a>
              <a href="#come-usare" className="block py-2 hover:text-orange-500 transition">
                Come Usare
              </a>
              {user && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                  <AddEventDialog onAddEvent={addEvent} />
                  <BulkImportDialog onBulkImport={bulkImportEvents} />
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-orange-500/10 to-blue-500/10 dark:from-orange-500/20 dark:to-blue-500/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif mb-4">Sagre ed Eventi in Campania</h1>
            <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6">
              Guida ordinata: Costiera Amalfitana, Penisola Sorrentina e oltre
            </h2>
            <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
              Scopri le sagre e feste popolari in Campania da luglio a ottobre 2025. Un viaggio tra gusto, musica e
              tradizione nei paesi tra mare e colline.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => document.getElementById("eventi")?.scrollIntoView({ behavior: "smooth" })}
              >
                Esplora Eventi
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white bg-transparent"
                onClick={() => document.getElementById("tabella")?.scrollIntoView({ behavior: "smooth" })}
              >
                Vista Tabellare
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Panel for logged users */}
      {user && (
        <section className="py-8 bg-blue-50 dark:bg-blue-900/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-blue-500" />
                  Pannello Amministratore
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Benvenuto {user.name}! Puoi aggiungere, modificare ed eliminare eventi. Tutti i cambiamenti vengono
                  salvati automaticamente.
                </p>
                <div className="flex flex-wrap gap-3">
                  <AddEventDialog onAddEvent={addEvent} />
                  <BulkImportDialog onBulkImport={bulkImportEvents} />
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <span>Eventi totali: {events.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Events */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-serif mb-8 text-center">Eventi in Evidenza</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl overflow-hidden shadow-lg"
              >
                <div className="p-6 text-white">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{event.title}</h3>
                      <p className="text-yellow-200 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(event.startDate).toLocaleDateString("it-IT")} -{" "}
                        {new Date(event.endDate).toLocaleDateString("it-IT")}
                      </p>
                    </div>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      {event.month.charAt(0).toUpperCase() + event.month.slice(1)}
                    </span>
                  </div>
                  <p className="mb-4 line-clamp-3">{event.description}</p>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current and Upcoming Events */}
      <CurrentEventsSection events={events} />

      {/* Countdown to Next Event */}
      {nextEvent && (
        <section className="py-8 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <CountdownTimer targetDate={nextEvent.startDate} eventTitle={nextEvent.title} />
            </div>
          </div>
        </section>
      )}

      {/* Events Section */}
      <section id="eventi" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-serif mb-8 text-center">Tutti gli Eventi</h2>

          {/* Search and Filter */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Cerca eventi per nome, località o specialità..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={monthFilter} onValueChange={setMonthFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Tutti i mesi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti i mesi</SelectItem>
                    <SelectItem value="luglio">Luglio</SelectItem>
                    <SelectItem value="agosto">Agosto</SelectItem>
                    <SelectItem value="settembre">Settembre</SelectItem>
                    <SelectItem value="oltre">Oltre la Costiera</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {["luglio", "agosto", "settembre", "oltre"].map((month) => (
                <Button
                  key={month}
                  variant={activeTab === month ? "default" : "outline"}
                  onClick={() => setActiveTab(month)}
                  className={activeTab === month ? "bg-orange-500 hover:bg-orange-600" : ""}
                >
                  {month === "oltre" ? "Oltre la Costiera" : month.charAt(0).toUpperCase() + month.slice(1)}
                </Button>
              ))}
            </div>

            {/* Events List */}
            <div className="space-y-6">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} onEditEvent={editEvent} onDeleteEvent={deleteEvent} />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">Nessun evento trovato per i criteri selezionati.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Events Table */}
      <EventsTable events={events} />

      {/* How to Use Guide */}
      <section id="come-usare" className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-serif mb-8 text-center">Come usare questa guida</h2>

          <div className="max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg p-6 md:p-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg mb-6">
                Gli eventi elencati sono tutti <strong>confermati per il 2025</strong>, i link portano direttamente alla
                posizione Google Maps del luogo di svolgimento (ideale sia per il navigatore che per chi cerca dove
                parcheggiare e raggiungere la sagra a piedi).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-orange-500/10 dark:bg-orange-500/20 p-5 rounded-lg">
                  <h3 className="text-xl font-bold mb-3 flex items-center">
                    <Clock className="text-orange-500 mr-2 h-5 w-5" />
                    Orari e Date
                  </h3>
                  <p>
                    Gli orari tipici vanno dal tardo pomeriggio a notte ma le singole manifestazioni possono coprire
                    anche pranzi festivi; conviene sempre controllare i social dei comitati nelle ore/mesi precedenti.
                  </p>
                </div>

                <div className="bg-green-500/10 dark:bg-green-500/20 p-5 rounded-lg">
                  <h3 className="text-xl font-bold mb-3 flex items-center">
                    <Star className="text-green-500 mr-2 h-5 w-5" />
                    Costi e Accessibilità
                  </h3>
                  <p>
                    Quasi tutte le sagre citate sono ad ingresso libero, con pagamento selettivo solo per singoli
                    piatti, menù o degustazioni (ticket speciale in caso cetarese o per attività guidate come trekking
                    della castagna).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Utensils className="text-orange-500 text-2xl" />
                <h3 className="text-xl font-bold font-serif">Sagre Campane 2025</h3>
              </div>
              <p className="text-gray-400">
                La guida completa agli eventi gastronomici della Campania da luglio a ottobre 2025.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Link Utili</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#eventi" className="text-gray-400 hover:text-orange-500 transition">
                    Eventi
                  </a>
                </li>
                <li>
                  <a href="#tabella" className="text-gray-400 hover:text-orange-500 transition">
                    Tabella Eventi
                  </a>
                </li>
                <li>
                  <a href="#come-usare" className="text-gray-400 hover:text-orange-500 transition">
                    Come Usare
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Fonti</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-orange-500 transition">
                    About Sorrento
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-500 transition">
                    Napoli da Vivere
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-500 transition">
                    Solo Caserta
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-500 transition">
                    Campania Shopping
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Seguici</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-orange-500 transition">
                  <span className="sr-only">Facebook</span>📘
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition">
                  <span className="sr-only">Instagram</span>📷
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition">
                  <span className="sr-only">Twitter</span>🐦
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Sagre Campane 2025. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function Page() {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  )
}
