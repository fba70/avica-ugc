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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { House, Image as ImagePic, MapPinCheck } from "lucide-react"
import axios from "axios"
import { UserItem } from "@/types/types"
import { v4 as uuidv4 } from "uuid"
import { toast } from "sonner"

// DialogTrigger
// import { ModeToggle } from "@/components/mode-toggle"

type PendingUserData = {
  firstName: string
  lastName: string
  email: string
  externalId: string
  pageName: string
}

export default function Header() {
  const path = usePathname()

  const { isSignedIn, user } = useUser()

  const [dbUser, setDbUser] = useState<UserItem>()
  const [loadingUser, setLoadingUser] = useState(false)

  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [pendingUserData, setPendingUserData] = useState<PendingUserData>()

  // Hardcoded free trial product ID
  const freeTrialProductId = "ba63139f-7b0e-4b81-b318-fb0b7a3f8a22"

  useEffect(() => {
    if (user?.id) {
      setLoadingUser(true)
      axios
        .get(`/api/user?externalId=${user.id}`)
        .then((res) => {
          setDbUser(res.data[0])
          // If no user found by externalId, prepare userData and show role dialog
          if (Array.isArray(res.data) && res.data.length === 0) {
            const userData = {
              firstName: user?.firstName || "John",
              lastName: user?.lastName || "Doe",
              email:
                user?.primaryEmailAddress?.emailAddress || "No email provided",
              externalId: user?.id || "No external ID",
              pageName: user?.id || uuidv4(),
            }
            setPendingUserData(userData)
            setShowRoleDialog(true)
          }
        })
        .finally(() => setLoadingUser(false))
    }
  }, [user])

  // Handler for user role selection
  const handleRoleSelect = (role: "user" | "partner") => {
    if (!pendingUserData) return

    const userData = { ...pendingUserData, role }
    setShowRoleDialog(false)
    setLoadingUser(true)

    axios
      .post("/api/user", userData)
      .then(() => axios.get(`/api/user?externalId=${user?.id}`))
      .then(async (res) => {
        const newUser = res.data[0]
        setDbUser(newUser)
        // Assign trial product instance if user is a partner
        if (newUser?.role === "partner") {
          try {
            // Fetch all product instances for this user
            const instancesRes = await axios.get(
              `/api/product-instances?userId=${newUser.id}`
            )
            const hasTrial = Array.isArray(instancesRes.data)
              ? instancesRes.data.some(
                  (inst) => inst.productId === freeTrialProductId
                )
              : false

            if (!hasTrial) {
              await axios.post(
                `/api/product-instances?userId=${newUser.id}&productId=${freeTrialProductId}`
              )
            }
            // else do nothing, trial already assigned
          } catch (err) {
            toast.error("Can't assign trial product to new partner user")
            console.log("Error assigning trial product:", err)
          }
        }
      })
      .finally(() => setLoadingUser(false))
    setPendingUserData(undefined)
  }

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
      <header className="z-100 row-start-1 flex lg:flex-row flex-col items-center justify-between bg-[url('/HBG_1.jpg')] bg-cover bg-center py-4 px-6 rounded-lg gap-6 lg:w-[1280px] w-[420px] mt-2">
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
          <div className="bg-gray-700 rounded-lg p-4 shadow-orange-400/30 shadow-[4px_8px_24px_0px_rgba(255,140,0,0.3)]">
            <p className="lg:text-4xl text-3xl font-medium bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              SPARKBITS
            </p>
          </div>
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
                ACCOUNT
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

        <Dialog open={showRoleDialog}>
          <DialogContent className="w-[400px]">
            <DialogHeader>
              <DialogTitle>Select your account type</DialogTitle>
              <DialogDescription>
                Users can create SPARKBITS. Partners can purchase products and
                create new Events.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 items-center">
              <Button
                onClick={() => handleRoleSelect("user")}
                className="w-[120px] gap-2"
              >
                <ImagePic />
                User
              </Button>
              <Button
                onClick={() => handleRoleSelect("partner")}
                className="w-[120px] gap-2"
              >
                <MapPinCheck />
                Partner
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>
    </>
  )
}

// <ModeToggle />
