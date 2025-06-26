import { NextResponse } from "next/server"
import Replicate from "replicate"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(req) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error("The REPLICATE_API_TOKEN environment variable is not set")
  }

  const { url1, url2, prompt } = await req.json()

  const composedPrompt =
    `Use the image_1 as an object which should be added to the scene defined by the image_2. Additional scene description is provided as: ${prompt}. Try to preserve the content and style of image_1 as much as possible merging them together`.trim()

  const prediction = await replicate.run(
    "flux-kontext-apps/multi-image-kontext-max",
    {
      input: {
        prompt: composedPrompt,
        aspect_ratio: "1:1",
        input_image_1: url1,
        input_image_2: url2,
      },
    }
  )

  if (prediction?.error) {
    return NextResponse.json({ detail: prediction.error }, { status: 500 })
  }

  // console.log("Prediction:", prediction)

  // Convert ReadableStream to a Buffer
  const stream = prediction
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
