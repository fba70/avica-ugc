"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { SeenDropItem, UserItem } from "@/types/types"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import SeenDropCard from "@/components/blocks/seendrop-card"
import { Button } from "@/components/ui/button"

export default function Account() {
  const { isSignedIn, user, isLoaded } = useUser()
  console.log("User:", user)

  const [dbUser, setDbUser] = useState<UserItem>()
  const [mySeenDrops, setMySeenDrops] = useState<SeenDropItem[]>()
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingSeenDrops, setLoadingSeenDrops] = useState(false)

  const [search, setSearch] = useState<string>("")
  const [page, setPage] = useState(1)

  const safeSeenDrops = Array.isArray(mySeenDrops) ? mySeenDrops : []
  const orderedSeenDrops = safeSeenDrops
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  const filteredSeenDrops = orderedSeenDrops.filter((item) =>
    (item.message ?? "").toLowerCase().includes((search ?? "").toLowerCase())
  )

  const CARDS_PER_PAGE = 6
  const totalPages = Math.ceil(safeSeenDrops.length / CARDS_PER_PAGE)
  const startIdx = (page - 1) * CARDS_PER_PAGE
  const currentSeenDrops = filteredSeenDrops.slice(
    startIdx,
    startIdx + CARDS_PER_PAGE
  )

  useEffect(() => {
    if (user?.id) {
      setLoadingUsers(true)

      // Save clerk user to DB and refetch his DB data
      axios
        .get(`/api/user?externalId=${user.id}`)
        .then((res) => {
          setDbUser(res.data[0])
          console.log("Initial DB user saved to state:", res.data)

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
                console.log("DB user saved to state:", res.data)
              })
          }
        })
        .finally(() => setLoadingUsers(false))
    }
  }, [user])

  useEffect(() => {
    if (dbUser && dbUser.id) {
      console.log("Fetching SeenDrops for userId:", dbUser.id)
      setLoadingSeenDrops(true)
      axios
        .get(`/api/seendrops?userId=${dbUser.id}`)
        .then((res) => {
          setMySeenDrops(res.data)
          console.log("Fetched seen drops:", res.data)
        })
        .catch(() => {
          console.error("Failed to fetch seen drops")
        })
        .finally(() => setLoadingSeenDrops(false))
    }
  }, [dbUser])

  console.log("DB Users:", dbUser)
  console.log("My Seen Drops:", mySeenDrops)

  if (!isLoaded || loadingUsers) {
    return <div>Loading user data...</div>
  }

  if (loadingSeenDrops) {
    return <div>Loading your SeenDrops ...</div>
  }

  if (!isSignedIn) {
    return (
      <main className="flex h-full flex-col items-center justify-start pt-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-600 to-gray-900">
        <div className="text-center">
          <p className="text-lg text-white mb-6">User is not authorized!</p>
        </div>
      </main>
    )
  }
  return (
    <>
      <main className="flex h-full flex-col items-center justify-start pt-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-600 to-gray-900">
        <div className="text-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-12">
              Here are you SeenDrops, {user.fullName}!
            </div>
          </div>
        </div>

        <div className="flex lg:flex-row flex-col items-center justify-center lg:gap-16 gap-6 mb-6">
          <div className="flex flex-row items-center justify-center gap-4">
            <Search />
            <Input
              type="text"
              placeholder="Search by SeenDrop user name"
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
                  <SeenDropCard seenDropInfo={item} key={item.id} />
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
      </main>
    </>
  )
}
