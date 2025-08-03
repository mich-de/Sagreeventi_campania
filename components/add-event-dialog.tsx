"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Utensils, Music, DoorOpen, Ticket, Sparkles } from "lucide-react"
import { useAuth } from "./auth-provider"

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

interface AddEventDialogProps {
  onAddEvent: (event: Event) => void
}

export function AddEventDialog({ onAddEvent }: AddEventDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    location: "",
    address: "",
    time: "",
    month: "luglio",
    category: "oltre",
    description: "",
    cost: "",
    organizer: "",
    tags: "",
    mapUrl: "",
    hasFood: true,
    hasMusic: false,
    hasFreeEntry: true,
    hasTicketTasting: false,
    hasFireworks: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newEvent: Event = {
      id: `event-${Date.now()}`,
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      featured: false,
    }

    onAddEvent(newEvent)
    setIsOpen(false)
    setFormData({
      title: "",
      startDate: "",
      endDate: "",
      location: "",
      address: "",
      time: "",
      month: "luglio",
      category: "oltre",
      description: "",
      cost: "",
      organizer: "",
      tags: "",
      mapUrl: "",
      hasFood: true,
      hasMusic: false,
      hasFreeEntry: true,
      hasTicketTasting: false,
      hasFireworks: false,
    })
  }

  if (!user) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Aggiungi Evento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aggiungi Nuovo Evento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titolo Evento</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organizer">Organizzatore</Label>
              <Input
                id="organizer"
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data Inizio</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Data Fine</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time">Orario</Label>
              <Input
                id="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="19:00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Costo</Label>
              <Input
                id="cost"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                placeholder="Ingresso gratuito"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Mese</Label>
              <Select value={formData.month} onValueChange={(value) => setFormData({ ...formData, month: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="luglio">Luglio</SelectItem>
                  <SelectItem value="agosto">Agosto</SelectItem>
                  <SelectItem value="settembre">Settembre</SelectItem>
                  <SelectItem value="oltre">Oltre la Costiera</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oltre">Oltre la Costiera</SelectItem>
                  <SelectItem value="costiera">Costiera Amalfitana</SelectItem>
                  <SelectItem value="penisola">Penisola Sorrentina</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Località</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Massa Lubrense (NA)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Indirizzo</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Centro storico, Massa Lubrense"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mapUrl">URL Google Maps</Label>
            <Input
              id="mapUrl"
              value={formData.mapUrl}
              onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
              placeholder="https://maps.google.com/search/..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (separati da virgola)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Cucina tipica, Musica folk, Artigianato"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrizione</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="space-y-4 border-t pt-4">
            <Label className="text-base font-semibold">Caratteristiche Evento</Label>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasFood"
                  checked={formData.hasFood}
                  onChange={(e) => setFormData({ ...formData, hasFood: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="hasFood" className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-orange-500" />
                  Cibo e Degustazioni
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasMusic"
                  checked={formData.hasMusic}
                  onChange={(e) => setFormData({ ...formData, hasMusic: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="hasMusic" className="flex items-center gap-2">
                  <Music className="h-4 w-4 text-purple-500" />
                  Musica e Spettacoli
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasFreeEntry"
                  checked={formData.hasFreeEntry}
                  onChange={(e) => setFormData({ ...formData, hasFreeEntry: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="hasFreeEntry" className="flex items-center gap-2">
                  <DoorOpen className="h-4 w-4 text-green-500" />
                  Ingresso Libero
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasTicketTasting"
                  checked={formData.hasTicketTasting}
                  onChange={(e) => setFormData({ ...formData, hasTicketTasting: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="hasTicketTasting" className="flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-blue-500" />
                  Ticket per Degustazione
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasFireworks"
                  checked={formData.hasFireworks}
                  onChange={(e) => setFormData({ ...formData, hasFireworks: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="hasFireworks" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  Fuochi d'Artificio
                </Label>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Aggiungi Evento
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
