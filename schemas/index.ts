import * as z from "zod"

export const EventSchema = z.object({
  name: z.string().optional(),
  brand: z.string().optional(),
  imageUrl: z.string().optional(),
  qrcodeUrl: z.string().optional(),
  brandLogoUrl: z.string().optional(),
  description: z.string().optional(),
  prompt: z.string().optional(),
  promptVideo: z.string().optional(),
  userId: z.string().optional(),
  pageName: z.string().optional(),
  limitImages: z.number().optional(),
  limitVideos: z.number().optional(),
  imagesCount: z.number().optional(),
  videosCount: z.number().optional(),
  status: z.string().optional(),
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
  imageOverlayedUrl: z.string().optional(),
  selfieUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  eventId: z.string(),
  userId: z.string(),
  claimToken: z.string().optional(),
  type: z.string().optional(),
})

export const UsersSchema = z.object({
  firstlName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
  role: z.enum(["user", "partner"]).default("user"),
  externalId: z.string(),
  pageName: z.string().optional(),
})

export const PageNameSchema = z.object({
  pageName: z.string().optional(),
})

export const ProductInstancesSchema = z.object({
  userId: z.string(),
  productId: z.string(),
  status: z.string().default("active"),
  paidStatus: z.string().default("unpaid"),
  limitImages: z.number().optional(),
  limitVideos: z.number().optional(),
  imagesCount: z.number().optional(),
  videosCount: z.number().optional(),
})
