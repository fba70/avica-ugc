import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { EventSchema } from "@/schemas"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  console.log(id)

  if (id) {
    // Return a single event by id
    const event = await db.event.findUnique({ where: { id } })
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }
    return NextResponse.json(event)
  } else {
    // Return all events
    const events = await db.event.findMany()
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

export async function PATCH(req: NextRequest) {
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
