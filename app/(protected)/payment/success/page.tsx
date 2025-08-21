"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ProductInstanceItem } from "@/types/types"
import axios from "axios"

export default function PaymentSuccess() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [orderId, setOrderId] = useState<string | null>(null)
  const [productInstance, setProductInstance] = useState<ProductInstanceItem>()

  useEffect(() => {
    if (!sessionId) return
    axios.get(`/api/stripe/session?session_id=${sessionId}`).then((res) => {
      setOrderId(res.data.session.metadata.orderId)
      // Fetch product instance by orderId
      axios.get(`/api/product-instance?orderId=${orderId}`).then((prodRes) => {
        setProductInstance(prodRes.data)
      })
    })
  }, [sessionId])

  return (
    <section className="w-full max-w-7xl flex flex-col items-center justify-center">
      <div className="w-[360px]">
        <h1>Payment Success!</h1>
        {orderId && <p>Your purchase order ID: {orderId}</p>}
        {productInstance && (
          <div>
            <h2>Product Information:</h2>
            <pre>{JSON.stringify(productInstance, null, 2)}</pre>
          </div>
        )}
      </div>
    </section>
  )
}
