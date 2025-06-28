export interface CustomImageWithOverlaysParams {
  text: string
  baseImageUrl: string
  image1Url: string
  image2Url: string
  image3Url: string
}

export async function createImageWithOverlays({
  text,
  baseImageUrl,
  image1Url,
  image2Url,
  image3Url,
}: CustomImageWithOverlaysParams) {
  // Canvas setup
  const width = 1024
  const height = 1024
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

  // Draw base image
  const baseImg = await loadImage(baseImageUrl)
  ctx.drawImage(baseImg, 0, 0, width, height)

  // Draw 1st overlay (top banner)
  const img1 = await loadImage(image1Url || "/Avatar.jpg")
  ctx.drawImage(img1, 0, 0, 1024, 100)

  // Draw text overlay
  ctx.font = "54px Arial, sans-serif"
  ctx.fillStyle = "white"
  ctx.textBaseline = "top"
  ctx.save()
  ctx.beginPath()
  ctx.rect(48, 16, 928, 68)
  ctx.clip()
  ctx.fillText(text, 48, 16, 928)
  ctx.restore()

  // Draw 2nd overlay (bottom banner)
  const img2 = await loadImage(image2Url || "/Avatar.jpg")
  ctx.drawImage(img2, 0, 864, 1024, 160)

  // Draw 3rd overlay (logo)
  const img3 = await loadImage(image3Url || "/Avatar.jpg")
  const destWidth = 384
  const destHeight = 128
  const destX = 48
  const destY = 880

  const imgAspect = img3.width / img3.height
  const destAspect = destWidth / destHeight

  let drawWidth, drawHeight, dx, dy

  if (imgAspect > destAspect) {
    // Image is wider: fit by width
    drawWidth = destWidth
    drawHeight = destWidth / imgAspect
    dx = destX
    dy = destY + (destHeight - drawHeight) / 2
  } else {
    // Image is taller: fit by height
    drawHeight = destHeight
    drawWidth = destHeight * imgAspect
    dx = destX + (destWidth - drawWidth) / 2
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
  // ctx.drawImage(img3, 48, 880, 256, 128)

  return canvas.toDataURL("image/png")
}
