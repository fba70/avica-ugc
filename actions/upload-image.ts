"use server"

import { v4 as uuidv4 } from "uuid"
import axios from "axios"

const dataURLtoFile = (dataurl: string): File => {
  const arr = dataurl.split(",")
  const match = arr[0].match(/:(.*?);/)
  const mime = match ? match[1] : undefined
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n) {
    u8arr[n - 1] = bstr.charCodeAt(n - 1)
    n -= 1
  }
  return new File([u8arr], "image.png", { type: mime })
}

export const imageUploadCloudinary = async (
  image: string
): Promise<{ error?: string; secure_url?: string }> => {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`

  // Convert image/png;base64 into file
  const fileImage = dataURLtoFile(image)

  // const fileImage2 = fetch(image).then((res) => res.blob())

  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
  const secret = process.env.CLOUDINARY_API_SECRET as string
  // Create form data
  const formData = new FormData()
  formData.append("file", fileImage)
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

export const imageUploadCloudinaryFile = async (
  image: File
): Promise<{ error?: string }> => {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`

  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
  const secret = process.env.CLOUDINARY_API_SECRET as string
  // Create form data
  const formData = new FormData()
  formData.append("file", image)
  formData.append("upload_preset", preset)
  formData.append("api_key", secret)
  formData.append("public_id", uuidv4())

  try {
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

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
