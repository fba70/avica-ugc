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
  overlayColorCode?: string
  limitImages?: number
  limitVideos?: number
  imagesCount?: number
  videosCount?: number
  status?: string
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
  videoOverlayedUrl?: string
  eventId: string
  createdAt: Date
  type?: string
  userId?: string
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

export interface ProductInstanceItem {
  id: string
  productId: string
  status: string
  paidStatus: string
  createdAt: string
  limitImages: number
  limitVideos: number
  imagesCount: number
  videosCount: number
  product: {
    id: string
    name: string
    description?: string
    type: string
    recurrenceType: string
    priceRecurring: number
    priceOneoff: number
  }
}

export interface ProductItem {
  id: string
  name: string
  description?: string
  type: string
  recurrenceType: string
  userType: string
  priceRecurring: number
  priceOneoff: number
  status: string
  limitImages: number
  limitVideos: number
  createdAt: string
}
