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
          <p className="text-4xl font-medium text-white">SEENDROP DEMO APP</p>
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

        <div className="flex flex-row items-center justify-center gap-6">
          <Button onClick={() => router.push("/account")}>SIGN IN</Button>

          <ModeToggle />
        </div>
      </header>
    </>
  )
}
