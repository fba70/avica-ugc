"use client"

import { useTransition, useState } from "react"
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
import { Image as SDImage, CircleX } from "lucide-react"
import * as z from "zod"
import { SeenDropSchema } from "@/schemas"
import axios from "axios"
import { toast } from "sonner"
import { LoaderCircle } from "lucide-react"
import { imageUploadCloudinary } from "@/actions/upload-image"

interface CreateSeenDropFormProps {
  onSeenDropCreated?: () => void
  eventId: string
  eventImageUrl: string
}

/*
interface UploadResults {
  secure_url?: string
  error?: string
  //[key: string]: any
}
  */

export const CreateSeenDropForm = ({
  onSeenDropCreated,
  eventId,
  eventImageUrl,
}: CreateSeenDropFormProps) => {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")

  const [generatingImage, setGeneratingImage] = useState(false)

  const [uploadedImage, setUploadedImage] = useState<string>("")

  const form = useForm<z.infer<typeof SeenDropSchema>>({
    resolver: zodResolver(SeenDropSchema),
    defaultValues: {
      name: "",
      message: "",
      imageUrl: "",
      eventId: eventId,
    },
  })

  const generateAiImage = async (url: string, prompt: string, name: string) => {
    // Generate image with Replicate
    const response = await fetch("/api/image-gen-2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url1: url,
        url2: eventImageUrl,
        prompt: prompt,
      }),
    })

    const imageData = await response.json()

    if (response.status !== 201) {
      setError("Image generation error")
      toast.error("Image generation failed!")
      return
    }

    toast.success("Image generated successfully!")

    // Upload the generated image to Cloudinary
    const uploadResult = await imageUploadCloudinary(imageData.output)

    if (uploadResult.error) {
      console.error("Cloudinary upload error:", uploadResult.error)
    } else {
      setUploadedImage(uploadResult.secure_url || "")
      console.log("Uploaded image URL:", uploadResult.secure_url, uploadedImage)
      toast.success("Image uploaded successfully!")
    }

    const data = {
      name: name,
      message: prompt,
      imageUrl: uploadResult.secure_url || "",
      eventId: eventId,
    }

    axios
      .post("/api/seendrops", data)
      .then(() => {
        setSuccess("Image upload is successful")

        if (onSeenDropCreated) onSeenDropCreated() // callback to refetch the data on main page
      })
      .catch((err) => {
        setError(`Error uploading the image`)
        console.error(err)
      })

    setOpen(false)
  }

  const onSubmitEvent = (values: z.infer<typeof SeenDropSchema>) => {
    setError("")
    setSuccess("")
    setGeneratingImage(true)

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

      setGeneratingImage(false)
    })
  }

  return (
    <>
      {!open && (
        <Button onClick={() => setOpen(true)}>
          <SDImage />
          Create new SeenDrop!
        </Button>
      )}

      {open && (
        <Button onClick={() => setOpen(false)} className="mb-6">
          <CircleX />
          Close form
        </Button>
      )}

      {open && (
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
                        className="min-h-32"
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
              Save to generate your SeenDrop!
            </Button>
          </form>
        </Form>
      )}

      {generatingImage && (
        <LoaderCircle className="animate-spin w-12 h-12 text-green-500 mt-4 mb-4" />
      )}
    </>
  )
}
