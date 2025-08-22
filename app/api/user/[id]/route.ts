import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { UsersSchema } from "@/schemas"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const data = await request.json()
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  // Only validate the fields being updated (partial validation)
  const partial = { ...data, id }
  const parsed = UsersSchema.partial().safeParse(partial)

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
      data,
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
