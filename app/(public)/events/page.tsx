"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import EventCard from "@/components/blocks/event-card"
import { EventItem } from "@/types/types"
import { Search } from "lucide-react"
import axios from "axios"
// import { useUser } from "@clerk/nextjs"

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>("")
  const [search, setSearch] = useState<string>("")

  const [page, setPage] = useState(1)

  // const { isSignedIn, user } = useUser()
  // const [dbUser, setDbUser] = useState<UserItem>()

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

  if (loading) return <div className="mt-8">Loading events...</div>
  if (error) return <div className="mt-8">{error}</div>

  return (
    <section className="max-w-7xl flex flex-col items-center justify-center">
      <div className="w-full flex flex-col lg:flex-row items-center lg:justify-between justify-center gap-6 mt-16 px-6">
        <p className="lg:text-6xl text-5xl font-medium text-white lg:text-left text-center pb-2">
          Events
        </p>

        <div className="flex flex-row items-center justify-center lg:pl-20 pl-0 gap-4">
          <Search />
          <Input
            type="text"
            placeholder="Search by event name or brand"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-1 rounded w-[320px]"
          />
        </div>
      </div>

      <p className="text-xl font-medium text-gray-300 lg:text-left text-center mt-4">
        Select the event you like from the list of examples below to create your
        own{" "}
        <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          SPARKBITS
        </span>
      </p>

      <p className="text-xl font-medium text-gray-300 lg:text-left text-center mt-4">
        Sign Up / In to save your{" "}
        <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          SPARKBITS
        </span>{" "}
        and to be able to generate short video clips
      </p>

      <Separator className="mt-10 mb-12 bg-gray-400" />

      <div className="flex flex-row flex-wrap items-center justify-center gap-10 mb-6">
        {currentEvents.map((item) => (
          <EventCard
            cardInfo={item}
            showButton={true}
            showCounts={false}
            key={item.id}
          />
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
        <span className="text-sm">
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
