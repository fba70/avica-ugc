export interface EventItem {
  id: string
  name: string
  brand: string
  imageUrl: string
  qrcodeUrl: string
}

export interface SeenDropItem {
  id: string
  name: string
  message: string
  imageUrl: string
  eventId: string
}
