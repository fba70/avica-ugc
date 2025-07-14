"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
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

export default function Header() {
  const path = usePathname()
  // const router = useRouter()

  const { isSignedIn, isLoaded, user } = useUser()
  // console.log("User:", user)

  const [dbUser, setDbUser] = useState<UserItem>()
  const [loadingUser, setLoadingUser] = useState(false)

  useEffect(() => {
    if (user?.id) {
      setLoadingUser(true)

      axios.get(`/api/user?externalId=${user.id}`).then((res) => {
        setDbUser(res.data[0])
        setLoadingUser(false)
      })
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

  if (!isLoaded || loadingUser) {
    return <div>Loading user data...</div>
  }

  return (
    <>
      <header className="z-100 row-start-1 flex lg:flex-row flex-col items-center justify-between  bg-[url('/HBG_1.jpg')] bg-cover bg-center p-6 rounded-lg gap-6 lg:w-[1280px] w-[420px] mt-6">
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
          <p className="text-4xl font-medium text-white">AVICA MYFLIX</p>
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
                MY SEENDROPS
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
            <SignedIn>
              <div className="border border-gray-300 rounded-lg pr-4 pl-4 pt-1 pb-1">
                <UserButton showName />
              </div>
            </SignedIn>
          </div>

          <ModeToggle />
        </div>
      </header>
    </>
  )
}
