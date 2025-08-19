export interface CustomImageWithOverlaysParams {
  text: string
  overlayColorCode: string
  logoImage: string
}

export async function createOverlays({
  text,
  overlayColorCode,
  logoImage,
}: CustomImageWithOverlaysParams) {
  // Canvas setup
  const width = 1280
  const height = 720
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas context not available")

  // Helper to load images
  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.crossOrigin = "anonymous"
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  // Draw bottom overlay stripe at (0, 720), size 1184x160
  ctx.save()
  ctx.fillStyle = overlayColorCode
  ctx.fillRect(0, 560, 1280, 160)
  ctx.restore()

  // Draw text overlay at bottom left (720x128 at x=16, y=736), on top of the stripe
  ctx.save()
  ctx.font = "48px Arial, sans-serif"
  ctx.fillStyle = "white"
  ctx.textAlign = "left"
  ctx.textBaseline = "middle"
  ctx.beginPath()
  ctx.rect(16, 576, 816, 128)
  ctx.clip()
  ctx.fillText(text, 24, 640, 800) // x=24 (left padding), y=800 (vertical center)
  ctx.restore()

  // Draw 3rd overlay (logo) at bottom right (400x128 at x=756, y=736), right-aligned
  const img3 = await loadImage(logoImage || "/Logo_AVICA.jpg")
  const destWidth = 400
  const destHeight = 128
  const destX = 864
  const destY = 576

  // Fit logo inside 400x128, always right-aligned
  const imgAspect = img3.width / img3.height
  const destAspect = destWidth / destHeight

  let drawWidth, drawHeight, dx, dy

  if (imgAspect > destAspect) {
    // Image is wider: fit by width
    drawWidth = destWidth
    drawHeight = destWidth / imgAspect
    dx = destX + (destWidth - drawWidth) // right align
    dy = destY + (destHeight - drawHeight) / 2
  } else {
    // Image is taller: fit by height
    drawHeight = destHeight
    drawWidth = destHeight * imgAspect
    dx = destX + (destWidth - drawWidth) // right align
    dy = destY
  }

  ctx.drawImage(
    img3,
    0,
    0,
    img3.width,
    img3.height, // source
    dx,
    dy,
    drawWidth,
    drawHeight // destination
  )

  return canvas.toDataURL("image/png")
}
