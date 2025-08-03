"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, AlertCircle, CheckCircle } from "lucide-react"

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

interface BulkImportDialogProps {
  onBulkImport: (events: Event[]) => void
}

export function BulkImportDialog({ onBulkImport }: BulkImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [importText, setImportText] = useState("")
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState<string>("")

  const parseDate = (dateStr: string): string => {
    // Convert dd/mm/yyyy to yyyy-mm-dd
    const parts = dateStr.split("/")
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`
    }
    return dateStr
  }

  const parseImportText = (text: string): Event[] => {
    const events: Event[] = []
    const eventBlocks = text.split(/\n\s*\n/).filter((block) => block.trim())

    eventBlocks.forEach((block, index) => {
      try {
        const lines = block.split("\n").map((line) => line.trim())
        const eventData: any = {}

        lines.forEach((line) => {
          if (line.startsWith("[") && line.includes("]")) {
            eventData.title = line.replace(/^\[|\]$/g, "")
          } else if (line.startsWith("Organizzatore:")) {
            eventData.organizer = line.replace("Organizzatore:", "").trim()
          } else if (line.startsWith("Data Inizio:")) {
            eventData.startDate = parseDate(line.replace("Data Inizio:", "").trim())
          } else if (line.startsWith("Data Fine:")) {
            eventData.endDate = parseDate(line.replace("Data Fine:", "").trim())
          } else if (line.startsWith("Orario:")) {
            eventData.time = line.replace("Orario:", "").trim()
          } else if (line.startsWith("Mese:")) {
            const month = line.replace("Mese:", "").trim().toLowerCase()
            eventData.month = month
          } else if (line.startsWith("Categoria:")) {
            const category = line.replace("Categoria:", "").trim()
            if (category.includes("Penisola Sorrentina")) {
              eventData.category = "penisola"
            } else if (category.includes("Costiera Amalfitana")) {
              eventData.category = "costiera"
            } else {
              eventData.category = "oltre"
            }
          } else if (line.startsWith("Località:")) {
            eventData.location = line.replace("Località:", "").trim()
          } else if (line.startsWith("Indirizzo:")) {
            eventData.address = line.replace("Indirizzo:", "").trim()
          } else if (line.startsWith("URL Google Maps:")) {
            eventData.mapUrl = line.replace("URL Google Maps:", "").trim()
          } else if (line.startsWith("Tags:")) {
            const tagsStr = line.replace("Tags:", "").trim()
            eventData.tags = tagsStr.split(",").map((tag) => tag.trim())
          } else if (line.startsWith("Costo:")) {
            eventData.cost = line.replace("Costo:", "").trim()
          } else if (line.startsWith("Cibo:")) {
            eventData.hasFood = line.replace("Cibo:", "").trim().toLowerCase() === "sì"
          } else if (line.startsWith("Musica:")) {
            eventData.hasMusic = line.replace("Musica:", "").trim().toLowerCase() === "sì"
          } else if (line.startsWith("Ingresso Libero:")) {
            eventData.hasFreeEntry = line.replace("Ingresso Libero:", "").trim().toLowerCase() === "sì"
          } else if (line.startsWith("Ticket Degustazione:")) {
            eventData.hasTicketTasting = line.replace("Ticket Degustazione:", "").trim().toLowerCase() === "sì"
          } else if (line.startsWith("Fuochi d'Artificio:")) {
            eventData.hasFireworks = line.replace("Fuochi d'Artificio:", "").trim().toLowerCase() === "sì"
          } else if (line.startsWith("Descrizione:")) {
            // Get all remaining lines as description
            const descIndex = lines.indexOf(line)
            eventData.description = lines
              .slice(descIndex + 1)
              .join(" ")
              .trim()
          }
        })

        // Validate required fields
        const requiredFields = [
          "title",
          "organizer",
          "startDate",
          "endDate",
          "time",
          "month",
          "location",
          "address",
          "mapUrl",
          "description",
        ]
        const missingFields = requiredFields.filter((field) => !eventData[field])

        if (missingFields.length > 0) {
          throw new Error(`Evento ${index + 1}: Campi mancanti: ${missingFields.join(", ")}`)
        }

        // Set defaults
        eventData.id = `imported-${Date.now()}-${index}`
        eventData.cost = eventData.cost || "Ingresso gratuito"
        eventData.tags = eventData.tags || []
        eventData.featured = false
        eventData.hasFood = eventData.hasFood || false
        eventData.hasMusic = eventData.hasMusic || false
        eventData.hasFreeEntry = eventData.hasFreeEntry !== undefined ? eventData.hasFreeEntry : true
        eventData.hasTicketTasting = eventData.hasTicketTasting || false
        eventData.hasFireworks = eventData.hasFireworks || false

        events.push(eventData as Event)
      } catch (error) {
        throw new Error(
          `Errore nell'evento ${index + 1}: ${error instanceof Error ? error.message : "Formato non valido"}`,
        )
      }
    })

    return events
  }

  const handleImport = () => {
    setErrors([])
    setSuccess("")

    try {
      const events = parseImportText(importText)
      if (events.length === 0) {
        setErrors(["Nessun evento trovato nel testo inserito"])
        return
      }

      onBulkImport(events)
      setSuccess(`${events.length} eventi importati con successo!`)
      setImportText("")
      setTimeout(() => {
        setIsOpen(false)
        setSuccess("")
      }, 2000)
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Errore durante l'importazione"])
    }
  }

  const exampleText = `[Sagra del Limone di Esempio]
Organizzatore: Comune di Massa Lubrense
Data Inizio: 10/07/2025
Data Fine: 13/07/2025
Orario: 19:00
Mese: luglio
Categoria: Penisola Sorrentina
Località: Massa Lubrense (NA)
Indirizzo: Centro storico, Massa Lubrense
URL Google Maps: https://maps.google.com/search/Massa+Lubrense+centro+storico
Costo: Ingresso gratuito
Tags: Limoni IGP, Cucina tipica, Artigianato
Cibo: Sì
Musica: Sì
Ingresso Libero: Sì
Ticket Degustazione: No
Fuochi d'Artificio: Sì
Descrizione:
Quattro giorni dedicati al limone di Massa Lubrense IGP con percorsi degustativi nei limoneti, artigianato, dolci tipici, liquori, spettacoli folk, laboratori, show cooking e visite guidate.`

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-500 hover:bg-green-600 text-white">
          <Upload className="h-4 w-4 mr-2" />
          Importazione Massiva
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importazione Massiva Eventi</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-bold mb-2">Formato richiesto:</h4>
            <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
              {`[Titolo Evento]
Organizzatore: [Nome organizzatore/associazione]
Data Inizio: [gg/mm/aaaa]
Data Fine: [gg/mm/aaaa]
Orario: [orario di inizio/fine o "Tutte le sere dalle…"]
Mese: [luglio/agosto/settembre/oltre]
Categoria: [Penisola Sorrentina / Costiera Amalfitana / Altro]
Località: [Comune / frazione (sigla provincia)]
Indirizzo: [Indirizzo esatto o località]
URL Google Maps: https://maps.google.com/search/…
Costo: [Costo o "Ingresso gratuito"]
Tags: [Parole chiave separate da virgola]
Cibo: [Sì/No]
Musica: [Sì/No]
Ingresso Libero: [Sì/No]
Ticket Degustazione: [Sì/No]
Fuochi d'Artificio: [Sì/No]
Descrizione:
[Descrizione completa dell'evento]

[Prossimo Evento]
...`}
            </pre>
          </div>

          <div className="space-y-2">
            <Label htmlFor="importText">Incolla qui i tuoi eventi (separati da righe vuote):</Label>
            <Textarea
              id="importText"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={exampleText}
              rows={15}
              className="font-mono text-sm"
            />
          </div>

          {errors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h4 className="font-bold text-red-700 dark:text-red-300">Errori trovati:</h4>
              </div>
              <ul className="list-disc list-inside space-y-1 text-red-600 dark:text-red-400">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-bold text-green-700 dark:text-green-300">{success}</span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleImport} disabled={!importText.trim()} className="flex-1">
              Importa Eventi
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annulla
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
