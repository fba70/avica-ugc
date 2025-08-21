import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { imageUploadCloudinary } from "@/actions/upload-image"

function isMobile() {
  if (typeof navigator === "undefined") return false
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

export function SelfieCapture({
  onCapture,
  disabled,
}: {
  onCapture: (url: string) => void
  disabled?: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturing, setCapturing] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Desktop camera logic
  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera access is not supported in this browser.")
      return
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 320, height: 240 },
      })
      setStream(s)
      setCapturing(true)
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert(
        "Could not access the camera. Please check permissions or device availability."
      )
    }
  }

  useEffect(() => {
    if (capturing && stream && videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.play().catch(() => {})
    }
  }, [capturing, stream])

  const capture = async () => {
    if (!videoRef.current) return
    const canvas = document.createElement("canvas")
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext("2d")
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL("image/png")
    stopCamera()

    setUploading(true)
    const uploadResult = await imageUploadCloudinary(dataUrl, false)
    setUploading(false)

    if (uploadResult.error) {
      alert("Cloudinary upload error: " + uploadResult.error)
      return
    }
    onCapture(uploadResult.secure_url || "")
  }

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop())
    setStream(null)
    setCapturing(false)
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  // Mobile file input logic
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const reader = new FileReader()
    reader.onloadend = async () => {
      const dataUrl = reader.result as string
      const uploadResult = await imageUploadCloudinary(dataUrl, false)
      setUploading(false)
      if (uploadResult.error) {
        alert("Cloudinary upload error: " + uploadResult.error)
        return
      }
      onCapture(uploadResult.secure_url || "")
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Hidden file input for mobile */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="user"
        style={{ display: "none" }}
        onChange={handleFileChange}
        disabled={disabled || uploading}
      />
      {!capturing ? (
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            if (isMobile()) {
              fileInputRef.current?.click()
            } else {
              startCamera()
            }
          }}
          disabled={disabled || uploading}
        >
          Or Take a Selfie
        </Button>
      ) : (
        <>
          <video
            ref={videoRef}
            width={380}
            height={320}
            autoPlay
            style={{ display: "block" }}
          />
          <div className="flex flex-row items-center justify-center gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={capture}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Capture"}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={stopCamera}
              disabled={uploading}
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

/*
import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { imageUploadCloudinary } from "@/actions/upload-image" // adjust import if needed

export function SelfieCapture({
  onCapture,
  disabled,
}: {
  onCapture: (url: string) => void
  disabled?: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturing, setCapturing] = useState(false)
  const [uploading, setUploading] = useState(false)

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera access is not supported in this browser.")
      return
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 320, height: 240 },
      })
      setStream(s)
      setCapturing(true)
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert(
        "Could not access the camera. Please check permissions or device availability."
      )
    }
  }

  useEffect(() => {
    if (capturing && stream && videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.play().catch(() => {})
    }
  }, [capturing, stream])

  const capture = async () => {
    if (!videoRef.current) return
    const canvas = document.createElement("canvas")
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext("2d")
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL("image/png")
    stopCamera()

    // Upload to Cloudinary
    setUploading(true)
    const uploadResult = await imageUploadCloudinary(dataUrl, false)
    setUploading(false)

    if (uploadResult.error) {
      alert("Cloudinary upload error: " + uploadResult.error)
      return
    }
    // Pass the Cloudinary URL to the parent
    onCapture(uploadResult.secure_url || "")
  }

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop())
    setStream(null)
    setCapturing(false)
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="flex flex-col gap-2">
      {!capturing ? (
        <Button
          variant="outline"
          type="button"
          onClick={startCamera}
          disabled={disabled || uploading}
        >
          Or Take a Selfie
        </Button>
      ) : (
        <>
          <video
            ref={videoRef}
            width={380}
            height={320}
            autoPlay
            style={{ display: "block" }}
          />
          <div className="flex flex-row items-center justify-center gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={capture}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Capture"}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={stopCamera}
              disabled={uploading}
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
  */
