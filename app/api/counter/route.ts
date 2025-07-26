import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  if (userId) {
    // Return product instances of the user
    const productInstances = await db.productInstance.findMany({
      where: { userId },
    })

    if (!productInstances || productInstances.length === 0) {
      return NextResponse.json(
        { error: "Product instances are not found" },
        { status: 404 }
      )
    }

    const activeInstances = productInstances.filter(
      (item) => item.status === "active"
    )
    const totalImagesCount = activeInstances.reduce(
      (sum, item) => sum + (item.imagesCount || 0),
      0
    )
    const totalVideosCount = activeInstances.reduce(
      (sum, item) => sum + (item.videosCount || 0),
      0
    )

    return NextResponse.json({
      totalImagesCount,
      totalVideosCount,
    })
  } else {
    return NextResponse.json(
      { error: "No userId is specified" },
      { status: 400 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get("eventId")
    const flag = searchParams.get("flag")

    if (!eventId || (flag !== "image" && flag !== "video")) {
      return NextResponse.json(
        { error: "Event ID and flag ('image' or 'video') are required" },
        { status: 400 }
      )
    }

    // 1. Find the event and deduct imagesCount/videosCount
    const event = await db.event.findUnique({ where: { id: eventId } })
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    let newImagesCount = event.imagesCount ?? 0
    let newVideosCount = event.videosCount ?? 0

    if (flag === "image") {
      newImagesCount = Math.max(0, newImagesCount - 1)
    } else {
      newVideosCount = Math.max(0, newVideosCount - 1)
    }

    await db.event.update({
      where: { id: eventId },
      data: {
        imagesCount: newImagesCount,
        videosCount: newVideosCount,
      },
    })

    // 2. Find the userId (partner) who owns the event
    const userId = event.userId
    if (!userId) {
      return NextResponse.json(
        { error: "Event does not have an associated userId" },
        { status: 400 }
      )
    }

    // 3. Update partner's productInstance total counts
    const productInstances = await db.productInstance.findMany({
      where: { userId, status: "active" },
      orderBy: { createdAt: "asc" },
    })

    const filtered = productInstances.filter((item) =>
      flag === "image"
        ? (item.imagesCount ?? 0) > 0
        : (item.videosCount ?? 0) > 0
    )

    if (filtered.length === 0) {
      return NextResponse.json(
        { error: `No active product instance with available ${flag}s` },
        { status: 404 }
      )
    }

    const target = filtered[0]
    const updateData =
      flag === "image"
        ? { imagesCount: { decrement: 1 } }
        : { videosCount: { decrement: 1 } }

    await db.productInstance.update({
      where: { id: target.id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: `1 ${flag} deducted from event and productInstance ${target.id}`,
      eventImagesCount: newImagesCount,
      eventVideosCount: newVideosCount,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    )
  }
}
