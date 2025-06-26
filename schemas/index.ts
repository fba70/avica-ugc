import * as z from "zod"

export const EventSchema = z.object({
  name: z.string().optional(),
  brand: z.string().optional(),
  imageUrl: z.string().optional(),
  qrcodeUrl: z.string().optional(),
})

export const SeenDropSchema = z.object({
  name: z.string(),
  message: z.string().optional(),
  imageUrl: z.string().optional(),
  eventId: z.string(),
})
