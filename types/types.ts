export interface EventItem {
  id: string
  name?: string
  brand?: string
  imageUrl?: string
  qrcodeUrl?: string
  brandLogoUrl?: string
  description?: string
  prompt?: string
  startDate?: Date
  endDate?: Date
}

export interface SeenDropItem {
  id: string
  name?: string
  message?: string
  imageUrl?: string
  eventId: string
  createdAt: Date
}
