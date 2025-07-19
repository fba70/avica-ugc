"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { SeenDropItem, EventItem } from "@/types/types"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import EventCard from "@/components/blocks/event-card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
// import { Separator } from "@/components/ui/separator"

export default function PartnerEvents() {
  const { isSignedIn } = useUser()

  const params = useParams()
  const pageName = params.pageName as string

  // console.log("Page name:", pageName)

  const [myEvents, setMyEvents] = useState<EventItem[]>()
  const [loadingEvents, setLoadingEvents] = useState(false)

  const [search, setSearch] = useState<string>("")
  const [page, setPage] = useState(1)

  const safeEvents = Array.isArray(myEvents) ? myEvents : []
  const orderedEvents = safeEvents

  const filteredSeenDrops = orderedEvents.filter(
    (item) =>
      (item.name ?? "").toLowerCase().includes((search ?? "").toLowerCase()) ||
      (item.description ?? "")
        .toLowerCase()
        .includes((search ?? "").toLowerCase())
  )

  const CARDS_PER_PAGE = 6
  const totalPages = Math.ceil(safeEvents.length / CARDS_PER_PAGE)
  const startIdx = (page - 1) * CARDS_PER_PAGE
  const currentSeenDrops = filteredSeenDrops.slice(
    startIdx,
    startIdx + CARDS_PER_PAGE
  )

  // Fetch events of the user
  const fetchMyEvents = useCallback(() => {
    if (pageName) {
      setLoadingEvents(true)
      axios
        .get(`/api/events?partnerPageName=${pageName}`)
        .then((res) => {
          setMyEvents(res.data.events)
          setPage(1)
        })
        .catch(() => {
          toast.error("Sorry! Can not fetch your SPARKBITS")
        })
        .finally(() => setLoadingEvents(false))
    }
  }, [pageName])

  useEffect(() => {
    fetchMyEvents()
  }, [fetchMyEvents])

  if (loadingEvents) {
    return <div className="mt-8">Loading your Events ...</div>
  }

  if (!isSignedIn) {
    return (
      <main className="flex h-full flex-col items-center justify-start pt-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-600 to-gray-900">
        <div className="text-center mt-8">
          <p className="text-lg text-white mb-6">User is not authorized!</p>
        </div>
      </main>
    )
  }

  // Useful cosole logs:
  // console.log("Clerk User:", user)
  // console.log("User's SPARKBITS:", mySeenDrops)

  return (
    <section className="w-full max-w-7xl flex flex-col items-center justify-center">
      <div className="flex lg:flex-row flex-col items-center justify-center lg:gap-16 gap-6 mb-6 mt-12">
        <div className="flex flex-row items-center justify-center gap-4">
          <Search />
          <Input
            type="text"
            placeholder="Search by content type or message"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-1 rounded w-[300px]"
          />
        </div>
      </div>

      {!loadingEvents && (
        <>
          <div className="flex flex-row flex-wrap items-center justify-center gap-10 mb-6">
            {currentSeenDrops
              .slice()
              .sort((a, b) =>
                "createdAt" in a && "createdAt" in b
                  ? new Date((b as SeenDropItem).createdAt).getTime() -
                    new Date((a as SeenDropItem).createdAt).getTime()
                  : 0
              )
              .map((item) => (
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
        </>
      )}
    </section>
  )
}
