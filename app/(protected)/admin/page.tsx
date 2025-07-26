"use client"

import { useEffect, useState, useCallback, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { SeenDropItem, EventItem, UserItem } from "@/types/types"
import { Input } from "@/components/ui/input"
import { Search, Eye } from "lucide-react"
import EventCard from "@/components/blocks/event-card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { CreateEventForm } from "@/components/forms/create-event"
import EventsCount from "@/components/charts/events-counts"
import SDDailyStats from "@/components/charts/sd-daily-stats"
import MonthlyImages from "@/components/charts/monthly-images"
import MonthlyVideos from "@/components/charts/monthly-videos"
import MonthlyUsers from "@/components/charts/monthly-users"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { FormError } from "@/components/forms/form-error"
import { FormSuccess } from "@/components/forms/form-success"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { PageNameSchema } from "@/schemas"
import AccountPurchases from "@/components/blocks/account-purchases"

export default function Partner() {
  const router = useRouter()

  const { isSignedIn, user, isLoaded } = useUser()

  const [dbUser, setDbUser] = useState<UserItem>()
  const [myEvents, setMyEvents] = useState<EventItem[]>()
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingEvents, setLoadingEvents] = useState(false)

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")

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

  const form = useForm<z.infer<typeof PageNameSchema>>({
    resolver: zodResolver(PageNameSchema),
    defaultValues: {
      pageName: dbUser?.pageName || "",
    },
  })

  const onSubmitEvent = (values: z.infer<typeof PageNameSchema>) => {
    setError("")
    setSuccess("")

    // console.log(values)

    const parsed = PageNameSchema.safeParse(values)
    if (!parsed.success) {
      setError("Invalid form data. Please check your inputs.")
      return
    }

    axios
      .get(`/api/user?pageName=${values.pageName}`)
      .then((res) => {
        if (res.data.count > 0) {
          setError(
            "This page name is already taken. Please choose another one."
          )
          return // Stop form update
        }

        // Proceed with update if count is 0
        startTransition(() => {
          axios
            .put("/api/user", {
              ...dbUser,
              pageName: values.pageName || dbUser?.pageName,
            })
            .then(() => {
              toast.success("Page name updated!")
              setSuccess("Page name updated successfully!")
            })
            .catch(() => {
              toast.error("Page name was not updated!")
              setError("Failed to update page name")
            })
        })
      })
      .catch(() => {
        setError("Failed to check page name uniqueness")
      })
  }

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
          toast.error("Sorry! Can not fetch your SPARKBITS")
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

  return (
    <section className="w-full max-w-7xl flex flex-col items-center justify-center">
      <div className="lg:w-[1280px] w-[420px] flex flex-col lg:flex-row lg:justify-between justify-center items-center gap-6 lg:mt-16 mt-8 px-6">
        <div className="text-center text-2xl font-bold text-white">
          Here are your Events, {user.fullName}!
        </div>

        <p>
          User role: <span className="uppercase">{dbUser?.role}</span>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-center mt-10 gap-12 lg: w-full lg:justify-between px-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitEvent)}
            className="flex lg:flex-row flex-col items-center justify-center gap-6"
          >
            <FormField
              control={form.control}
              name="pageName"
              render={({ field }) => (
                <FormItem className="flex lg:flex-row flex-col gap-4 items-center justify-center">
                  <FormLabel className="w-[220px]">
                    Landing page name:
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder={dbUser?.pageName || "Untitled"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isPending} type="submit" className="w-auto">
              Update your landing page name
            </Button>

            <FormError message={error} />
            <FormSuccess message={success} />
          </form>
        </Form>

        <Button
          className="flex flex-row items-center justify-center gap-4"
          onClick={() => router.push(`/${dbUser?.pageName}`)}
        >
          <Eye />
          <p className="pr-2 text-sm">View your events landing page</p>
        </Button>
      </div>

      <Separator className="mt-12 mb-12 bg-gray-400" />

      <Tabs
        defaultValue="events"
        className="w-full flex flex-col items-center justify-center mb-8"
      >
        <TabsList className="gap-4 ">
          <TabsTrigger
            value="events"
            className="lg:text-2xl text-sm text-white"
          >
            EVENTS
          </TabsTrigger>
          <TabsTrigger value="stats" className="lg:text-2xl text-sm text-white">
            STATISTICS
          </TabsTrigger>
          <TabsTrigger
            value="purchases"
            className="lg:text-2xl text-sm text-white"
          >
            PURCHASES
          </TabsTrigger>
          <TabsTrigger
            value="payments"
            className="lg:text-2xl text-sm text-white"
          >
            PAYMENTS
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
                      showCounts={true}
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

              <MonthlyImages />

              <MonthlyVideos />

              <MonthlyUsers />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="purchases">
          <div className="w-full flex flex-col items-center lg:justify-between justify-center gap-6 my-8">
            {dbUser?.id ? (
              <AccountPurchases userId={dbUser.id} />
            ) : (
              <p>No user purchases data is found</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <div className="w-full flex flex-col items-center lg:justify-between justify-center gap-6 my-8">
            <div className="text-center text-2xl font-bold text-white">
              Account Payments
            </div>

            <p></p>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
