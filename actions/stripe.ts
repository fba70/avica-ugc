"use server"

import Stripe from "stripe"
import axios from "axios"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function createCheckoutSession({
  productId,
  userId,
}: {
  productId: string
  userId: string
}) {
  // 1. Check Stripe integration
  try {
    // This will throw if the key is invalid or Stripe is unreachable
    await stripe.accounts.retrieve()
  } catch (error) {
    console.error("Stripe integration check failed:", error)
    return { error: "Stripe integration failed. Please try again later." }
  }

  // 2. Create product instance with unpaid status
  let productInstanceId = ""
  let priceId = ""
  try {
    const response = await axios.post(
      `/api/product-instances?userId=${userId}&productId=${productId}`
    )
    productInstanceId = response.data.id
    priceId = response.data.stripePaymentLinkPriceId
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
          price: priceId, // Stripe Payment Link ID
          quantity: 1,
        },
      ],
      mode: "payment",
      // These are the URLs Stripe will redirect to after payment
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/canceled?session_id={CHECKOUT_SESSION_ID}`,
      // Crucially, we pass our internal order ID in the metadata
      metadata: {
        orderId: productInstanceId,
      },
    })

    if (session.url) {
      return { url: session.url }
    } else {
      return { error: "Could not create a checkout session." }
    }
  } catch (error) {
    console.error("Stripe Error:", error)
    return { error: "Failed to create checkout session." }
  }
}
