import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { PaymentItem } from "@/types/types"
import { PaymentsSchema } from "@/schemas"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  const productInstanceId = searchParams.get("productInstanceId")
  const sessionId = searchParams.get("sessionId")

  try {
    const payments = await db.payment.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(productInstanceId ? { productInstanceId } : {}),
        ...(sessionId ? { sessionId } : {}),
      },
      include: {
        productInstance: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(payments)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch payments", details: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // Validate with Zod schema
    const parsed = PaymentsSchema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.errors },
        { status: 400 }
      )
    }

    const payment = parsed.data as PaymentItem

    const createdPayment = await db.payment.create({ data: payment })
    return NextResponse.json(createdPayment, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create payment", details: (error as Error).message },
      { status: 500 }
    )
  }
}
