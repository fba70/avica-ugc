"use client"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"

export function PaymentCanceled() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) return
    axios.get(`/api/stripe/session?session_id=${sessionId}`).then((res) => {
      setOrderId(res.data.session.metadata.orderId)
    })
  }, [sessionId])

  return (
    <section className="w-full max-w-7xl flex flex-col items-center justify-center">
      <div className="w-[360px]">
        <h1>Your payment was not successful!</h1>
        <h2>Product is not purchased!</h2>
        {orderId && <p>Your purchase order ID: {orderId}</p>}
      </div>
    </section>
  )
}
