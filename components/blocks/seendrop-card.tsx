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
import { imageUploadCloudinary } from "@/actions/upload-image"
import { createTransformedVideo } from "@/actions/add-video-layout"
import { createOverlays } from "@/lib/createOverlays"
import { v4 as uuidv4 } from "uuid"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TextLoop } from "@/components/motion-primitives/text-loop"
import { useUser, SignUpButton } from "@clerk/nextjs"
import ReactPlayer from "react-player"

interface UploadResults {
  secure_url?: string
  error?: string
  public_id?: string
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

  // console.log("SeenDropCard props:", seenDropInfo)

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

    try {
      // 1. Check event video count
      if ((event?.videosCount ?? 0) <= 0) {
        toast.error("No more video SPARKBITS left for this event!")
        setLoadingVideo(false)
        return
      }

      // Event date and status check
      const now = new Date()
      const startDate = event?.startDate ? new Date(event.startDate) : null
      const endDate = event?.endDate ? new Date(event.endDate) : null
      if (
        !startDate ||
        !endDate ||
        now < startDate ||
        now > endDate ||
        event?.status !== "active"
      ) {
        toast.error(
          "SPARKBITS can not be created outside of event's start and end dates"
        )
        setLoadingVideo(false)
        return
      }

      // 2. Define the prompt for animation
      const defaultPrompt = "Animate the image moving the human around" // If Event prompt is not defined

      // 3. Generate video with Replicate
      // ugcUrl: seenDropInfo.imageOverlayedUrl || seenDropInfo.imageUrl,
      const response = await fetch("/api/video-gen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ugcUrl: seenDropInfo.imageUrl || seenDropInfo.imageOverlayedUrl,
          prompt: event?.promptVideo || defaultPrompt,
        }),
      })

      const videoData = await response.json()
      if (response.status !== 201) {
        toast.error("Video generation failed!")
        setLoadingVideo(false)
        return
      }
      toast.success("Video generated successfully!")

      // 4. Save video to Cloudinary
      let uploaded: UploadResults = {}

      try {
        uploaded = await videoUploadCloudinary(videoData.output)
        if (!uploaded || typeof uploaded.secure_url !== "string") {
          toast.error("Cloudinary upload failed!")
          setLoadingVideo(false)
          return
        }
      } catch (err: unknown) {
        toast.error("Video upload failed!")
        console.error("Cloudinary upload error:", err)
        setLoadingVideo(false)
        return
      }

      // console.log("Original video:", uploaded)

      // 5. Create overlay image
      let overlayImage
      try {
        overlayImage = await createOverlays({
          text: `SPARKBITS for ${dbUser?.firstName || "Unknown user"}`,
          overlayColorCode: "#7E7E7E",
          logoImage: event?.brandLogoUrl || "",
        })
      } catch (err) {
        toast.error("Failed to prepare overlays")
        setLoadingVideo(false)
        console.log("Overlay creation error:", err)
        return
      }
      toast.success("Overlay prepared successfully!")

      // 6.   Upload overlay image to Cloudinary
      const overlayFlag = false
      const uploadOverlay = await imageUploadCloudinary(
        overlayImage,
        overlayFlag
      )

      if (uploadOverlay.error) {
        toast.error("Failed to upload overlays!")
        setLoadingVideo(false)
        return
      }
      toast.success("Overlay prepared successfully!")

      // console.log("Overlay image:", uploadOverlay)

      // 7. Create video with the overlay and store it in Cloudinary with new url
      let transformedVideo
      try {
        transformedVideo = await createTransformedVideo(
          uploaded.public_id as string,
          uploadOverlay.public_id as string
        )

        if (!transformedVideo || transformedVideo.error) {
          toast.error("Failed to create transformed video!")
          setLoadingVideo(false)
          return
        }
        toast.success("Transformed video created successfully!")
      } catch (err) {
        toast.error("Error creating transformed video!")
        console.log("Video with overlay creation error:", err)
        setLoadingVideo(false)
        return
      }

      // console.log("Transformed video:", transformedVideo)

      // 8. Save videoURL to new DB SD
      const videoDSData = {
        name: dbUser?.firstName || "",
        message: defaultPrompt,
        imageUrl: "",
        imageOverlayedUrl: "",
        videoUrl: uploaded.secure_url || "",
        videoOverlayedUrl: transformedVideo.secure_url || "",
        eventId: seenDropInfo.eventId,
        userId: dbUser?.id || "",
        claimToken: claimToken || "",
        type: "video",
      }

      try {
        const res = await axios.post("/api/seendrops", videoDSData)
        setSetVideoSeenDrop(res.data)
        toast.success("SPARKBIT saved successfully!")
        console.log("New SPARKBIT created:", videoSeenDrop)

        onSeenDropCreated?.()
      } catch (err: unknown) {
        toast.error("SPARKBIT can not be saved successfully!")
        console.error(err)
        setLoadingVideo(false)
        return
      }

      // 9. Update counts in event and product instance
      try {
        await axios.post(`/api/counter?eventId=${event?.id}&flag=video`)
        toast.success("Counts are updated successfully")
      } catch (err: unknown) {
        let errorMsg = "Unexpected error"
        if (err && typeof err === "object" && "message" in err) {
          errorMsg = (err as { message: string }).message
        }
        toast.error(`Error updating counts: ${errorMsg}`)
      }
    } catch (err: unknown) {
      toast.error("Unexpected error during video generation")
      console.error(err)
    } finally {
      setLoadingVideo(false)
    }
  }

  return (
    <div className="w-[360px]] flex flex-col items-center justify-center bg-transparent">
      {seenDropInfo.type === "image" && (
        <div className="relative h-[270px] w-[360px]">
          <Image
            src={seenDropInfo.imageOverlayedUrl || "/Avatar.jpg"}
            fill
            alt="Picture of the author"
            className="object-contain object-center"
          />
        </div>
      )}

      {seenDropInfo.type === "video" && (
        <div className="flex items-center justify-center h-[270px] w-[360px]">
          <ReactPlayer
            src={seenDropInfo.videoOverlayedUrl || seenDropInfo.videoUrl}
            controls={true}
            playing={false}
            muted={true}
            loop={true}
            width={360}
            height={270}
            style={{
              background: "transparent",
              aspectRatio: "16/9",
            }}
          />
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
              href={seenDropInfo.videoOverlayedUrl}
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
        <div className="flex flex-row items-center justify-center gap-6 w-[340px] bg-gray-500 p-6 mt-6 rounded-lg">
          <LoaderCircle className="animate-spin w-10 h-10 text-green-500" />
          <TextLoop className="text-sm text-white">
            <span>Yes, yes, we already started ...</span>
            <span>Everything works just fine ...</span>
            <span>You know, it takes a while ...</span>
            <span>We are on schedule, no worries ...</span>
            <span>Almost there ...</span>
            <span>Just 5 seconds ...</span>
            <span>4 ...</span>
            <span>3 ...</span>
            <span>2 ...</span>
            <span>1 ...</span>
            <span>It is coming, I promise ...</span>
          </TextLoop>
        </div>
      )}
    </div>
  )
}

/*
{seenDropInfo.type === "video" && (
        <div className="flex items-center justify-center h-[270px] w-[360px]">
          <video controls loop height={270} width={360} className="">
            <source
              src={seenDropInfo.videoOverlayedUrl || seenDropInfo.videoUrl}
              type="video/mp4"
            />
          </video>
        </div>
      )}
*/
