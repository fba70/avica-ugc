"use client"

import Image from "next/image"
import Link from "next/link"
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

export default function Header() {
  const path = usePathname()
  // const router = useRouter()

  const { isSignedIn, isLoaded } = useUser()
  // console.log("User:", user)

  if (!isLoaded) {
    return <div>Loading user data...</div>
  }

  // /Logo_SeenDrop.png
  // /Logo_AVICA.png

  return (
    <>
      <header className="z-100 row-start-1 flex lg:flex-row flex-col items-center justify-between  bg-black p-6 rounded-lg gap-6 lg:w-[1280px] w-[420px] mt-6">
        <div className="flex flex-row items-center justify-center gap-6">
          <Link href="/">
            <Image
              src="/Logo_SeenDrop.png"
              alt="Next.js logo"
              width={80}
              height={80}
              priority
            />
          </Link>
          <p className="text-4xl font-medium text-white">UGC DEMO</p>
        </div>

        <div className="flex flex-row items-center justify-center gap-6">
          <Link href="/">
            <p
              className={cn(
                "text-center text-2xl",
                path === "/"
                  ? "text-orange-600 border-b-white border-b-2"
                  : "text-white"
              )}
            >
              HOME
            </p>
          </Link>

          <Link href="/events">
            <p
              className={cn(
                "text-center text-2xl",
                path.startsWith("/events")
                  ? "text-orange-600 border-b-white border-b-2"
                  : "text-white"
              )}
            >
              EVENTS
            </p>
          </Link>

          {isSignedIn && (
            <Link href="/account">
              <p
                className={cn(
                  "text-center text-2xl",
                  path.startsWith("/account")
                    ? "text-orange-600 border-b-white border-b-2"
                    : "text-white"
                )}
              >
                SEENDROPS
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
              <div className="border border-gray-500 rounded-lg pr-4 pl-4 pt-1 pb-1">
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
