export interface EventItem {
  id: string
  name?: string
  pageName?: string
  brand?: string
  imageUrl?: string
  qrcodeUrl?: string
  brandLogoUrl?: string
  description?: string
  prompt?: string
  promptVideo?: string
  startDate?: Date
  endDate?: Date
  createdAt: Date
}

export interface SeenDropItem {
  id: string
  name?: string
  message?: string
  imageUrl?: string
  imageOverlayedUrl?: string
  videoUrl?: string
  eventId: string
  createdAt: Date
  type?: string
}

export interface UserItem {
  id: string
  externalId: string
  email: string
  role: "user" | "partner"
  firstName?: string
  lastName?: string
  createdAt: Date
  pageName?: string
}
