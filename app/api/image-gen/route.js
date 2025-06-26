import { NextResponse } from "next/server"
import Replicate from "replicate"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(req) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error("The REPLICATE_API_TOKEN environment variable is not set")
  }

  const { url1, url2, text1, text2, prompt } = await req.json()

  const composedPrompt =
    `Use the image_1 as an object which should be added to the scene defined by the image_2. Object is described as: ${text1}. Scene is described as: ${text2}. Additional scene description is provided as: ${prompt}. Try to preserve the content and style of image_1 as much as possible merging them together`.trim()

  const prediction = await replicate.run(
    "fofr/image-merge-sdxl:101190cbcc57984b9bfba21e1beea3694dc9d121ed1695059b0d4832e468cd75",
    {
      input: {
        steps: 20,
        width: 1280,
        height: 720,
        prompt: composedPrompt,
        image_1: url1,
        image_2: url2,
        base_model: "albedobaseXL_v13.safetensors",
        batch_size: 1,
        merge_strength: 0.92,
        negative_prompt: "",
        added_merge_noise: 0,
      },
    }
  )

  if (prediction?.error) {
    return NextResponse.json({ detail: prediction.error }, { status: 500 })
  }

  // Handle the output (expecting an array with a ReadableStream)
  if (
    !Array.isArray(prediction) ||
    prediction.length === 0 ||
    !(prediction[0] instanceof ReadableStream)
  ) {
    throw new Error(
      "Unexpected output format: Expected an array with a ReadableStream"
    )
  }

  // Convert ReadableStream to a Buffer
  const stream = prediction[0]
  const chunks = []
  const reader = stream.getReader()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
  }

  const buffer = Buffer.concat(chunks)
  const base64Image = `data:image/png;base64,${buffer.toString("base64")}`

  // console.log("Base64 Image:", base64Image)

  return NextResponse.json({ output: base64Image }, { status: 201 })
}
