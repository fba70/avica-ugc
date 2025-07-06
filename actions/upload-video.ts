"use server"

import { auth } from "@clerk/nextjs/server"
import axios from "axios"
import { v4 as uuidv4 } from "uuid"

/*
const dataURLtoFile = (dataurl: string): File => {
  const arr = dataurl.split(",")
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n) {
    u8arr[n - 1] = bstr.charCodeAt(n - 1)
    n -= 1
  }
  return new File([u8arr], "image.png", { type: mime })
}
  */

export const videoUploadCloudinary = async (
  video: string
): Promise<{ error?: string }> => {
  const { userId } = await auth()

  if (!userId) {
    return { error: "Unauthorized!" }
  }

  // Check for DB user with externalId = userId
  /*
  let dbUser
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/user?externalId=${userId}`
    )
    dbUser = Array.isArray(res.data) ? res.data[0] : undefined
  } catch (err) {
    return { error: `Failed to check DB user: ${err}` }
  }

  if (!dbUser) {
    return { error: "Unauthorized! No DB user found." }
  }
  */

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
  const file = new File([blob], `SennDrop-${Date.now()}.mp4`, {
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
