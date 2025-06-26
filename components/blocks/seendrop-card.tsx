"use client"

import Image from "next/image"
import { ShareSeenDrop } from "./share-seendrop"
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
          src={seenDropInfo.imageUrl}
          fill
          alt="Picture of the author"
          className="object-cover object-center"
        />
      </div>

      <p className="mx-auto text-xl font-medium text-black mt-4">
        {seenDropInfo.name}
      </p>

      <p className="mx-auto text-xl font-medium text-black mt-4 w-[320px] text-center">
        {seenDropInfo.message}
      </p>

      <div className="mb-6 mt-6">
        <ShareSeenDrop url={seenDropInfo.imageUrl} />
      </div>
    </div>
  )
}
