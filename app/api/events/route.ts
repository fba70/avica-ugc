import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { EventSchema } from "@/schemas"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  const userId = searchParams.get("userId")
  const pageName = searchParams.get("pageName")
  const partnerPageName = searchParams.get("partnerPageName")

  if (id) {
    // Return a single event by id
    const event = await db.event.findUnique({ where: { id } })
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }
    return NextResponse.json(event)
  } else if (userId) {
    // Return all events for a specific user
    const events = await db.event.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }, // optional: newest first
    })
    return NextResponse.json(events)
  } else if (pageName) {
    // Return user events with the same page name
    const events = await db.event.findMany({ where: { pageName } })
    const count = events.length
    return NextResponse.json({ count, events })
  } else if (partnerPageName) {
    const users = await db.user.findMany({
      where: { pageName: partnerPageName },
      select: { id: true },
    })
    const userIds = users.map((u) => u.id)
    const events = await db.event.findMany({
      where: { userId: { in: userIds } },
    })
    return NextResponse.json({ events })
  } else {
    // Return all events
    const events = await db.event.findMany({
      orderBy: { createdAt: "desc" }, // optional: newest first
    })
    return NextResponse.json(events)
  }
}

export async function POST(request: Request) {
  const response = NextResponse.json({ message: "CORS enabled" })
  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type")

  try {
    const data = await request.json()
    const parsed = EventSchema.safeParse(data)

    if (!parsed.success) {
      console.error("Validation errors:", parsed.error.errors)
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.errors },
        { status: 400 }
      )
    }

    const event = await db.event.create({
      data: parsed.data,
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json(
      { error: "Failed to create event", details: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  const data = await req.json()
  const id = data.id

  if (!id) {
    return NextResponse.json({ error: "Event ID required" }, { status: 400 })
  }

  const existingEvent = await db.event.findUnique({ where: { id } })
  if (!existingEvent) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }

  const updatedEvent = await db.event.update({
    where: { id },
    data,
  })

  return NextResponse.json(updatedEvent)
}
