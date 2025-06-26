"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

export default function Header() {
  const path = usePathname()
  const router = useRouter()

  return (
    <>
      <header className="z-100 row-start-1 flex flex-row items-center justify-between pt-6 pb-4 gap-4 w-[1280px]">
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
          <p className="text-4xl font-medium text-cyan-500">
            SEENDROP DEMO APP
          </p>
        </div>

        <div className="flex flex-row items-center justify-center gap-2">
          <p className="text-2xl font-medium text-white"></p>
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
          <Link href="/account">
            <p
              className={cn(
                "text-center text-2xl",
                path.startsWith("/account")
                  ? "text-orange-600 border-b-white border-b-2"
                  : "text-white"
              )}
            >
              ACCOUNT
            </p>
          </Link>
        </div>

        <Button onClick={() => router.push("/account")}>SIGN IN</Button>

        <ModeToggle />
      </header>
    </>
  )
}
