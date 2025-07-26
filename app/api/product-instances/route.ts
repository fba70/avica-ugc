import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
// import { ProductInstancesSchema } from "@/schemas"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  if (userId) {
    // Return product instances of the user
    const productInstances = await db.productInstance.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    })

    if (!productInstances || productInstances.length === 0) {
      return NextResponse.json(
        { error: "Product instances are not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(productInstances)
  } else {
    // Return all product instances
    const productInstances = await db.productInstance.findMany({
      include: { product: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(productInstances)
  }
}
