"use client"

import { useState } from "react"
import { createTransformedVideo } from "@/actions/add-video-layout"

export default function TestVideoTransformPage() {
  // Hardcoded params (replace with your actual public IDs)
  const videoPublicId = "0d1e33b7-a9e1-4ce7-8ac1-b493e943d3d3"
  const overlayPublicId = "OverlayImage_xsxggj"

  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleTransform = async () => {
    setLoading(true)
    setError(null)
    setVideoUrl(null)
    const result = await createTransformedVideo(videoPublicId, overlayPublicId)
    if (result.url) {
      setVideoUrl(result.url)
    } else {
      setError(result.error || "Unknown error")
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 bg-gray-900">
      <h1 className="text-2xl text-white font-bold mb-4">
        Test Cloudinary Video Transformation
      </h1>
      <button
        className="px-6 py-2 bg-orange-500 text-white rounded shadow"
        onClick={handleTransform}
        disabled={loading}
      >
        {loading ? "Processing..." : "Transform Video"}
      </button>
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {videoUrl && (
        <video
          src={videoUrl}
          controls
          className="mt-6 rounded shadow-lg max-w-4xl"
        />
      )}
    </div>
  )
}
