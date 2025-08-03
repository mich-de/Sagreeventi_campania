"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
  targetDate: string
  eventTitle: string
}

export function CountdownTimer({ targetDate, eventTitle }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
        setIsActive(true)
      } else {
        setIsActive(false)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  if (!isActive) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-5 w-5" />
        <h4 className="font-bold">Prossimo Evento: {eventTitle}</h4>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-white/20 rounded p-2">
          <div className="text-2xl font-bold">{timeLeft.days}</div>
          <div className="text-xs">Giorni</div>
        </div>
        <div className="bg-white/20 rounded p-2">
          <div className="text-2xl font-bold">{timeLeft.hours}</div>
          <div className="text-xs">Ore</div>
        </div>
        <div className="bg-white/20 rounded p-2">
          <div className="text-2xl font-bold">{timeLeft.minutes}</div>
          <div className="text-xs">Minuti</div>
        </div>
        <div className="bg-white/20 rounded p-2">
          <div className="text-2xl font-bold">{timeLeft.seconds}</div>
          <div className="text-xs">Secondi</div>
        </div>
      </div>
    </div>
  )
}
