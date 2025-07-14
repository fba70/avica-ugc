"use client"

import { useEffect, useState, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { SeenDropItem, EventItem, UserItem } from "@/types/types"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import EventCard from "@/components/blocks/event-card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { CreateEventForm } from "@/components/forms/create-event"
import EventsCount from "@/components/blocks/events-counts"
import SDDailyStats from "@/components/blocks/sd-daily-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Partner() {
  const { isSignedIn, user, isLoaded } = useUser()

  const [dbUser, setDbUser] = useState<UserItem>()
  const [myEvents, setMyEvents] = useState<EventItem[]>()
  const [loadingUsers, setLoadingUsers] = useState(false)
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

  const CARDS_PER_PAGE = 3
  const totalPages = Math.ceil(safeEvents.length / CARDS_PER_PAGE)
  const startIdx = (page - 1) * CARDS_PER_PAGE
  const currentSeenDrops = filteredSeenDrops.slice(
    startIdx,
    startIdx + CARDS_PER_PAGE
  )

  // Save clerk user to DB and refetch data
  useEffect(() => {
    if (user?.id) {
      setLoadingUsers(true)

      // Save clerk user to DB and refetch his DB data
      axios
        .get(`/api/user?externalId=${user.id}`)
        .then((res) => {
          setDbUser(res.data[0])
          // console.log("Initial DB user saved to state:", res.data)

          // If no user found by externalId, create new one in DB
          if (Array.isArray(res.data) && res.data.length === 0) {
            const userData = {
              firstName: user?.firstName || "John",
              lastName: user?.lastName || "Doe",
              email:
                user?.primaryEmailAddress?.emailAddress || "No email provided",
              externalId: user?.id || "No external ID",
              role: "partner",
            }
            axios
              .post("/api/user", userData)
              .then(() => {
                // Refetch user info after creating new user
                return axios.get(`/api/user?externalId=${user.id}`)
              })
              .then((res) => {
                setDbUser(res.data)
                // console.log("DB user saved to state:", res.data)
              })
          }
        })
        .finally(() => setLoadingUsers(false))
    }
  }, [user])

  // Fetch events of the user
  const fetchMyEvents = useCallback(() => {
    if (dbUser && dbUser.id) {
      setLoadingEvents(true)
      axios
        .get(`/api/events?userId=${dbUser.id}`)
        .then((res) => {
          setMyEvents(res.data)
          setPage(1)
        })
        .catch(() => {
          toast.error("Sorry! Can not fetch your SeenDrops")
        })
        .finally(() => setLoadingEvents(false))
    }
  }, [dbUser])

  useEffect(() => {
    fetchMyEvents()
  }, [dbUser, fetchMyEvents])

  if (!isLoaded || loadingUsers) {
    return <div className="mt-8">Loading user data...</div>
  }

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
  // console.log("DB User:", dbUser)
  // console.log("User's SeenDrops:", mySeenDrops)

  return (
    <section className="w-full max-w-7xl flex flex-col items-center justify-center">
      <div className="w-[1280px] flex flex-col lg:flex-row lg:justify-between gap-6 mt-16 px-6">
        <div className="text-center text-2xl font-bold text-white">
          Here are your Events, {user.fullName}!
        </div>

        <p>
          User role: <span className="uppercase">{dbUser?.role}</span>
        </p>
      </div>

      <Separator className="mt-12 mb-12 bg-gray-400" />

      <Tabs
        defaultValue="events"
        className="w-full flex flex-col items-center justify-center mb-8"
      >
        <TabsList className="gap-4 ">
          <TabsTrigger value="events" className="text-2xl text-white">
            EVENTS
          </TabsTrigger>
          <TabsTrigger value="stats" className="text-2xl text-white">
            STATISTICS
          </TabsTrigger>
          <TabsTrigger value="billing" className="text-2xl text-white">
            BILLING
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          {isSignedIn && dbUser && dbUser.role === "partner" && (
            <div className="flex flex-row items-center justify-center mb-8 mt-8">
              <CreateEventForm
                onEventCreated={fetchMyEvents}
                userId={dbUser?.id}
              />
            </div>
          )}

          <div className="flex lg:flex-row flex-col items-center justify-center lg:gap-16 gap-6 mb-6">
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
                    <EventCard
                      cardInfo={item}
                      showButton={true}
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
        </TabsContent>

        <TabsContent value="stats">
          <div className="w-full flex flex-col items-center lg:justify-between justify-center gap-6 my-8">
            <div className="text-center text-2xl font-bold text-white">
              Events Statistics
            </div>

            <div className="flex flex-row items-center justify-center gap-8 flex-wrap mt-6">
              <EventsCount />

              <SDDailyStats />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <div className="w-full flex flex-col items-center lg:justify-between justify-center gap-6 my-8">
            <div className="text-center text-2xl font-bold text-white">
              Account Billing Data
            </div>

            <p></p>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
