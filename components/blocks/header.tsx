"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { House } from "lucide-react"
import axios from "axios"
import { UserItem } from "@/types/types"

// import { ModeToggle } from "@/components/mode-toggle"

export default function Header() {
  const path = usePathname()
  // const router = useRouter()

  const { isSignedIn, user } = useUser()
  // console.log("User:", user)

  const [dbUser, setDbUser] = useState<UserItem>()
  const [loadingUser, setLoadingUser] = useState(false)

  useEffect(() => {
    if (user?.id) {
      setLoadingUser(true)

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
        .finally(() => setLoadingUser(false))
    }
  }, [user])

  useEffect(() => {
    if (user?.id) {
      axios.post("/api/clerk", {
        userId: user.id,
        userRole: dbUser?.role,
      })
    }
  }, [user, dbUser])

  // console.log("User:", user)
  // console.log("DB User:", dbUser)

  return (
    <>
      <header className="z-100 row-start-1 flex lg:flex-row flex-col items-center justify-between  bg-[url('/HBG_1.jpg')] bg-cover bg-center py-4 px-6 rounded-lg gap-6 lg:w-[1280px] w-[420px] mt-6">
        <div className="flex flex-row items-center justify-center gap-6">
          <Link href="/">
            <Image
              src="/Logo_AVICA.png"
              alt="Next.js logo"
              width={80}
              height={80}
              priority
            />
          </Link>
          <p className="lg:text-4xl text-3xl font-medium text-white ">
            <span className="text-orange-600">AVICA</span>{" "}
            <span className="">SPARKBITS</span>
          </p>
        </div>

        <div className="flex flex-row items-center justify-center gap-6">
          <Link href="/">
            <p
              className={cn(
                "text-center text-2xl",
                path === "/"
                  ? "text-white border-b-white border-b-2"
                  : "text-white"
              )}
            >
              <House />
            </p>
          </Link>

          <Link href="/events">
            <p
              className={cn(
                "text-center text-2xl",
                path.startsWith("/events")
                  ? "text-white border-b-white border-b-2"
                  : "text-white"
              )}
            >
              EVENTS
            </p>
          </Link>

          {isSignedIn && dbUser?.role === "user" && (
            <Link href="/account">
              <p
                className={cn(
                  "text-center text-2xl",
                  path.startsWith("/account")
                    ? "text-white border-b-white border-b-2"
                    : "text-white"
                )}
              >
                MY SPARKBITS
              </p>
            </Link>
          )}

          {isSignedIn && dbUser?.role === "partner" && (
            <Link href="/admin">
              <p
                className={cn(
                  "text-center text-2xl",
                  path.startsWith("/admin")
                    ? "text-white border-b-white border-b-2"
                    : "text-white"
                )}
              >
                MY EVENTS
              </p>
            </Link>
          )}
        </div>

        <div className="flex flex-row items-center justify-center gap-6">
          <div className="flex flex-row items-center justify-center gap-4">
            <SignedOut>
              <SignInButton>
                <Button variant="outline">Sign In</Button>
              </SignInButton>
              <SignUpButton>
                <Button>Sign Up</Button>
              </SignUpButton>
            </SignedOut>
            {loadingUser ? (
              <span className="text-white text-sm">Loading user data...</span>
            ) : (
              <SignedIn>
                <div className="border border-gray-300 rounded-lg pr-4 pl-4 pt-1 pb-1">
                  <UserButton showName />
                </div>
              </SignedIn>
            )}
          </div>
        </div>
      </header>
    </>
  )
}

// <ModeToggle />
