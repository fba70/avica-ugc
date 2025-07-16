import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function POST(req: NextRequest) {
  const { claimToken, userId } = await req.json()
  if (!claimToken || !userId) {
    return NextResponse.json(
      { error: "Missing claimToken or userId" },
      { status: 400 }
    )
  }

  // Update all SPARKBITS with this claimToken to set userId and clear claimToken
  await db.seenDrop.updateMany({
    where: { claimToken },
    data: { userId, claimToken: null },
  })

  return NextResponse.json({ success: true })
}
