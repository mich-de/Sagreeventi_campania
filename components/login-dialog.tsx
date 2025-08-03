"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "./auth-provider"
import { User, LogOut } from "lucide-react"

export function LoginDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { user, login, logout } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const success = await login(email, password)
    if (success) {
      setIsOpen(false)
      setEmail("")
      setPassword("")
    } else {
      setError("Credenziali non valide")
    }
    setIsLoading(false)
  }

  if (user) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm">Ciao, {user.name}</span>
        <Button variant="outline" size="sm" onClick={logout} className="flex items-center space-x-1 bg-transparent">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-1 bg-transparent">
          <User className="h-4 w-4" />
          <span>Login</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Accedi per aggiungere eventi</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sagrecampania.it"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Accesso in corso..." : "Accedi"}
          </Button>
        </form>
        <div className="text-xs text-gray-500 mt-4">
          <p>Demo credentials:</p>
          <p>Email: admin@sagrecampania.it</p>
          <p>Password: admin123</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
