import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function PATCH(req: NextRequest) {
  const data = await req.json()
  const id = data.id

  if (!id) {
    return NextResponse.json({ error: "SeenDrop ID required" }, { status: 400 })
  }

  const existingSeendrop = await db.seenDrop.findUnique({ where: { id } })
  if (!existingSeendrop) {
    return NextResponse.json({ error: "Seendrop not found" }, { status: 404 })
  }

  const updatedSeendrop = await db.seenDrop.update({
    where: { id },
    data,
  })

  return NextResponse.json(updatedSeendrop)
}
