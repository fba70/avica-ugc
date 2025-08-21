import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import axios from "axios"

// import { db } from '@/lib/db'; // Your database utility

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("Stripe-Signature")
  if (!signature) {
    console.error("Missing Stripe-Signature header")
    return new NextResponse("Missing Stripe-Signature header", { status: 400 })
  }

  const { userId } = await auth()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error(`Webhook signature verification failed: ${message}`)
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session

      // Retrieve the productInstanceId from metadata
      const productInstanceId = session.metadata?.orderId

      if (!productInstanceId) {
        console.error(
          "Webhook Error: Missing productInstanceId in session metadata."
        )
        break
      }

      console.log(
        `Payment successful for product instance ${productInstanceId}`
      )

      try {
        const updatedInstance = await axios.patch(`/api/product-instances`, {
          userId: userId,
          productInstanceId: productInstanceId,
          status: "paid",
          stripeSessionId: session.id,
        })
        console.log("Product instance is updated:", updatedInstance.data)
      } catch (error) {
        console.log("Error updating product instance:", error)
      }

      break
    // ... handle other event types if necessary
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
