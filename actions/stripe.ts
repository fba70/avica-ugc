"use server"

import Stripe from "stripe"
import axios from "axios"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
  typescript: true,
})

export async function createCheckoutSession({
  productId,
  userId,
}: {
  productId: string
  userId: string
}) {
  // 1. Check Stripe integration
  let stripeAccount: Stripe.Account
  try {
    // This will throw if the key is invalid or Stripe is unreachable
    stripeAccount = await stripe.accounts.retrieve()
    console.log("Stripe account:", stripeAccount)
  } catch (error) {
    console.error("Stripe integration check failed:", error)
    return { error: "Stripe integration failed. Please try again later." }
  }

  // 2. Create product instance with unpaid status
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  let productInstanceId = ""
  let priceId = ""
  let productName = ""
  try {
    const response = await axios.post(
      `${baseUrl}/api/product-instances?userId=${userId}&productId=${productId}`
    )
    productInstanceId = response.data.id
    priceId = response.data.stripePaymentLinkPriceId
    productName = response.data.productName
    console.log("Product instance created:", response.data)
  } catch (error) {
    console.log("Error creating product instance:", error)
    return
  }

  // 3. Create Stripe checkout session
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      // These are the URLs Stripe will redirect to after payment
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/canceled?session_id={CHECKOUT_SESSION_ID}`,
      // Extra data passed to the payment session as metadata
      metadata: {
        userId: userId,
        orderId: productInstanceId,
        stripeAccountId: stripeAccount.id,
        name: productName,
      },
      // Invoices data enabler
      invoice_creation: {
        enabled: true,
      },
    })

    // console.log("Stripe checkout session created 1:", session)

    if (session.url) {
      console.log("Stripe checkout session created:", session)

      // Update product instance with stripeSessionId
      try {
        await axios.patch(
          `${baseUrl}/api/product-instances/${productInstanceId}`,
          { stripeSessionId: session.id }
        )
        // console.log("Product instance updated with stripeSessionId:", session.id)
      } catch (error) {
        console.error(
          "Failed to update product instance with stripeSessionId:",
          error
        )
      }

      return { url: session.url }
    } else {
      console.error("Could not create check-out session")
      return { error: "Could not create a checkout session." }
    }
  } catch (error) {
    console.error("Stripe Error:", error)
    return { error: "Failed to create checkout session." }
  }
}
