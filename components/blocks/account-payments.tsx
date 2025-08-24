"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { PaymentItem } from "@/types/types"

type AccountPaymentsProps = {
  userId: string
}

type PaymentWithProduct = PaymentItem & {
  productInstance?: {
    product?: {
      name?: string
      description?: string
    }
  }
}

export default function AccountPayments({ userId }: AccountPaymentsProps) {
  const [payments, setPayments] = useState<PaymentWithProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>("")

  const [page, setPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    axios
      .get(`/api/payments?userId=${userId}`)
      .then((res) => {
        setPayments(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load purchases")
        setLoading(false)
      })
  }, [userId])

  const CARDS_PER_PAGE = 3
  const totalPages = Math.ceil(payments.length / CARDS_PER_PAGE)
  const startIdx = (page - 1) * CARDS_PER_PAGE
  const currentPayments = payments.slice(startIdx, startIdx + CARDS_PER_PAGE)

  // console.log("Current Payments:", currentPayments)

  if (loading) return <div>Loading payments...</div>
  if (error) return <div>{error}</div>
  if (payments.length === 0)
    return <div>No payments found for this account</div>

  return (
    <>
      <div className="flex lg:flex-row flex-col items-center justify-between gap-8 my-6">
        {currentPayments.map((item) => (
          <div
            key={item.id}
            className="w-[380px] p-4 border rounded-lg shadow-md"
          >
            <div className="mb-1 flex flex-row gap-4 items-center justify-start">
              <span className="text-sm text-gray-400">Payment date: </span>
              <span className="text-white">
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="mb-1 flex flex-row gap-4 items-center justify-start">
              <span className="text-sm text-gray-400">Payment amount: </span>
              <span className="text-white">
                {item.amountTotal != null
                  ? new Intl.NumberFormat("en-US", {
                      style: "decimal",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(item.amountTotal / 100)
                  : ""}
              </span>
            </div>
            <div className="mb-1 flex flex-row gap-4 items-center justify-start">
              <span className="text-sm text-gray-400">Payment currency: </span>
              <span className="text-white">{item.currency?.toUpperCase()}</span>
            </div>
            <div className="mb-1 flex flex-row gap-4 items-center justify-start">
              <span className="text-sm text-gray-400">Customer email: </span>
              <span className="text-white">{item.customerEmail}</span>
            </div>
            <div className="mb-1 flex flex-row gap-4 items-center justify-start">
              <span className="text-sm text-gray-400">Customer name: </span>
              <span className="text-white">{item.customerName}</span>
            </div>
            <div className="mb-1 flex flex-row gap-4 items-center justify-start">
              <span className="text-sm text-gray-400">Customer country: </span>
              <span className="text-white">{item.customerCountry}</span>
            </div>
            <br />
            <div className="mb-1 flex flex-row gap-4 items-center justify-start">
              <span className="text-sm text-gray-400">Product name: </span>
              <span className="text-white">
                {item.productInstance?.product?.name}
              </span>
            </div>
            <div className="mb-1 flex flex-row gap-4 items-center justify-start">
              <span className="text-sm text-gray-400">Description: </span>

              <span className="text-white">
                {item.productInstance?.product?.description}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-4">
        <Button
          className=" text-gray-300 disabled:text-gray-300"
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </Button>
        <span className="text-sm">
          page {page} of {totalPages}
        </span>
        <Button
          className="text-gray-300 disabled:text-gray-300"
          variant="outline"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </>
  )
}
