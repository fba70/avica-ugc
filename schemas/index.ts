import * as z from "zod"

export const EventSchema = z.object({
  name: z.string().optional(),
  brand: z.string().optional(),
  imageUrl: z.string().optional(),
  qrcodeUrl: z.string().optional(),
  brandLogoUrl: z.string().optional(),
  description: z.string().optional(),
  prompt: z.string().optional(),
  startDate: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date
        ? new Date(arg)
        : undefined,
    z.date().optional()
  ),
  endDate: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date
        ? new Date(arg)
        : undefined,
    z.date().optional()
  ),
})

export const SeenDropSchema = z.object({
  name: z.string(),
  message: z.string().optional(),
  imageUrl: z.string().optional(),
  eventId: z.string(),
})

export const UsersSchema = z.object({
  firstlName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
  role: z.enum(["user", "partner"]).default("user"),
  externalId: z.string(),
})
