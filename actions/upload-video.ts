"use server"

import { auth } from "@clerk/nextjs/server"
import axios from "axios"
import { v4 as uuidv4 } from "uuid"

export const videoUploadCloudinary = async (
  video: string
): Promise<{ error?: string; secure_url?: string; public_id?: string }> => {
  const { userId } = await auth()

  if (!userId) {
    return { error: "Unauthorized!" }
  }

  // API URL:
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`

  // Validate input
  if (!video || !video.startsWith("data:video/mp4;base64,")) {
    return {
      error: "Invalid video input: Expected a base64-encoded MP4 data URL",
    }
  }

  // Extract base64 data (remove "data:video/mp4;base64," prefix)
  const base64Data = video.replace(/^data:video\/mp4;base64,/, "")
  const buffer = Buffer.from(base64Data, "base64")

  // Convert buffer to Blob
  const blob = new Blob([buffer], { type: "video/mp4" })

  // Create File object for Cloudinary
  const file = new File([blob], `SparkBits-${Date.now()}.mp4`, {
    type: "video/mp4",
  })

  // Create FormData
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
  const secret = process.env.CLOUDINARY_API_SECRET as string

  // Create form data
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", preset)
  formData.append("api_key", secret)
  formData.append("public_id", uuidv4())

  try {
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    // console.log(response)
    return response.data
  } catch (error) {
    if (typeof error === "object" && error !== null && "response" in error) {
    }
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: String(error) }
  }
}
