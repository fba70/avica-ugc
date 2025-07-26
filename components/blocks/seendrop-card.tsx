"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ShareSeenDrop } from "@/components/blocks/share-seendrop"
import { SeenDropItem, UserItem, EventItem } from "@/types/types"
import { Button } from "../ui/button"
import { SquarePlay, LoaderCircle, Download } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { videoUploadCloudinary } from "@/actions/upload-video"
import { v4 as uuidv4 } from "uuid"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useUser, SignUpButton } from "@clerk/nextjs"

interface UploadResults {
  secure_url?: string
  error?: string
}

export default function SeenDropCard({
  seenDropInfo,
  onSeenDropCreated,
}: {
  seenDropInfo: SeenDropItem
  onSeenDropCreated: () => void
}) {
  const { isSignedIn, user } = useUser()

  const claimToken = uuidv4() as string

  const [dbUser, setDbUser] = useState<UserItem>()
  const [event, setEvent] = useState<EventItem>()
  const [loadingVideo, setLoadingVideo] = useState(false)
  const [videoSeenDrop, setSetVideoSeenDrop] = useState<SeenDropItem>()
  const [openDialog, setOpenDialog] = useState(false)

  // Fetch user from DB based on clerk session
  useEffect(() => {
    if (isSignedIn && user?.id) {
      axios
        .get(`/api/user?externalId=${user.id}`)
        .then((res) => setDbUser(res.data[0]))
    }
  }, [isSignedIn, user])

  // Fetch event data - need event logos etc.
  useEffect(() => {
    if (seenDropInfo.eventId) {
      axios
        .get(`/api/events`, { params: { id: seenDropInfo.eventId } })
        .then((res) => setEvent(res.data))
        .catch((err) => {
          console.error("Failed to fetch event:", err)
        })
    }
  }, [seenDropInfo.eventId])

  // console.log("DB user:", dbUser)
  // console.log("SPARKBIT info:", seenDropInfo)

  const handleGenerateVideo = async () => {
    setLoadingVideo(true)

    if ((event?.videosCount ?? 0) <= 0) {
      toast.error("No more video SPARKBITS left for this event!")
      return
    }

    // 1. Define the prompt for animation
    const prompt = "Animate the image moving the human around" // Make prompt be Event dependent

    // 2. Generate video with Replicate
    const response = await fetch("/api/video-gen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ugcUrl: seenDropInfo.imageUrl,
        prompt: prompt,
      }),
    })

    const videoData = await response.json()
    // console.log("Generated video URL:", videoData.output)

    if (response.status !== 201) {
      console.log("Video generation error")
      toast.error("Video generation failed!")
      setLoadingVideo(false)
      return
    }

    toast.success("Video generated successfully!")

    // 3. Save video to Cloudinary
    let uploaded: UploadResults = {}

    try {
      uploaded = await videoUploadCloudinary(videoData.output)
      // console.log("Cloudinary upload result:", uploaded)

      if (!uploaded || typeof uploaded.secure_url !== "string") {
        console.log("Cloudinary upload failed")
        toast.error("Cloudinary upload failed!")
        return
      }
    } catch (err) {
      toast.error("Video upload failed!")
      console.error("Cloudinary upload error:", err)
    }

    // 4. Save videoURL to new DB SD
    const videoDSData = {
      name: dbUser?.firstName || "",
      message: prompt,
      imageUrl: "",
      imageOverlayedUrl: "",
      videoUrl: uploaded.secure_url || "",
      eventId: seenDropInfo.eventId,
      userId: dbUser?.id || "",
      claimToken: claimToken || "",
      type: "video",
    }

    axios
      .post("/api/seendrops", videoDSData)
      .then((res) => {
        setSetVideoSeenDrop(res.data)
        toast.success("SPARKBIT saved successfully!")
        console.log("New SPARKBIT created:", videoSeenDrop)

        onSeenDropCreated?.() // Notify parent component about the new SPARKBIT
      })
      .catch((err) => {
        toast.error("SPARKBIT can not be saved successfully!")
        console.error(err)
      })

    setLoadingVideo(false)

    // 5. Update counts in event and product instance
    axios
      .post(`/api/counter?eventId=${event?.id}&flag=video`)
      .then(() => {
        toast.success("Counts are updated successfully")
      })
      .catch((err) => {
        toast.error(`Error updating counts: ${err.message}`)
        // console.error(err)
      })
  }

  return (
    <div className="w-[350px]] flex flex-col items-center justify-center bg-transparent">
      {seenDropInfo.type === "image" && (
        <div className="relative h-[350px] w-[350px]">
          <Image
            src={seenDropInfo.imageOverlayedUrl || "/Avatar.jpg"}
            fill
            alt="Picture of the author"
            className="object-cover object-center"
          />
        </div>
      )}

      {seenDropInfo.type === "video" && (
        <div className="relative h-[350px] w-[350px] bg-purple-950">
          <p className="px-4 py-1 text-lg">{seenDropInfo.name}</p>
          <video controls loop height={350} width={350} className="">
            <source src={seenDropInfo.videoUrl} type="video/mp4" />
          </video>
          <div className="flex flex-row items-center justify-between px-4 mt-17">
            <div className="relative h-[42px] w-[200px]">
              <Image
                src={event?.brandLogoUrl || "/Logo_AVICA.png"}
                alt="Picture of the author"
                className="object-contain object-left"
                fill
              />
            </div>
            <div className="relative h-[42px] w-[48px]">
              <Image
                src={"/Logo_AVICA.png"}
                alt="Picture of the author"
                className="object-contain object-center"
                fill
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-row items-center gap-2 justify-center mb-4 mt-4">
        {seenDropInfo.imageOverlayedUrl && (
          <ShareSeenDrop url={seenDropInfo.imageOverlayedUrl} />
        )}
        {seenDropInfo.videoUrl && <ShareSeenDrop url={seenDropInfo.videoUrl} />}

        {seenDropInfo.imageOverlayedUrl && (
          <div>
            <a
              download
              href={seenDropInfo.imageOverlayedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white text-sm bg-blue-600"
            >
              <Download size={16} />
              Download
            </a>
          </div>
        )}

        {seenDropInfo.videoUrl && (
          <div>
            <a
              download
              href={seenDropInfo.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white text-sm bg-blue-600"
            >
              <Download size={16} />
              Download
            </a>
          </div>
        )}
        {seenDropInfo.imageUrl && (
          <>
            {isSignedIn && user ? (
              <Button onClick={handleGenerateVideo}>
                <SquarePlay size={16} />
                ANIMATE!
              </Button>
            ) : (
              <>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setOpenDialog(true)}>
                      <SquarePlay />
                      ANIMATE!
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[350px]">
                    <DialogHeader>
                      <DialogTitle className="text-base text-center">
                        Sign up to animate your SPARKBIT
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
          </>
        )}
      </div>

      {loadingVideo && (
        <div className="flex flex-row items-center justify-center gap-4">
          <LoaderCircle className="animate-spin w-12 h-12 text-green-500 mt-4 mb-4" />
          <p className="text-sm text-white">
            Please wait! Video SPARKBIT is generated
          </p>
        </div>
      )}
    </div>
  )
}
