"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { EventItem } from "@/types/types"

export default function EventCard({
  cardInfo,
  showButton,
}: {
  cardInfo: EventItem
  showButton: boolean
}) {
  const router = useRouter()

  return (
    <div className="w-[350px]] flex flex-col items-center justify-center bg-gray-600 pb-6">
      <div className="relative h-[250px] w-[350px]">
        <Image
          src={cardInfo.imageUrl}
          fill
          alt="Picture of the author"
          className="object-cover object-center"
        />
      </div>

      <p className="mx-auto text-xl font-medium text-white mt-4">
        {cardInfo.name}
      </p>

      <p className="mx-auto text-xl font-medium text-white mt-4 w-[320px] text-center">
        <span className="text-gray-400 mr-2">Sponsor: </span>
        {cardInfo.brand}
      </p>

      {showButton ? (
        <Button
          className="flex flex-row items-center justify-center gap-4 mt-4"
          onClick={() => router.push(`/events/${cardInfo.id}`)}
        >
          <Eye />
          <p className="pr-2 text-lg">Event SeenDrops</p>
        </Button>
      ) : (
        ""
      )}
    </div>
  )
}
