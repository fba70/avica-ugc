import { Suspense } from "react"
import { PaymentCanceled } from "@/components/blocks/payment-canceled"

export default function PaymentCanceledPage() {
  return (
    <Suspense>
      <PaymentCanceled />
    </Suspense>
  )
}
