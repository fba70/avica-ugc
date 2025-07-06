import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

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

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera access is not supported in this browser.")
      return
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 320, height: 240 },
      })
      console.log("Stream acquired:", s)
      setStream(s)
      setCapturing(true) // This will trigger the video element to render
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert(
        "Could not access the camera. Please check permissions or device availability."
      )
    }
  }

  // Use useEffect to assign the stream to the video element after capturing is true
  useEffect(() => {
    if (capturing && stream && videoRef.current) {
      console.log("Assigning stream to video element")
      videoRef.current.srcObject = stream
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error)
      })
    }
  }, [capturing, stream])

  const capture = () => {
    if (!videoRef.current) return
    const canvas = document.createElement("canvas")
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext("2d")
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL("image/png")
    onCapture(dataUrl)
    stopCamera()
  }

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop())
    setStream(null)
    setCapturing(false)
  }

  // Cleanup stream on component unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="flex flex-col gap-2">
      {!capturing ? (
        <Button variant="outline" onClick={startCamera} disabled={disabled}>
          Or Take a Selfie
        </Button>
      ) : (
        <>
          <video
            ref={videoRef}
            width={320}
            height={320}
            autoPlay
            style={{ display: "block" }}
          />
          <div className="flex flex-row items-center justify-center gap-4">
            <Button variant="outline" onClick={capture}>
              Capture
            </Button>
            <Button variant="outline" onClick={stopCamera}>
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
