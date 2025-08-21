import { Suspense } from "react"
import { PaymentSuccess } from "@/components/blocks/payment-success"

export default function PaymentCanceledPage() {
  return (
    <Suspense>
      <PaymentSuccess />
    </Suspense>
  )
}
