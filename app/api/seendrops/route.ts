import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { SeenDropSchema } from "@/schemas"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  const userId = searchParams.get("userId")

  if (id) {
    // Return a single SPARKBIT by id
    const seendrop = await db.seenDrop.findUnique({ where: { id } })
    if (!seendrop) {
      return NextResponse.json({ error: "SPARKBIT not found" }, { status: 404 })
    }
    return NextResponse.json(seendrop)
  } else if (userId) {
    // Return all SPARKBITS for a specific userId
    const seendrops = await db.seenDrop.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(seendrops)
  } else {
    // Return all SPARKBITS
    const seendrops = await db.seenDrop.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(seendrops)
  }
}

export async function POST(request: Request) {
  const response = NextResponse.json({ message: "CORS enabled" })
  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type")

  try {
    const data = await request.json()
    const parsed = SeenDropSchema.safeParse(data)

    if (!parsed.success) {
      console.error("Validation errors:", parsed.error.errors)
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.errors },
        { status: 400 }
      )
    }

    const seendrop = await db.seenDrop.create({
      data: parsed.data,
    })

    return NextResponse.json(seendrop, { status: 201 })
  } catch (error) {
    console.error("Error creating SPARKBIT:", error)
    return NextResponse.json(
      { error: "Failed to create SPARKBIT", details: (error as Error).message },
      { status: 500 }
    )
  }
}
