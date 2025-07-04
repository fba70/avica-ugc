"use client"

import Image from "next/image"
import { ShareSeenDrop } from "@/components/blocks/share-seendrop"
import { SeenDropItem } from "@/types/types"
import { Button } from "../ui/button"
import { SquarePlay } from "lucide-react"

export default function SeenDropCard({
  seenDropInfo,
}: {
  seenDropInfo: SeenDropItem
}) {
  return (
    <div className="w-[350px]] flex flex-col items-center justify-center bg-transparent">
      <div className="relative h-[350px] w-[350px]">
        <Image
          src={seenDropInfo.imageOverlayedUrl || "/Avatar.jpg"}
          fill
          alt="Picture of the author"
          className="object-cover object-center"
        />
      </div>

      <div className="flex flex-row items-center gap-4 justify-center mb-4 mt-4">
        {seenDropInfo.imageUrl && <ShareSeenDrop url={seenDropInfo.imageUrl} />}
        {seenDropInfo.imageUrl && (
          <Button>
            <SquarePlay />
            ANIMATE!
          </Button>
        )}
      </div>
    </div>
  )
}

/*
<p className="mx-auto text-xl font-medium text-black mt-2 mb-2">
        {seenDropInfo.name}
      </p>

      <p className="mx-auto text-sm font-medium text-black w-[320px] h-[40px] text-center line-clamp-2">
        {seenDropInfo.message}
      </p>

*/
