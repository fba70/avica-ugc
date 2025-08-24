"use client"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function PaymentCanceled() {
  const router = useRouter()
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
      <Card className="w-[360px]">
        <CardHeader>
          <CardTitle className="flex flex-row items-center justify-center gap-4 text-red-500">
            <XCircle /> Payment was not successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <h2 className="font-semibold mt-4 mb-2 text-lg text-white">
            Product is not purchased.
          </h2>
          {orderId && (
            <div className="mb-1">
              <span className="text-sm text-gray-400">
                Your purchase order ID:
              </span>
              <br />
              <span className="text-white">{orderId}</span>
            </div>
          )}
          <Button className="mt-2 w-full" onClick={() => router.push("/admin")}>
            Go to My Account
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
