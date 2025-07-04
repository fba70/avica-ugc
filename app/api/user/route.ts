import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { UsersSchema } from "@/schemas"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const externalId = searchParams.get("externalId")

  if (externalId) {
    // Return all users with this externalId (should be 0 or 1)
    const users = await db.user.findMany({ where: { externalId } })
    return NextResponse.json(users)
  } else {
    // Return all users
    const users = await db.user.findMany()
    return NextResponse.json(users)
  }
}

export async function POST(request: Request) {
  const response = NextResponse.json({ message: "CORS enabled" })
  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type")

  try {
    const data = await request.json()
    const parsed = UsersSchema.safeParse(data)

    if (!parsed.success) {
      console.error("Validation errors:", parsed.error.errors)
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.errors },
        { status: 400 }
      )
    }

    const user = await db.user.create({
      data: parsed.data,
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: "Failed to create user", details: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  const data = await req.json()
  const id = data.id

  // console.log("PUT /api/user received data:", data)

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 })
  }

  const parsed = UsersSchema.safeParse(data)

  if (!parsed.success) {
    console.error("Validation errors:", parsed.error.errors)
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.errors },
      { status: 400 }
    )
  }

  try {
    const user = await db.user.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Failed to update user", details: (error as Error).message },
      { status: 500 }
    )
  }
}
