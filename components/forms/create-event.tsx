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
import { v4 as uuidv4 } from "uuid"

interface CreateEventFormProps {
  onEventCreated?: () => void
  userId?: string
}

export const CreateEventForm = ({
  onEventCreated,
  userId,
}: CreateEventFormProps) => {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [loading, setLoading] = useState(false)

  const promptTemplate =
    "Task: Create a visually appealing image for the event. Context: The base image of the scene is provided by the second image (input_image_2 parameter) image. The user image provided by the first image (input_image_1 parameter) should be put into the context of the event scene and style. Style: The image should capture the essence of the event, highlighting its key features and benefits for participants. Use vibrant colors and engaging elements to attract attention. The image should be suitable for social media sharing and promotional materials."

  const promptVideoTemplate =
    "Animate the image to create a short video clip that showcases the user image, event's atmosphere and key highlights. Use smooth transitions and engaging effects to make the video visually appealing. The video should be suitable for social media sharing and promotional materials."

  // const form = useForm<z.infer<typeof EventSchema>>({
  const form = useForm({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      name: "",
      brand: "",
      pageName: "",
      imageUrl: "",
      qrcodeUrl: "",
      brandLogoUrl: "",
      description: "",
      overlayColorCode: "#7E7E7E",
      limitImages: 100,
      limitVideos: 20,
      imagesCount: 100,
      videosCount: 20,
      status: "active",
      prompt: promptTemplate || "",
      promptVideo: promptVideoTemplate || "",
      startDate: new Date() as Date,
      endDate: new Date() as Date,
      userId: userId,
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

    const transformedPageName = (values?.pageName ?? uuidv4())
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")

    axios
      .get(`/api/events?pageName=${transformedPageName}`)
      .then((res) => {
        if (res.data.count > 0) {
          setError("This page name is already taken. Please choose another.")
          return // Stop further execution
        }

        startTransition(() => {
          const data = {
            name: values.name,
            pageName: transformedPageName,
            brand: values.brand,
            imageUrl: values.imageUrl,
            brandLogoUrl: values.brandLogoUrl,
            description: values.description,
            overlayColorCode: values.overlayColorCode,
            prompt: values.prompt,
            promptVideo: values.promptVideo,
            limitImages: values.limitImages,
            limitVideos: values.limitVideos,
            imagesCount: values.limitImages,
            videosCount: values.limitVideos,
            status: values.status,
            startDate: values.startDate
              ? new Date(values.startDate).toISOString()
              : undefined,
            endDate: values.endDate
              ? new Date(values.endDate).toISOString()
              : undefined,
            qrcodeUrl: "",
            userId: userId,
          }

          axios
            .post("/api/events", data)
            .then(() => {
              setSuccess("Event data is saved successfully")
              setLoading(false)
              setOpen(false)

              if (onEventCreated) onEventCreated() // callback to refetch the data on main page
            })
            .catch((err) => {
              setError("Error saving event data")
              setLoading(false)
              console.error(err)
            })
        })
      })
      .catch(() => {
        setError("Failed to check page name uniqueness")
      })
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {!open && (
        <Button onClick={() => setOpen(true)} className="text-lg pl-4 pr-4">
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
                name="pageName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event page name:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Page name"
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
                        placeholder={promptTemplate}
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
                        placeholder={promptVideoTemplate}
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
    </div>
  )
}
