"use server"

import { auth } from "@clerk/nextjs/server"
import { v2 as cloudinary } from "cloudinary"
import type { UploadApiResponse } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export const createTransformedVideo = async (
  videoPublicId: string, // must be public_id, not secure_url
  overlayPublicId: string // overlay image public_id
): Promise<
  UploadApiResponse | { error: string; secure_url?: string; public_id?: string }
> => {
  const { userId } = await auth()
  if (!userId) {
    return { error: "Unauthorized!" }
  }

  if (!videoPublicId) {
    return { error: "Video public_id is required." }
  }
  if (!overlayPublicId) {
    return { error: "Overlay image public_id is required." }
  }

  try {
    const transformation = [
      {
        overlay: overlayPublicId, // e.g. "overlays/my_overlay"
        gravity: "south_east",
        width: "1.0",
        x: 0,
        y: 0,
      },
    ]

    // 1. Generate the transformed video (does not overwrite original)
    const result = await cloudinary.uploader.explicit(videoPublicId, {
      type: "upload",
      resource_type: "video",
      eager: [{ transformation }],
    })

    // 2. Upload the transformed video as a new asset (new public_id)
    if (result.eager && result.eager[0] && result.eager[0].secure_url) {
      const newPublicId = `${videoPublicId}_with_overlay_${Date.now()}`
      const uploadResult = await cloudinary.uploader.upload(
        result.eager[0].secure_url,
        {
          resource_type: "video",
          public_id: newPublicId,
        }
      )

      return uploadResult
    } else {
      return { error: "Failed to generate transformed video." }
    }
  } catch (error) {
    console.error("Cloudinary explicit transformation error:", error)
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: "Failed to transform video." }
  }
}
