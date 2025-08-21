import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

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

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const productId = searchParams.get("productId")

    if (!userId || !productId) {
      return NextResponse.json(
        {
          error: "userId and productId are required to create product instance",
        },
        { status: 400 }
      )
    }

    // Fetch product data
    const product = await db.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const newInstance = await db.productInstance.create({
      data: {
        userId: userId,
        productId: productId,
        status: "active",
        limitImages: product.limitImages,
        limitVideos: product.limitVideos,
        imagesCount: product.limitImages,
        videosCount: product.limitVideos,
        stripePaymentLinkPriceId: product.stripePaymentLinkPriceId,
        paidStatus: "unpaid",
      },
    })

    return NextResponse.json(newInstance, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create product instance",
        details: (error as Error).message,
      },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId, productInstanceId, ...updateData } = await req.json()

    if (!userId || !productInstanceId) {
      return NextResponse.json(
        { error: "userId and productInstanceId are required" },
        { status: 400 }
      )
    }

    // Check if the instance belongs to the user
    const instance = await db.productInstance.findUnique({
      where: { id: productInstanceId },
    })

    if (!instance || instance.userId !== userId) {
      return NextResponse.json(
        { error: "Product instance not found or does not belong to user" },
        { status: 404 }
      )
    }

    const updatedInstance = await db.productInstance.update({
      where: { id: productInstanceId },
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
