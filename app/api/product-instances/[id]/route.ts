import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const updateData = await req.json()
    const { id } = await params

    // Check if the instance exists
    const instance = await db.productInstance.findUnique({
      where: { id },
    })

    if (!instance) {
      return NextResponse.json(
        { error: "Product instance not found" },
        { status: 404 }
      )
    }

    const updatedInstance = await db.productInstance.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updatedInstance)
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to update product instance",
        details: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
