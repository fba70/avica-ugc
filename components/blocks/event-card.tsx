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
          src={cardInfo.imageUrl || "/Avatar.jpg"}
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

      <div className="relative h-[120px] w-[350px] ">
        <Image
          src={cardInfo.brandLogoUrl || "/Logo_SeenDrop.png"}
          fill
          alt="Picture of the author"
          className="object-contain object-center pl-6 pr-6 pt-4"
        />
      </div>

      <p className="mx-auto text-sm font-medium text-white mt-4 mb-4 pr-2 pl-2 w-[320px] h-[60px] text-center line-clamp-4">
        <span className="text-gray-400 mr-2">Event description: </span>
        {cardInfo.description}
      </p>

      <p className="mx-auto text-sm font-medium text-white mt-4 w-[320px] text-center line-clamp-4">
        <span className="text-gray-400 mr-2">Start: </span>
        {cardInfo.startDate
          ? new Date(cardInfo.startDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Not specified"}
      </p>

      <p className="mx-auto text-sm font-medium text-white mt-4 mb-4 w-[320px] text-center line-clamp-4">
        <span className="text-gray-400 mr-2">End: </span>
        {cardInfo.endDate
          ? new Date(cardInfo.endDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Not specified"}
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
