"use client"

import { useTransition, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { FormError } from "@/components/forms/form-error"
import { FormSuccess } from "@/components/forms/form-success"
import AvatarImageUpload from "@/components/blocks/avatar-image-upload"
import * as z from "zod"
import { SeenDropSchema } from "@/schemas"
import axios from "axios"
import { toast } from "sonner"
import { LoaderCircle, CircleArrowLeft, Download } from "lucide-react"
import { imageUploadCloudinary } from "@/actions/upload-image"
import { TextLoop } from "@/components/motion-primitives/text-loop"
import { ShareSeenDrop } from "@/components/blocks/share-seendrop"
import { createImageWithOverlays } from "@/lib/createImageWithOverlays"
import { EventItem, UserItem } from "@/types/types"
import { useUser } from "@clerk/nextjs"
import { v4 as uuidv4 } from "uuid"
import { SelfieCapture } from "./selfie-capture"
// import { CustomImageWithOverlays } from "@/components/blocks/image-overlays"

interface SeenDropItem {
  id: string
  name: string
  message: string
  imageUrl: string
  selfieUrl: string
  eventId: string
  userId: string
  claimToken: string
  type: string
}

export default function CreateSeenDrop() {
  const { isSignedIn, user } = useUser()

  // If there is no user, store claim token in local storage
  const [claimToken, setClaimToken] = useState<string>("")

  useEffect(() => {
    if (!user || !isSignedIn) {
      const token = uuidv4()
      setClaimToken(token)
      localStorage.setItem("seendropClaimToken", token)
    }
  }, [user, isSignedIn])

  const router = useRouter()
  const searchParams = useSearchParams()
  const eventId = searchParams.get("eventId") || ""

  const [dbUser, setDbUser] = useState<UserItem>()

  const [event, setEvent] = useState<EventItem>()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")

  const [generatingImage, setGeneratingImage] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string>("")
  const [uploadedOriginalImage, setUploadedOriginalImage] = useState<string>("")
  const [newSeenDrop, setNewSeenDrop] = useState<SeenDropItem>()

  const [seenDropRefetched, setSeenDropRefetched] = useState(false)
  const [loading, setLoading] = useState(false)

  const freeUserId = "cmda2dqfe0002jhepbythrwbf" // Free user ID for unregistered users

  const form = useForm<z.infer<typeof SeenDropSchema>>({
    resolver: zodResolver(SeenDropSchema),
    defaultValues: {
      name: dbUser?.firstName || "",
      message: "",
      imageUrl: "",
      eventId: eventId,
      userId: dbUser?.id || freeUserId,
      claimToken: claimToken || "",
    },
  })

  const fetchEvents = () => {
    axios
      .get(`/api/events?id=${eventId}`)
      .then((res) => {
        setEvent(res.data)
      })
      .catch(() => {
        setError("Failed to fetch events")
      })
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    if (isSignedIn && user && user?.id) {
      axios.get(`/api/user?externalId=${user.id}`).then((res) => {
        setDbUser(res.data[0])
      })
    }
  }, [user, isSignedIn])

  const generateAiImage = async (url: string, prompt: string, name: string) => {
    if (!url) {
      setError("Please provide your image or selfie photo!")
      toast.error("You need to upload your image or selfie photo")
      setGeneratingImage(false)
      return
    }

    setGeneratingImage(true)
    try {
      // 1. Generate image with Replicate AI
      const response = await fetch("/api/image-gen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url1: url,
          url2: event?.imageUrl || "",
          prompt: `${event?.prompt || prompt}`,
        }),
      })
      const imageData = await response.json()
      if (response.status !== 201) {
        setError("Image generation error")
        toast.error("Image generation failed!")
        setGeneratingImage(false)
        return
      }
      toast.success("Image generated successfully!")

      // 2. Add layout overlays to the generated image
      let customImage
      try {
        customImage = await createImageWithOverlays({
          text: `SPARKBITS for ${name}`,
          baseImageUrl: imageData.output || "",
          overlayColorCode: "#7E7E7E",
          logoImage: event?.brandLogoUrl || "",
        })
      } catch (err) {
        setError("Overlay creation failed")
        toast.error("Failed to prepare image overlays!")
        setGeneratingImage(false)
        console.log("Overlay creation error:", err)
        return
      }
      toast.success("Image prepared successfully!")

      // 3. Upload the generated image to Cloudinary
      const overlayFlag = false
      const uploadOriginalResult = await imageUploadCloudinary(
        imageData.output,
        overlayFlag
      )
      const uploadResult = await imageUploadCloudinary(customImage, overlayFlag)

      if (uploadResult.error) {
        setError("Cloudinary upload error")
        setGeneratingImage(false)
        return
      }
      setUploadedImage(uploadResult.secure_url || "")
      setUploadedOriginalImage(uploadOriginalResult.secure_url || "")
      toast.success("Image uploaded successfully!")

      // 4. Save SPARKBIT to DB
      const data = {
        name,
        message: prompt,
        imageUrl: uploadOriginalResult.secure_url || "",
        imageOverlayedUrl: uploadResult.secure_url || "",
        eventId,
        userId: dbUser?.id || freeUserId,
        claimToken: claimToken || "",
        type: "image",
      }
      try {
        const res = await axios.post("/api/seendrops", data)
        setNewSeenDrop(res.data)
        setSuccess("Image upload is successful")
        toast.success("SPARKBIT saved successfully!")
      } catch (err: unknown) {
        let errorMsg = "Unexpected error"
        if (err && typeof err === "object" && "message" in err) {
          errorMsg = (err as { message: string }).message
        }
        setError(`Error uploading the image: ${errorMsg}`)
        setGeneratingImage(false)
        return
      }

      setGeneratingImage(false)

      // 5. Update counts in event and product instance
      try {
        await axios.post(`/api/counter?eventId=${event?.id}&flag=image`)
        toast.success("Counts are updated successfully")
      } catch (err: unknown) {
        let errorMsg = "Unexpected error"
        if (err && typeof err === "object" && "message" in err) {
          errorMsg = (err as { message: string }).message
        }
        toast.error(`Error updating counts: ${errorMsg}`)
      }

      // 6. Refetch new SPARKBIT from DB
      setLoading(true)
      try {
        const refetchRes = await axios.get("/api/seendrops", {
          params: { id: newSeenDrop?.id },
        })
        setNewSeenDrop(refetchRes.data)
        setSeenDropRefetched(true)
        setLoading(false)
      } catch {
        setError("Failed to fetch events")
        setLoading(false)
      }
    } catch (err: unknown) {
      let errorMsg = "Unexpected error"
      if (err && typeof err === "object" && "message" in err) {
        errorMsg = (err as { message: string }).message
      }
      setError("Unexpected error: " + errorMsg)
      setGeneratingImage(false)
    }
  }

  const onSubmitEvent = (values: z.infer<typeof SeenDropSchema>) => {
    setError("")
    setSuccess("")

    // console.log(values)

    if ((event?.imagesCount ?? 0) <= 0) {
      setError("Sorry, no more SPARKBITS can be generated for this event")
      toast.error("No more SPARKBITS left for this event!")
      setGeneratingImage(false)
      return
    }

    const parsed = SeenDropSchema.safeParse(values)
    if (!parsed.success) {
      setError("Invalid form data. Please check your inputs.")
      setGeneratingImage(false)
      // console.log("Validation errors:", parsed.error.errors)
      return
    }

    startTransition(() => {
      // Generate SPARKBIT image with gen AI, upload it to Cloudinary and save in DB
      const selectedImageUrl = values.imageUrl || values.selfieUrl || ""

      generateAiImage(
        selectedImageUrl ?? "",
        values.message ?? "",
        values.name ?? ""
      )
    })
  }

  return (
    <>
      {!seenDropRefetched && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitEvent)}
            className="space-y-6 bg-gray-700 p-6 mt-10"
          >
            <div className="flex flex-col space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="John"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your message:</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        placeholder="Leave your comments about the event here!"
                        disabled={isPending}
                        className="min-h-24 w-[380px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your image</FormLabel>
                    <FormControl>
                      <AvatarImageUpload
                        value={field.value || ""}
                        disabled={isPending}
                        onChange={(url: string) => {
                          //console.log("Image URL:", url)
                          field.onChange(url)
                        }}
                        onRemove={() => field.onChange("")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="selfieUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2">
                        {field.value && (
                          <Image
                            src={field.value}
                            alt="Selfie preview"
                            width={370}
                            height={370}
                            className="object-cover mb-2"
                          />
                        )}
                        <SelfieCapture
                          onCapture={field.onChange}
                          disabled={isPending}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormError message={error} />
            <FormSuccess message={success} />

            <Button disabled={isPending} type="submit" className="w-full">
              Generate your SPARKBIT
            </Button>
          </form>
        </Form>
      )}

      {generatingImage && (
        <div className="flex flex-row items-center justify-center gap-6 bg-gray-500 p-6 mt-6 rounded-lg">
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

      {loading && <p>Loading new SPARKBIT. Please wait!</p>}

      {seenDropRefetched && (
        <>
          <div className="flex flex-col items-center justify-center gap-6 mt-12 bg-gray-700 p-4 pb-6">
            <p className="text-center">Your SPARKBIT is ready!</p>
            <div className="flex flex-row items-center justify-center relative h-[300px] w-[400px]">
              <Image
                src={
                  uploadedImage || uploadedOriginalImage || "/Logo_AVICA.png"
                }
                fill
                alt="SPARKBIT image"
                className="object-cover object-center"
              />
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <ShareSeenDrop url={uploadedImage} />

              <div>
                <a
                  download
                  href={uploadedImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-4 bg-blue-600 px-4 py-2 rounded-md text-white text-sm"
                >
                  <Download size={18} />
                  Download SPARKBIT
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex flex-row items-center justify-center mt-12">
        <Button
          onClick={() => {
            router.push(`/events/${event?.pageName}`)
          }}
        >
          <CircleArrowLeft />
          Get back to the Event page!
        </Button>
      </div>
    </>
  )
}

/*
<img
                            src={field.value}
                            alt="Selfie preview"
                            className="w-[370px] h-[370px] object-cover mb-2"
                          />
*/
