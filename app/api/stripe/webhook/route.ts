import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import axios from "axios"

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

  // 1. Check Stripe event
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    console.log("Webhook event constructed:", event.type)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error(`Webhook signature verification failed: ${message}`)
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  // 2. Handle the Stripe event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session

      console.log("Session:", session)

      // 2.1 Retrieve the productInstanceId and session userId from metadata and make checks
      const productInstanceId = session.metadata?.orderId
      const sessionUserId = session.metadata?.userId

      if (!productInstanceId || !sessionUserId) {
        console.error(
          "Stripe Webhook Error: Missing productInstanceId or userId in session metadata."
        )
        break
      }

      // 2.2 Update product instance as paid and add Stripe session ID
      try {
        await axios.patch(
          `${baseUrl}/api/product-instances/${productInstanceId}`,
          { paidStatus: "paid" }
        )
      } catch (error) {
        console.log("Error updating product instance:", error)
      }

      // 2.3 Create Payment record with full payment details
      try {
        const payment = await axios.post(`${baseUrl}/api/payments`, {
          userId: sessionUserId,
          productInstanceId: productInstanceId,
          sessionId: session.id,
          amountTotal: session.amount_total,
          currency: session.currency,
          customerEmail: session.customer_details?.email,
          customerName: session.customer_details?.name,
          customerCountry: session.customer_details?.address?.country,
          paymentStatus: "succeeded",
          status: "completed",
          successUrl: session.success_url,
          cancelUrl: session.cancel_url,
        })
        console.log("Payment record created:", payment.data)
      } catch (error) {
        console.log("Error creating payment record:", error)
      }

      break
    // Handle other event types if necessary

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
