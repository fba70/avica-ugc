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
  image: string,
  overlayFlag: boolean
): Promise<{ error?: string; secure_url?: string; public_id?: string }> => {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`

  // Transformation example for overlay - does not work for now
  const image3 = "RD_hes6hz"
  const image2 = "Image_bottom_cywcpt"
  const image1 = "Image_top_nxvzqe"
  const text = "John Doe"

  const transformations = [
    "w_1024,h_1024,c_fill,f_auto,q_auto",
    `l_${image1},w_1024,h_100,g_north_west,x_0,y_0`,
    `l_text:Arial_48:${encodeURIComponent(
      text
    )},w_928,h_68,g_north_west,x_48,y_16`,
    `l_${image2},w_1024,h_160,g_north_west,x_0,y_864`,
    `l_${image3},w_256,h_128,g_north_west,x_48,y_880`,
  ].join(",")

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

  // !!! Transformations would NOT work this way, so the flag should be false always in this code
  if (overlayFlag) {
    formData.append("transformation", transformations)
  }

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
