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
import { Input } from "@/components/ui/input"
import { FormError } from "@/components/forms/form-error"
import { FormSuccess } from "@/components/forms/form-success"
import AvatarImageUpload from "@/components/blocks/avatar-image-upload"
import { LocationEdit, CircleX } from "lucide-react"
import * as z from "zod"
import { EventSchema } from "@/schemas"
import axios from "axios"

interface CreateEventFormProps {
  onEventCreated?: () => void
}

export const CreateEventForm = ({ onEventCreated }: CreateEventFormProps) => {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof EventSchema>>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      name: "",
      brand: "",
      imageUrl: "",
      qrcodeUrl: "",
    },
  })

  const onSubmitEvent = (values: z.infer<typeof EventSchema>) => {
    setError("")
    setSuccess("")
    setLoading(true)

    // console.log(values)

    const parsed = EventSchema.safeParse(values)
    if (!parsed.success) {
      setError("Invalid form data. Please check your inputs.")
      setLoading(false)
      console.log("Validation errors:", parsed.error.errors)
      return
    }

    startTransition(() => {
      const data = {
        name: values.name,
        brand: values.brand,
        imageUrl: values.imageUrl,
        qrcodeUrl: "",
      }

      axios
        .post("/api/events", data)
        .then(() => {
          setSuccess("Image upload is successful")
          setLoading(false)
          setOpen(false)

          if (onEventCreated) onEventCreated() // callback to refetch the data on main page
        })
        .catch((err) => {
          setError(`Error uploading the image`)
          setLoading(false)
          console.error(err)
        })
    })
  }

  return (
    <>
      {!open && (
        <Button onClick={() => setOpen(true)}>
          <LocationEdit />
          Create new event!
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
                    <FormLabel>Title:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Event name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Event sponsor or organizer"
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
                    <FormLabel>Event image</FormLabel>
                    <FormControl>
                      <AvatarImageUpload
                        value={field.value || ""}
                        disabled={loading}
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
              Save Event!
            </Button>
          </form>
        </Form>
      )}
    </>
  )
}
