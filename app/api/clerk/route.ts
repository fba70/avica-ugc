// app/api/update-user-metadata/route.ts
import { NextResponse } from "next/server"
import { clerkClient } from "@clerk/nextjs/server"

export async function POST(request: Request) {
  try {
    const { userId, userRole } = await request.json()
    const client = await clerkClient()
    // Update user metadata
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        userRole: userRole || "user",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update metadata: ${error}` },
      { status: 500 }
    )
  }
}
