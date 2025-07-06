import { NextResponse } from "next/server"
import Replicate from "replicate"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(req) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error("The REPLICATE_API_TOKEN environment variable is not set")
  }

  const { ugcUrl, prompt } = await req.json()

  if (!prompt || !ugcUrl) {
    return NextResponse.json(
      { detail: "Prompt and image URL are required" },
      { status: 400 }
    )
  }

  const composedPrompt =
    `Use the image provided as an input to animate it. Additional scene description is provided as: ${prompt}`.trim()

  const prediction = await replicate.run("google/veo-2", {
    input: {
      prompt: composedPrompt,
      image: ugcUrl,
      aspect_ratio: "16:9",
      duration: 5,
      enhance_prompt: true,
    },
  })

  console.log("Prediction output:", prediction)
  console.log("Prediction type:", typeof prediction)
  if (Array.isArray(prediction)) {
    console.log(
      "Prediction is array, first element type:",
      typeof prediction[0],
      prediction[0]
    )
  } else if (prediction && typeof prediction === "object") {
    console.log("Prediction object keys:", Object.keys(prediction))
  }

  if (prediction?.error) {
    return NextResponse.json({ detail: prediction.error }, { status: 500 })
  }

  let videoUrl

  // Handle different output formats
  if (typeof prediction === "string") {
    videoUrl = prediction // Direct URL
  } else if (Array.isArray(prediction) && typeof prediction[0] === "string") {
    videoUrl = prediction[0] // Array of URLs
  } else if (prediction?.output && typeof prediction.output === "string") {
    videoUrl = prediction.output // Object with string output
  } else if (prediction?.output && Array.isArray(prediction.output)) {
    videoUrl = prediction.output[0] // Object with array output
  } else if (prediction instanceof ReadableStream) {
    // Handle direct ReadableStream
    const chunks = []
    const reader = prediction.getReader()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }

    const buffer = Buffer.concat(chunks)
    videoUrl = `data:video/mp4;base64,${buffer.toString("base64")}`
  } else if (
    Array.isArray(prediction) &&
    prediction[0] instanceof ReadableStream
  ) {
    // Handle array with ReadableStream (for completeness)
    const stream = prediction[0]
    const chunks = []
    const reader = stream.getReader()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }

    const buffer = Buffer.concat(chunks)
    videoUrl = `data:video/mp4;base64,${buffer.toString("base64")}`
  } else {
    throw new Error(
      "Unexpected output format from Replicate: " +
        JSON.stringify(prediction, null, 2)
    )
  }

  return NextResponse.json({ output: videoUrl }, { status: 201 })
}
