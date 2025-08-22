import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const data = await request.json()
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: "SPARKBIT ID required" }, { status: 400 })
  }

  try {
    const existingSeendrop = await db.seenDrop.findUnique({ where: { id } })
    if (!existingSeendrop) {
      return NextResponse.json({ error: "SPARKBIT not found" }, { status: 404 })
    }

    const updatedSeendrop = await db.seenDrop.update({
      where: { id },
      data,
    })

    return NextResponse.json(updatedSeendrop, { status: 200 })
  } catch (error) {
    console.error("Error updating SPARKBIT:", error)
    return NextResponse.json(
      { error: "Failed to update SPARKBIT", details: (error as Error).message },
      { status: 500 }
    )
  }
}
