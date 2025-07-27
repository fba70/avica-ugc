import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
// import { ProductInstancesSchema } from "@/schemas"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const role = searchParams.get("role")
  const type = searchParams.get("type")

  if (!role) {
    return NextResponse.json(
      { error: "User role is not defined!" },
      { status: 400 }
    )
  }

  if (!type) {
    return NextResponse.json(
      { error: "Product type is not defined!" },
      { status: 400 }
    )
  }

  // Return products list
  const products = await db.product.findMany({
    where: { userType: role, type: type },
    orderBy: { createdAt: "asc" },
  })

  if (!products || products.length === 0) {
    return NextResponse.json(
      { error: "Products are not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(products)
}
