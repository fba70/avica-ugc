"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

type AccountPurchasesProps = {
  userId: string
}

type ProductInstance = {
  id: string
  productId: string
  status: string
  paidStatus: string
  createdAt: string
  limitImages: number
  limitVideos: number
  imagesCount: number
  videosCount: number
  product: {
    id: string
    name: string
    description?: string
    type: string
    recurrenceType: string
    priceRecurring: number
    priceOneoff: number
  }
}

export default function AccountPurchases({ userId }: AccountPurchasesProps) {
  const [purchases, setPurchases] = useState<ProductInstance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>("")

  const [page, setPage] = useState(1)
  const [onlyActive, setOnlyActive] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios
      .get(`/api/product-instances?userId=${userId}`)
      .then((res) => {
        setPurchases(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load purchases")
        setLoading(false)
      })
  }, [userId])

  const filteredPurchases = onlyActive
    ? purchases.filter((item) => item.status === "active")
    : purchases

  const CARDS_PER_PAGE = 6
  const totalPages = Math.ceil(filteredPurchases.length / CARDS_PER_PAGE)
  const startIdx = (page - 1) * CARDS_PER_PAGE
  const currentPurchases = filteredPurchases.slice(
    startIdx,
    startIdx + CARDS_PER_PAGE
  )

  const activePurchases = purchases.filter((item) => item.status === "active")
  const totalImagesCount = activePurchases.reduce(
    (sum, item) => sum + (item.imagesCount || 0),
    0
  )
  const totalVideosCount = activePurchases.reduce(
    (sum, item) => sum + (item.videosCount || 0),
    0
  )

  if (loading) return <div>Loading purchases...</div>
  if (error) return <div>{error}</div>
  if (purchases.length === 0) return <div>No purchases found for this user</div>

  return (
    <>
      <div className="mb-4 flex lg:flex-row flex-col lg:gap-12 gap-4 text-white text-lg">
        <div>
          Total images left:{" "}
          <span className="text-green-500">{totalImagesCount}</span>
        </div>
        <div>
          Total videos left:{" "}
          <span className="text-green-500">{totalVideosCount}</span>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <Checkbox
          id="onlyActive"
          checked={onlyActive}
          onCheckedChange={(checked) => setOnlyActive(Boolean(checked))}
        />
        <label htmlFor="onlyActive" className="text-sm">
          Show only active purchases
        </label>
      </div>

      <div className="flex lg:flex-row flex-col items-center justify-between gap-8 my-6">
        {currentPurchases.map((item) => (
          <div
            key={item.id}
            className="w-[380px] p-4 border rounded-lg shadow-md"
          >
            <div className="font-semibold">
              Product name: {item.product.name}
            </div>
            {item.product.description && (
              <div className=" text-gray-400 text-sm">
                Description: {item.product.description}
              </div>
            )}
            <br />
            <div>
              Package status:{" "}
              <span
                className={cn(
                  item.status === "active" ? "text-green-500" : "text-white"
                )}
              >
                {item.status}
              </span>
            </div>
            <div>
              Payment status:{" "}
              <span
                className={cn(
                  item.paidStatus === "paid" ? "text-green-500" : "text-white"
                )}
              >
                {item.paidStatus}
              </span>
            </div>
            <div>Recurrence type: {item.product.recurrenceType}</div>
            {item.product.recurrenceType === "recurring" ? (
              <div>
                Monthly price:{" "}
                <span className="text-green-500">
                  {item.product.priceRecurring}
                </span>{" "}
                EUR
              </div>
            ) : (
              <div>
                One-off price:{" "}
                <span className="text-green-500">
                  {item.product.priceOneoff}
                </span>{" "}
                EUR
              </div>
            )}
            <br />
            <div>Purchased: {new Date().toLocaleDateString("en-GB")}</div>
            <br />
            <div className="flex flex-row gap-4">
              <div className="w-[180px]">Images limit: {item.limitImages}</div>
              <div>
                Images left:{" "}
                <span className="text-green-500">{item.imagesCount}</span>
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="w-[180px]">Videos limit: {item.limitVideos}</div>
              <div>
                Videos left:{" "}
                <span className="text-green-500">{item.videosCount}</span>
              </div>
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
