"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
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
import { Image as SDImage, Search } from "lucide-react"
import { toast } from "sonner"
// import { v4 as uuidv4 } from "uuid"

const imageSize: number = 800

interface UploadResults {
  secure_url?: string
  error?: string
  //[key: string]: any
}

export default function Event() {
  const router = useRouter()

  const [event, setEvent] = useState<EventItem>()
  const [seenDrops, setSeenDrops] = useState<SeenDropItem[]>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState<string>("")

  const [page, setPage] = useState(1)

  const [qrCodeData, setQrCodeData] = useState<string | null>(null)

  const safeSeenDrops = Array.isArray(seenDrops) ? seenDrops : []
  const filteredSeenDrops = safeSeenDrops.filter((item) =>
    (item.name ?? "").toLowerCase().includes((search ?? "").toLowerCase())
  )

  const params = useParams()
  const id = params.id as string

  // const event: EventItem | undefined = events.find((item) => item.id === id)

  const CARDS_PER_PAGE = 6
  const totalPages = Math.ceil(safeSeenDrops.length / CARDS_PER_PAGE)
  const startIdx = (page - 1) * CARDS_PER_PAGE
  const currentSeenDrops = filteredSeenDrops.slice(
    startIdx,
    startIdx + CARDS_PER_PAGE
  )

  const fetchSeenDrops = () => {
    setLoading(true)
    axios
      .get("/api/seendrops")
      .then((res) => {
        const filteredSDs = res.data.filter(
          (item: { eventId: string }) => item.eventId === id
        )
        setSeenDrops(filteredSDs)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to fetch events")
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchSeenDrops()
  }, [])

  const fetchEvents = () => {
    setLoading(true)
    axios
      .get(`/api/events?id=${id}`)
      .then((res) => {
        setEvent(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to fetch events")
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleCreateSeenDrop = () => {
    const imageUrl = event?.imageUrl
    router.push(
      `/seendrops?eventId=${id}&eventImageUrl=${encodeURIComponent(
        imageUrl || ""
      )}`
    )
  }

  if (loading) return <div>Loading SeenDrops...</div>
  if (error) return <div>{error}</div>

  const generateQR = async () => {
    // 1. Generate QR code
    // const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL}/events/${id}`
    const fullUrl = `https://avica-ugc-demo.vercel.app//events/${id}`

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
      axios.patch("/api/events", {
        id: id,
        qrcodeUrl: uploadResults.secure_url,
      })
    }
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
      <div className="flex lg:flex-row flex-col items-center justify-center gap-6 mb-12">
        <div className="flex flex-col items-center justify-center mt-12 gap-6">
          <EventCard cardInfo={event} showButton={false} />
        </div>

        <div className="flex flex-col items-center justify-center lg:mt-22 mt-4">
          {event.qrcodeUrl && (
            <>
              <Image
                src={event.qrcodeUrl}
                alt="Generated QR Code"
                width={360}
                height={360}
              />

              <div className="flex align-center justify-center gap-5 mt-2">
                <a
                  download
                  href={event.qrcodeUrl}
                  className="bg-black px-4 py-2 rounded-lg text-white text-sm"
                >
                  Download
                </a>
              </div>
            </>
          )}

          {!event.qrcodeUrl && qrCodeData && (
            <>
              <Image
                src={qrCodeData}
                alt="Generated QR Code"
                width={360}
                height={360}
              />

              <div className="flex align-center justify-center gap-5 mt-2">
                <a
                  download
                  href={qrCodeData}
                  className="bg-black px-4 py-2 rounded-lg text-white text-sm"
                >
                  Download
                </a>
              </div>
            </>
          )}

          {!event.qrcodeUrl && !qrCodeData && (
            <div className="flex align-center justify-center">
              <Button type="submit" onClick={generateQR}>
                Generate QR code
              </Button>
            </div>
          )}
        </div>
      </div>

      <Button onClick={handleCreateSeenDrop}>
        <SDImage />
        Create new SeenDrop!
      </Button>

      <Separator className="mt-12 mb-12" />

      <div className="mb-8 flex flex-row items-center justify-center gap-4">
        <Search />
        <Input
          type="text"
          placeholder="Search by SeenDrop user name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-1 rounded w-[300px]"
        />
      </div>

      <div className="flex flex-row flex-wrap items-center justify-center gap-10 mb-6">
        {currentSeenDrops
          .slice()
          .reverse()
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
    </div>
  )
}
