"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { SignUpButton } from "@clerk/nextjs"
import Image from "next/image"
import { EventItem, SeenDropItem } from "@/types/types"
import { Input } from "@/components/ui/input"
import EventCard from "@/components/blocks/event-card"
import SeenDropCard from "@/components/blocks/seendrop-card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import QrCode from "qrcode"
import axios from "axios"
import { imageUploadCloudinary } from "@/actions/upload-image"
import {
  Image as SDImage,
  Search,
  Download,
  ArrowLeftRight,
  BookAlert,
} from "lucide-react"
import { toast } from "sonner"
import { EditEventForm } from "@/components/forms/edit-event"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
// import { v4 as uuidv4 } from "uuid"

const imageSize: number = 800

interface UploadResults {
  secure_url?: string
  error?: string
  //[key: string]: any
}

export default function Event() {
  const router = useRouter()

  const params = useParams()
  // const id = params.id as string
  const pageName = params.pageName as string
  // console.log("Page name:", pageName)

  const { isSignedIn, isLoaded, user } = useUser()

  const [event, setEvent] = useState<EventItem>()
  const [seenDrops, setSeenDrops] = useState<SeenDropItem[]>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState<string>("")

  const [page, setPage] = useState(1)

  const [qrCodeData, setQrCodeData] = useState<string | null>(null)

  const [flip, setFlip] = useState(false)

  const [openDialog, setOpenDialog] = useState(false)

  // Temporary unregistered users free images limit
  const MAX_UNREGISTERED_IMAGES = 5
  const [unregImageCount, setUnregImageCount] = useState<number>(0)

  useEffect(() => {
    if (!isSignedIn) {
      const count = Number(sessionStorage.getItem("unreg_image_count") || "0")
      setUnregImageCount(count)
    }
  }, [isSignedIn])

  const safeSeenDrops = Array.isArray(seenDrops) ? seenDrops : []
  const orderedSeenDrops = safeSeenDrops
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  const filteredSeenDrops = orderedSeenDrops.filter(
    (item) =>
      (item.name ?? "").toLowerCase().includes((search ?? "").toLowerCase()) ||
      (item.type ?? "").toLowerCase().includes((search ?? "").toLowerCase())
  )

  // const event: EventItem | undefined = events.find((item) => item.id === id)

  const CARDS_PER_PAGE = 6
  const totalPages = Math.ceil(safeSeenDrops.length / CARDS_PER_PAGE)
  const startIdx = (page - 1) * CARDS_PER_PAGE
  const currentSeenDrops = filteredSeenDrops.slice(
    startIdx,
    startIdx + CARDS_PER_PAGE
  )

  const fetchEvent = () => {
    setLoading(true)
    axios
      .get(`/api/events?pageName=${pageName}`)
      .then((res) => {
        setEvent(res.data.events[0])
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to fetch events")
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchEvent()
  }, [])

  const fetchSeenDrops = () => {
    setLoading(true)
    axios
      .get(`/api/seendrops?eventId=${event?.id}`)
      .then((res) => {
        setSeenDrops(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to fetch events")
        setLoading(false)
      })
  }

  useEffect(() => {
    if (event?.id) {
      fetchSeenDrops()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.id])

  const handleCreateSeenDrop = () => {
    if (!isSignedIn) {
      const newCount = unregImageCount + 1
      sessionStorage.setItem("unreg_image_count", String(newCount))
      setUnregImageCount(newCount) // Re-render immediately
      if (newCount > MAX_UNREGISTERED_IMAGES) return // Prevent further navigation
    }

    router.push(`/seendrops?eventId=${event?.id}`)
  }

  if (!isLoaded) {
    return <div className="mt-8">Loading user data...</div>
  }

  if (loading) return <div className="mt-8">Loading SPARKBITS...</div>
  if (error) return <div className="mt-8">{error}</div>

  const generateQR = async () => {
    // 1. Generate QR code

    const fullUrl = `${process.env.PRODUCTION_URL}/events/${event?.pageName}`

    const qrCodeDataUrl = await QrCode.toDataURL(fullUrl, {
      width: imageSize,
    })

    setQrCodeData(qrCodeDataUrl)

    // 2. Upload QR code to Cloudinary
    const overlayFlag = false as boolean // Set to true if you want to overlay the QR code on an image
    const uploadResults: UploadResults = await imageUploadCloudinary(
      qrCodeDataUrl,
      overlayFlag
    )

    if (!uploadResults.secure_url) {
      toast.error("Can't upload QR code image")
      return
    }

    // console.log(uploadResults)

    // 3. Save QR code to DB
    if (uploadResults) {
      axios.put("/api/events", {
        id: event?.id,
        qrcodeUrl: uploadResults.secure_url,
      })
    }
  }

  const handleEventCreated = () => {
    fetchEvent()
  }

  if (!event) {
    return (
      <div className="max-w-7xl flex flex-col items-center justify-center">
        Please wait. Loading event data ...
      </div>
    )
  }

  return (
    <div className="max-w-7xl flex flex-col items-center justify-center">
      <div className="flex lg:flex-row flex-col items-center justify-center gap-6 mb-8">
        {!flip && (
          <div className="flex flex-col items-center justify-center mt-12 gap-6">
            <EventCard cardInfo={event} showCounts={false} showButton={false} />
          </div>
        )}

        {flip && (
          <div className="flex flex-col items-center justify-center lg:mt-22 mt-4">
            {event.qrcodeUrl && (
              <div className="flex flex-col items-center justify-center gap-4 w-[350px] bg-gray-600 pb-6 pt-4">
                <p>Event QR code</p>
                <Image
                  src={event.qrcodeUrl}
                  alt="Generated QR Code"
                  width={320}
                  height={320}
                />

                <div className="flex align-center justify-center gap-5 mt-2">
                  <a
                    download
                    href={event.qrcodeUrl}
                    className="flex flex-row align-center justify-center gap-2 bg-gray-700 px-4 py-2 rounded-lg text-white text-sm"
                  >
                    <Download size={16} />
                    Download
                  </a>
                </div>
              </div>
            )}

            {!event.qrcodeUrl && qrCodeData && (
              <div className="flex flex-col items-center justify-center gap-4 w-[350px] bg-gray-600 pb-6 pt-4">
                <p>Event QR code</p>
                <Image
                  src={qrCodeData}
                  alt="Generated QR Code"
                  width={320}
                  height={320}
                />

                <div className="flex align-center justify-center gap-5">
                  <a
                    download
                    href={qrCodeData}
                    className="bg-gray-700 px-4 py-2 rounded-lg text-white text-sm"
                  >
                    Download
                  </a>
                </div>
              </div>
            )}

            {!event.qrcodeUrl && !qrCodeData && (
              <div className="flex align-center justify-center">
                <Button type="submit" onClick={generateQR}>
                  Generate QR code
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center gap-6">
        <Button
          variant="secondary"
          onClick={() => setFlip(!flip)}
          className="w-[150px]"
        >
          <ArrowLeftRight />
          {!flip ? "QR code" : "Event card"}
        </Button>

        {user?.publicMetadata.userRole === "partner" && (
          <EditEventForm event={event} onSuccess={handleEventCreated} />
        )}
      </div>

      <Separator className="mt-10 mb-10 bg-gray-400" />

      {!isSignedIn && (
        <p className="mb-8">
          Unregistered users can only create up to {MAX_UNREGISTERED_IMAGES}{" "}
          <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            SPARKBITS
          </span>
        </p>
      )}

      <div className="flex lg:flex-row flex-col items-center justify-center lg:gap-16 gap-6 mb-8">
        {!isSignedIn && (
          <p>
            Sign In/Up to save your{" "}
            <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              SPARKBITS
            </span>
          </p>
        )}

        {(isSignedIn ||
          (!isSignedIn && unregImageCount < MAX_UNREGISTERED_IMAGES)) && (
          <Button onClick={handleCreateSeenDrop}>
            <SDImage />
            Create new SPARKBIT
          </Button>
        )}

        {!isSignedIn && (
          <>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => setOpenDialog(true)}>
                  <BookAlert />
                  Claim your SPARKBIT
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[350px]">
                <DialogHeader>
                  <DialogTitle className="text-base text-center">
                    Sign up to claim your SPARKBIT
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center py-4">
                  <SignUpButton mode="modal">
                    <Button variant="default">Sign Up / Sign In</Button>
                  </SignUpButton>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}

        <div className="flex flex-row items-center justify-center gap-4">
          <Search />
          <Input
            type="text"
            placeholder="Search by SPARKBIT name or type"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-1 rounded w-[300px]"
          />
        </div>
      </div>

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
              onSeenDropCreated={fetchSeenDrops}
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
        <span className="text-sm">
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
    </div>
  )
}
