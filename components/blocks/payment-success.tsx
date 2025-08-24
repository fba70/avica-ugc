"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ProductInstanceItem } from "@/types/types"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { BadgeCheck } from "lucide-react"
import axios from "axios"
import Stripe from "stripe"

export function PaymentSuccess() {
  const router = useRouter()

  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [orderId, setOrderId] = useState<string | null>(null)
  const [productInstance, setProductInstance] = useState<ProductInstanceItem>()
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<Stripe.Checkout.Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) return

    setLoading(true)
    axios
      .get(`/api/stripe/session?session_id=${sessionId}`)
      .then((res) => {
        setOrderId(res.data.session.id)
        setSession(res.data.session as Stripe.Checkout.Session)
        axios
          .get(`/api/product-instances?stripeSessionId=${sessionId}`)
          .then((prodRes) => {
            if (!prodRes.data) {
              setError(
                "No product instance found for this payment. Please contact support."
              )
              setProductInstance(undefined)
              setLoading(false)
              return
            }
            setProductInstance(prodRes.data)
            setLoading(false)
            if (
              orderId &&
              prodRes.data.id &&
              orderId !== prodRes.data.stripeSessionId
            ) {
              setError(
                "Order ID from payment session does not match product instance ID. Please contact support."
              )
            }
          })
          .catch(() => {
            setError(
              "Failed to fetch product instance. Please contact support."
            )
            setProductInstance(undefined)
            setLoading(false)
          })
      })
      .catch(() => {
        setError("Failed to fetch payment session. Please contact support.")
        setLoading(false)
      })
  }, [sessionId, orderId])

  // console.log("Session:", session)

  return (
    <section className="w-full max-w-7xl flex flex-col items-center justify-center">
      <Card className="w-[360px]">
        <CardHeader>
          <CardTitle className="flex flex-row items-center justify-center gap-4">
            <BadgeCheck color="#AAFF00" /> Payment is successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <span className="text-gray-400">
                Loading your purchase data...
              </span>
            </div>
          ) : (
            <>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {productInstance && (
                <div>
                  <h2 className="font-semibold mt-4 mb-2 text-lg text-white">
                    Product Information:
                  </h2>
                  <div className="mb-1">
                    <span className="text-sm text-gray-400">
                      Your purchase order ID:{" "}
                    </span>
                    <br></br>
                    <span className="text-white">{productInstance.id}</span>
                  </div>
                  <div className="mb-1">
                    <span className="text-sm text-gray-400">Product ID: </span>
                    <br></br>
                    <span className="text-white">
                      {productInstance.productId}
                    </span>
                  </div>
                  <div className="mb-1 flex flex-row gap-4 items-center justify-left">
                    <span className="text-sm text-gray-400">
                      Product Name:{" "}
                    </span>

                    <span className="text-white">
                      {productInstance.product.name}
                    </span>
                  </div>
                  <div className="mb-1 flex flex-row gap-4 items-center justify-left">
                    <span className="text-sm text-gray-400">
                      Total amount paid:{" "}
                    </span>

                    <span className="text-white">
                      {session?.amount_total != null
                        ? new Intl.NumberFormat("en-US", {
                            style: "decimal",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(session.amount_total / 100)
                        : ""}
                      {session?.currency
                        ? ` ${session.currency.toUpperCase()}`
                        : ""}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
          <Button className="mt-2 w-full" onClick={() => router.push("/admin")}>
            Go to My Account
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
