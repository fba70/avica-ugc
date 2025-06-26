"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import EventCard from "@/components/blocks/event-card"
import { EventItem } from "@/types/types"
import { CreateEventForm } from "@/components/forms/create-event"
import axios from "axios"

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState(1)

  const CARDS_PER_PAGE = 6
  const totalPages = Math.ceil(events.length / CARDS_PER_PAGE)
  const startIdx = (page - 1) * CARDS_PER_PAGE
  const currentEvents = events.slice(startIdx, startIdx + CARDS_PER_PAGE)

  const fetchEvents = () => {
    setLoading(true)
    axios
      .get("/api/events")
      .then((res) => {
        setEvents(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to fetch events")
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  if (loading) return <div>Loading events...</div>
  if (error) return <div>{error}</div>

  const handleEventCreated = () => {
    fetchEvents()
  }

  return (
    <section className="max-w-7xl flex flex-col items-center justify-center">
      <p className="mx-auto text-7xl font-medium text-white pt-16 pb-16 text-center">
        Ongoing SeenDrop Events
      </p>

      <CreateEventForm onEventCreated={handleEventCreated} />

      <Separator className="mt-12 mb-12" />

      <div className="flex flex-row flex-wrap items-center justify-center gap-10 mb-6">
        {currentEvents.map((item) => (
          <EventCard cardInfo={item} showButton={true} key={item.id} />
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-4">
        <Button
          className=" text-gray-300 disabled:text-gray-300"
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </Button>
        <span>
          page {page} of {totalPages}
        </span>
        <Button
          className="text-gray-300 disabled:text-gray-300"
          variant="outline"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </section>
  )
}
