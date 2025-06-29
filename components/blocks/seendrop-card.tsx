"use client"

import Image from "next/image"
import { ShareSeenDrop } from "@/components/blocks/share-seendrop"
import { SeenDropItem } from "@/types/types"

export default function SeenDropCard({
  seenDropInfo,
}: {
  seenDropInfo: SeenDropItem
}) {
  return (
    <div className="w-[350px]] flex flex-col items-center justify-center bg-gray-200">
      <div className="relative h-[350px] w-[350px]">
        <Image
          src={seenDropInfo.imageUrl || "/Avatar.jpg"}
          fill
          alt="Picture of the author"
          className="object-cover object-center"
        />
      </div>

      <p className="mx-auto text-xl font-medium text-black mt-4">
        {seenDropInfo.name}
      </p>

      <p className="mx-auto text-lg font-medium text-black mt-4 w-[320px] h-[80px] text-center line-clamp-4">
        {seenDropInfo.message}
      </p>

      <div className="mb-6 mt-6">
        {seenDropInfo.imageUrl && <ShareSeenDrop url={seenDropInfo.imageUrl} />}
      </div>
    </div>
  )
}
