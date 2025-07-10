"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import EventCard from "@/components/blocks/event-card"
import { EventItem, UserItem } from "@/types/types"
import { CreateEventForm } from "@/components/forms/create-event"
import { Search } from "lucide-react"
import axios from "axios"
import { useUser } from "@clerk/nextjs"

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>("")
  const [search, setSearch] = useState<string>("")

  const [page, setPage] = useState(1)

  const { isSignedIn, user } = useUser()
  const [dbUser, setDbUser] = useState<UserItem>()

  const orderedEvents = events
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  const filteredEvents = orderedEvents.filter(
    (event) =>
      event.name?.toLowerCase().includes(search.toLowerCase()) ||
      event.brand?.toLowerCase().includes(search.toLowerCase())
  )

  const CARDS_PER_PAGE = 6
  const totalPages = Math.ceil(events.length / CARDS_PER_PAGE)
  const startIdx = (page - 1) * CARDS_PER_PAGE
  const currentEvents = filteredEvents.slice(
    startIdx,
    startIdx + CARDS_PER_PAGE
  )

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

  useEffect(() => {
    if (isSignedIn && user && user?.id) {
      axios.get(`/api/user?externalId=${user.id}`).then((res) => {
        setDbUser(res.data[0])
      })
    }
  }, [user])

  if (loading) return <div className="mt-8">Loading events...</div>
  if (error) return <div className="mt-8">{error}</div>

  const handleEventCreated = () => {
    fetchEvents()
  }

  return (
    <section className="max-w-7xl flex flex-col items-center justify-center">
      <div className="w-full flex flex-col lg:flex-row items-center lg:justify-between justify-center gap-6 mt-16 px-6">
        <p className="lg:text-6xl text-5xl font-medium text-white lg:text-left text-center">
          Ongoing Events
        </p>
        {isSignedIn && dbUser && dbUser.role === "partner" && (
          <div className="lg:ml-auto lg:mr-0 w-full lg:w-auto flex justify-center lg:justify-end">
            <CreateEventForm onEventCreated={handleEventCreated} />
          </div>
        )}
      </div>

      <Separator className="mt-12 mb-12 bg-gray-400" />

      <div className="mb-8 flex flex-row items-center justify-center gap-4">
        <Search />
        <Input
          type="text"
          placeholder="Search by event name or brand"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-1 rounded w-[300px]"
        />
      </div>

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
