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
// import { CustomImageWithOverlays } from "@/components/blocks/image-overlays"

interface SeenDropItem {
  id: string
  name: string
  message: string
  imageUrl: string
  eventId: string
  userId: string
  claimToken: string
  type: string
}

export default function CreateSeenDrop() {
  const { isSignedIn, user } = useUser()

  // If there is no user, store claim token in local storage
  const claimToken = uuidv4() as string

  if (!user || !isSignedIn) {
    localStorage.setItem("seendropClaimToken", claimToken)
  }

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

  const form = useForm<z.infer<typeof SeenDropSchema>>({
    resolver: zodResolver(SeenDropSchema),
    defaultValues: {
      name: dbUser?.firstName || "",
      message: "",
      imageUrl: "",
      eventId: eventId,
      userId: dbUser?.id || "",
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
  }, [user])

  const generateAiImage = async (url: string, prompt: string, name: string) => {
    setGeneratingImage(true)

    // 1. Generate image with Replicate AI
    const response = await fetch("/api/image-gen-2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url1: url,
        url2: event?.imageUrl || "",
        prompt: `${event?.prompt || prompt}`, // removed user prompt adding for now
      }),
    })

    // console.log("User prompt:", prompt)
    // console.log("Event prompt:", event?.prompt)

    const imageData = await response.json()

    console.log("Image data format:", imageData.output)

    if (response.status !== 201) {
      setError("Image generation error")
      toast.error("Image generation failed!")
      return
    }

    toast.success("Image generated successfully!")

    // 2. Add layout overlays to the generated image
    const customImage = await createImageWithOverlays({
      text: name,
      baseImageUrl: imageData.output || "",
      image1Url:
        "https://res.cloudinary.com/dzaz7erch/image/upload/v1751107072/Image_top_nxvzqe.jpg",
      image2Url:
        "https://res.cloudinary.com/dzaz7erch/image/upload/v1751107084/Image_bottom_cywcpt.jpg",
      image3Url: event?.brandLogoUrl || "",
    })

    toast.success("Image prepared successfully!")

    // 3. Upload the generated image to Cloudinary
    const overlayFlag = false as boolean // Set false when Cloudinary overlay transformations are not used - it did not work

    const uploadOriginalResult = await imageUploadCloudinary(
      imageData.output,
      overlayFlag
    )
    const uploadResult = await imageUploadCloudinary(customImage, overlayFlag)

    if (uploadResult.error) {
      setError("Cloudinary upload error")
      console.error("Cloudinary upload error:", uploadResult.error)
    } else {
      setUploadedImage(uploadResult.secure_url || "")
      setUploadedOriginalImage(uploadOriginalResult.secure_url || "")
      console.log("Uploaded image URL:", uploadResult.secure_url)
      console.log(
        "Uploaded original image URL:",
        uploadOriginalResult.secure_url
      )
      toast.success("Image uploaded successfully!")
    }

    // 4. Save SeenDrop to DB
    const data = {
      name: name,
      message: prompt,
      imageUrl: uploadOriginalResult.secure_url || "", // <-- original image
      imageOverlayedUrl: uploadResult.secure_url || "",
      eventId: eventId,
      userId: dbUser?.id || "",
      claimToken: claimToken || "",
      type: "image",
    }

    axios
      .post("/api/seendrops", data)
      .then((res) => {
        setNewSeenDrop(res.data)
        setSuccess("Image upload is successful")
        toast.success("Seendrop saved successfully!")
        console.log("New SeenDrop created:", res.data)
      })
      .catch((err) => {
        setError(`Error uploading the image`)
        console.error(err)
      })

    setGeneratingImage(false)

    // 5. Refetch new SeenDrop from DB
    setLoading(true)
    axios
      .get("/api/seendrops", { params: { id: newSeenDrop?.id } })
      .then((res) => {
        setNewSeenDrop(res.data)
        setSeenDropRefetched(true)
        setLoading(false)
        console.log("Fetched new SeenDrop:", res.data)
      })
      .catch(() => {
        setError("Failed to fetch events")
        setLoading(false)
      })
  }

  const onSubmitEvent = (values: z.infer<typeof SeenDropSchema>) => {
    setError("")
    setSuccess("")

    // console.log(values)

    const parsed = SeenDropSchema.safeParse(values)
    if (!parsed.success) {
      setError("Invalid form data. Please check your inputs.")
      setGeneratingImage(false)
      console.log("Validation errors:", parsed.error.errors)
      return
    }

    startTransition(() => {
      // Generate SeenDrop image with gen AI, upload it to Cloudinary and save in DB
      generateAiImage(
        values.imageUrl ?? "",
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
            className="space-y-6 bg-gray-700 p-6"
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
                        placeholder="What do you want your SeenDrop to be?"
                        disabled={isPending}
                        className="min-h-32 w-[380px]"
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
            </div>

            <FormError message={error} />
            <FormSuccess message={success} />

            <Button disabled={isPending} type="submit" className="w-full">
              Generate your SeenDrop!
            </Button>
          </form>
        </Form>
      )}

      {generatingImage && (
        <div className="flex flex-row items-center justify-center gap-6">
          <LoaderCircle className="animate-spin w-12 h-12 text-green-500 mt-4 mb-4" />
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

      {loading && <p>Loading new SeenDrop. Please wait!</p>}

      {seenDropRefetched && (
        <>
          <div className="flex flex-col items-center justify-center gap-6 mt-12 bg-gray-700 p-4 pb-6">
            <p className="text-center">Your SeenDrop is ready!</p>
            <div className="flex flex-row items-center justify-center relative h-[400px] w-[400px]">
              <Image
                src={uploadedOriginalImage || "/Avatar.jpg"}
                fill
                alt="SeenDrop image"
                className="object-cover object-center"
              />
            </div>
            <ShareSeenDrop url={uploadedImage} />
            <div className="hidden">
              <ShareSeenDrop url={uploadedImage} />
            </div>
            <div>
              <a
                download
                href={uploadedImage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-4 border border-gray-300 px-4 py-2 rounded-lg text-white text-sm"
              >
                <Download />
                Download SeenDrop
              </a>
            </div>
          </div>
        </>
      )}

      <div className="flex flex-row items-center justify-center mt-12">
        <Button
          onClick={() => {
            router.push(`/events/${eventId}`)
          }}
        >
          <CircleArrowLeft />
          Get back to the Event page!
        </Button>
      </div>
    </>
  )
}
