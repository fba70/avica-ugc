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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { FormError } from "@/components/forms/form-error"
import { FormSuccess } from "@/components/forms/form-success"
import AvatarImageUpload from "@/components/blocks/avatar-image-upload"
import { LocationEdit, CircleX } from "lucide-react"
import * as z from "zod"
import { EventSchema } from "@/schemas"
import axios from "axios"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface EditEventFormProps {
  event: {
    id: string
    name?: string
    brand?: string
    imageUrl?: string
    qrcodeUrl?: string
    brandLogoUrl?: string
    description?: string
    overlayColorCode?: string
    prompt?: string
    promptVideo?: string
    limitImages?: number
    limitVideos?: number
    imagesCount?: number
    videosCount?: number
    status?: string
    startDate?: string | Date
    endDate?: string | Date
  }
  onSuccess?: () => void
}

export const EditEventForm = ({ event, onSuccess }: EditEventFormProps) => {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [loading, setLoading] = useState(false)

  // const form = useForm<z.infer<typeof EventSchema>>({
  const form = useForm({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      name: event.name || "",
      brand: event.brand || "",
      imageUrl: event.imageUrl || "",
      qrcodeUrl: event.qrcodeUrl || "",
      brandLogoUrl: event.brandLogoUrl || "",
      description: event.description || "",
      overlayColorCode: event.overlayColorCode || "#7E7E7E",
      prompt: event.prompt || "",
      promptVideo: event.promptVideo || "",
      startDate: event.startDate ? new Date(event.startDate) : undefined,
      endDate: event.endDate ? new Date(event.endDate) : undefined,
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

    // Calculate new counts if limits changed
    let newImagesCount = event.limitImages ?? 0
    let newVideosCount = event.limitVideos ?? 0

    if (
      values.limitImages !== undefined &&
      values.limitImages !== event.limitImages
    ) {
      // Adjust imagesCount by the difference
      newImagesCount =
        (event.imagesCount ?? event.limitImages ?? 0) +
        (values.limitImages - (event.limitImages ?? 0))
      if (newImagesCount < 0) newImagesCount = 0
    } else {
      newImagesCount = event.imagesCount ?? event.limitImages ?? 0
    }

    if (
      values.limitVideos !== undefined &&
      values.limitVideos !== event.limitVideos
    ) {
      // Adjust videosCount by the difference
      newVideosCount =
        (event.videosCount ?? event.limitVideos ?? 0) +
        (values.limitVideos - (event.limitVideos ?? 0))
      if (newVideosCount < 0) newVideosCount = 0
    } else {
      newVideosCount = event.videosCount ?? event.limitVideos ?? 0
    }

    let status = values.status
    if (newImagesCount === 0 && newVideosCount === 0) {
      status = "inactive"
    }

    startTransition(() => {
      const data = {
        id: event.id,
        name: values.name,
        brand: values.brand,
        imageUrl: values.imageUrl,
        brandLogoUrl: values.brandLogoUrl,
        description: values.description,
        overlayColorCode: values.overlayColorCode,
        prompt: values.prompt,
        promptVideo: values.promptVideo,
        limitImages: values.limitImages,
        limitVideos: values.limitVideos,
        imagesCount: newImagesCount,
        videosCount: newVideosCount,
        status: status,
        startDate: values.startDate
          ? new Date(values.startDate).toISOString()
          : undefined,
        endDate: values.endDate
          ? new Date(values.endDate).toISOString()
          : undefined,
        qrcodeUrl: values.qrcodeUrl,
      }

      axios
        .put("/api/events", data)
        .then(() => {
          setSuccess("Event data is saved successfully")
          setLoading(false)
          setOpen(false)

          if (onSuccess) onSuccess() // callback to refetch the data on main page
        })
        .catch((err) => {
          setError("Error saving event data")
          setLoading(false)
          console.error(err)
        })
    })
  }

  return (
    <>
      {!open && (
        <Button variant="secondary" onClick={() => setOpen(true)} className="">
          <LocationEdit />
          Edit event data
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
            className="space-y-6 bg-gray-700 p-6 mb-6 "
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
                    <FormLabel>Event image:</FormLabel>
                    <FormControl>
                      <AvatarImageUpload
                        value={field.value || ""}
                        disabled={loading}
                        onChange={(url: string) => {
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
                name="brandLogoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand logo image:</FormLabel>
                    <FormControl>
                      <AvatarImageUpload
                        value={field.value || ""}
                        disabled={loading}
                        onChange={(url: string) => {
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event description for users:</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        placeholder="Describe the event and benefits for users to participate in it"
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
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Define prompt for image Gen AI:</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        disabled={isPending}
                        className="min-h-64 w-[380px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="promptVideo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Define prompt for video Gen AI:</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        disabled={isPending}
                        className="min-h-64 w-[380px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="limitImages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images count limit:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="limitVideos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Videos count limit:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder="20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="limitImages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images count limit:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity status:</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isPending}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date:</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[240px] justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon />
                            {field.value ? (
                              format(field.value as Date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value as Date | undefined}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date:</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[240px] justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon />
                            {field.value ? (
                              format(field.value as Date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value as Date | undefined}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="overlayColorCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overlay color code:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="color"
                        disabled={isPending}
                        className="w-16 h-10 p-1"
                        value={field.value || "#7E7E7E"}
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
