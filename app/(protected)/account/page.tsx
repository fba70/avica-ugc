"use client"

import { useEffect, useState, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { SeenDropItem, UserItem } from "@/types/types"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import SeenDropCard from "@/components/blocks/seendrop-card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export default function Account() {
  const { isSignedIn, user, isLoaded } = useUser()

  const [dbUser, setDbUser] = useState<UserItem>()
  const [mySeenDrops, setMySeenDrops] = useState<SeenDropItem[]>()
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingSeenDrops, setLoadingSeenDrops] = useState(false)

  const [search, setSearch] = useState<string>("")
  const [page, setPage] = useState(1)

  const safeSeenDrops = Array.isArray(mySeenDrops) ? mySeenDrops : []
  const orderedSeenDrops = safeSeenDrops

  const filteredSeenDrops = orderedSeenDrops.filter(
    (item) =>
      (item.message ?? "")
        .toLowerCase()
        .includes((search ?? "").toLowerCase()) ||
      (item.type ?? "").toLowerCase().includes((search ?? "").toLowerCase())
  )

  const CARDS_PER_PAGE = 6
  const totalPages = Math.ceil(safeSeenDrops.length / CARDS_PER_PAGE)
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
              role: "user",
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

  // Fetch seendrops of the user
  const fetchMySeenDrops = useCallback(() => {
    if (dbUser && dbUser.id) {
      setLoadingSeenDrops(true)
      axios
        .get(`/api/seendrops?userId=${dbUser.id}`)
        .then((res) => {
          setMySeenDrops(res.data)
          setPage(1)
        })
        .catch(() => {
          toast.error("Sorry! Can not fetch your SeenDrops")
        })
        .finally(() => setLoadingSeenDrops(false))
    }
  }, [dbUser])

  useEffect(() => {
    fetchMySeenDrops()
  }, [dbUser, fetchMySeenDrops])

  // Claim seendrops if there is claimToken in local Storage (newly signed up users)
  useEffect(() => {
    const claimToken = localStorage.getItem("seendropClaimToken")
    if (dbUser?.id && claimToken) {
      axios
        .post("/api/seendrops/claim", {
          claimToken,
          userId: dbUser.id,
        })
        .then(() => {
          localStorage.removeItem("seendropClaimToken")
          // Optionally, refetch user's SeenDrops here
          axios
            .get(`/api/seendrops?userId=${dbUser.id}`)
            .then((res) => setMySeenDrops(res.data))
        })
        .catch((err) => {
          console.error("Failed to claim SeenDrop:", err)
          toast.error("Sorry! Can't your SeenDrops")
        })
    }
  }, [dbUser])

  if (!isLoaded || loadingUsers) {
    return <div className="mt-8">Loading user data...</div>
  }

  if (loadingSeenDrops) {
    return <div className="mt-8">Loading your SeenDrops ...</div>
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
    <>
      <section className="max-w-7xl flex flex-col items-center justify-center">
        <div className="w-full flex flex-col lg:flex-row items-center lg:justify-between justify-center gap-6 mt-16 px-6">
          <div className="text-center text-2xl font-bold text-white">
            Here are your SeenDrops, {user.fullName}!
          </div>

          <p>
            User role: <span className="uppercase">{dbUser?.role}</span>
          </p>
        </div>

        <Separator className="mt-12 mb-12 bg-gray-400" />

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

        {!loadingSeenDrops && (
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
                  <SeenDropCard
                    seenDropInfo={item}
                    key={item.id}
                    onSeenDropCreated={fetchMySeenDrops}
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
      </section>
    </>
  )
}

/*
// Role update form
  const FormSchema = z.object({
    userType: z.enum(["user", "partner"], {
      required_error: "You need to select a notification type.",
    }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userType: dbUser?.role === "partner" ? "partner" : "user",
    },
  })

  // Reset form defaults when dbUser.role changes
  useEffect(() => {
    if (dbUser?.role) {
      form.reset({
        userType: dbUser.role === "partner" ? "partner" : "user",
      })
    }
  }, [dbUser?.role, form])

// Update user role
  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!dbUser?.id) {
      toast.error("Sorry! No user ID is found")
      return
    }

    // console.log("Submitting update:", { ...dbUser, role: data.userType })

    axios
      .put("/api/user", {
        ...dbUser,
        role: data.userType,
      })
      .then((res) => {
        setDbUser(res.data)
        // TBD - show success message, etc.
      })
      .catch((err) => {
        console.error("Failed to update user role:", err)
        toast.error("Sorry! Can not update the role of the user")
        // TBD - show error message, etc.
      })
  }


<Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-row items-center justify-center space-x-6"
            >
              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-center space-x-4">
                    <FormLabel>My account type:</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row items-center justify-center space-x-2"
                      >
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <RadioGroupItem value="user" />
                          </FormControl>
                          <FormLabel className="font-normal">User</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <RadioGroupItem value="partner" />
                          </FormControl>
                          <FormLabel className="font-normal">Partner</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save</Button>
            </form>
          </Form>
*/
