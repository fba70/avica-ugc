"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Eye, Timer, TimerOff } from "lucide-react"
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
          src={cardInfo.brandLogoUrl || "/Logo_AVICA.png"}
          fill
          alt="Picture of the author"
          className="object-contain object-center pl-6 pr-6 mt-2"
        />
      </div>

      <p className="mx-auto text-sm font-medium text-white mt-4 mb-4 pr-2 pl-2 w-[320px] h-[60px] text-center line-clamp-4">
        <span className="text-gray-400 mr-2">Event description: </span>
        {cardInfo.description}
      </p>

      <div className="flex flex-row gap-2 items-center justify-center w-[320px]">
        <p className="flex flex-row gap-2 items-center justify-center mx-auto text-sm font-medium text-white text-center line-clamp-4">
          <Timer size={16} />
          {cardInfo.startDate
            ? new Date(cardInfo.startDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Not specified"}
        </p>

        <p className=" flex flex-row gap-2 items-center justify-center mx-auto text-sm font-medium text-white text-center line-clamp-4">
          <TimerOff size={16} />
          {cardInfo.endDate
            ? new Date(cardInfo.endDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Not specified"}
        </p>
      </div>

      {showButton ? (
        <Button
          className="flex flex-row items-center justify-center gap-4 mt-6"
          onClick={() => router.push(`/events/${cardInfo.id}`)}
        >
          <Eye />
          <p className="pr-2 text-lg">Event SPARKBITS</p>
        </Button>
      ) : (
        ""
      )}
    </div>
  )
}
