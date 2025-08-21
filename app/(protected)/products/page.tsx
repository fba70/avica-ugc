"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { toast } from "sonner"
import { UserItem, ProductItem } from "@/types/types"
import { Button } from "@/components/ui/button"
import { Receipt } from "lucide-react"
import { createCheckoutSession } from "@/actions/stripe"

export default function Partner() {
  const { isSignedIn, user, isLoaded } = useUser()
  const [dbUser, setDbUser] = useState<UserItem>()
  const [myProducts, setMyProducts] = useState<ProductItem[]>()
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [loadingUser, setLoadingUser] = useState(false)

  const [page, setPage] = useState(1)

  useEffect(() => {
    const loadUserAndProducts = async () => {
      if (!user?.id) return

      setLoadingUser(true)
      try {
        const userRes = await axios.get(`/api/user?externalId=${user.id}`)
        const dbUser = userRes.data[0]
        setDbUser(dbUser)
        setLoadingUser(false)

        if (dbUser?.id && dbUser.role === "partner") {
          setLoadingProducts(true)
          try {
            const prodRes = await axios.get(
              `/api/product?role=${dbUser.role}&type=paid`
            )
            setMyProducts(prodRes.data)
            setPage(1)
          } catch {
            toast.error("Sorry! Can not load available Products")
          } finally {
            setLoadingProducts(false)
          }
        }
      } catch {
        toast.error("Failed to load user data")
        setLoadingUser(false)
      }
    }

    loadUserAndProducts()
  }, [user])

  const CARDS_PER_PAGE = 6
  const totalPages = Math.ceil((myProducts?.length ?? 0) / CARDS_PER_PAGE)
  const startIdx = (page - 1) * CARDS_PER_PAGE
  const currentProducts = myProducts?.slice(startIdx, startIdx + CARDS_PER_PAGE)

  const handlePurchase = async (productId: string) => {
    if (!dbUser) {
      toast.error("User data is not available")
      return
    }

    const result = await createCheckoutSession({ productId, userId: dbUser.id })

    if (result?.url) {
      // Redirect user to Stripe Checkout
      window.location.assign(result.url)
    } else {
      console.error(result?.error || "An unknown error occurred.")
      toast.error("Failed to create checkout session")
    }
  }

  if (!isLoaded || loadingUser) {
    return <div className="mt-8">Loading user data...</div>
  }

  if (loadingProducts) {
    return <div className="mt-8">Loading available Products ...</div>
  }

  if (!isSignedIn || !dbUser || dbUser.role !== "partner") {
    return (
      <main className="flex h-full flex-col items-center justify-start pt-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-600 to-gray-900">
        <div className="text-center mt-8">
          <p className="text-lg text-white mb-6">User is not authorized!</p>
        </div>
      </main>
    )
  }

  return (
    <section className="w-full max-w-7xl flex flex-col items-center justify-center">
      <div className="flex lg:flex-row lg:flex-wrap flex-col items-center justify-center gap-8 my-6">
        {(currentProducts ?? []).map((item) => (
          <div
            key={item.id}
            className="w-[380px] p-4 border rounded-lg shadow-md"
          >
            <div className="font-semibold">
              Product name: <span className="text-xl">{item.name}</span>
            </div>
            {item.description && (
              <div className=" text-gray-400 text-sm">
                Description: {item.description}
              </div>
            )}
            <br />

            <div>User type: {item.userType}</div>

            <div>Recurrence type: {item.recurrenceType}</div>
            {item.recurrenceType === "recurring" ? (
              <div>
                Monthly price:{" "}
                <span className="text-green-500">{item.priceRecurring}</span>{" "}
                EUR
              </div>
            ) : (
              <div>
                One-off price:{" "}
                <span className="text-green-500">{item.priceOneoff}</span> EUR
              </div>
            )}
            <br />
            <div className="flex flex-row gap-2">
              <div className="flex flex-row gap-4">
                <div className="w-[180px]">
                  Images limit: {item.limitImages}
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="w-[180px]">
                  Videos limit: {item.limitVideos}
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => handlePurchase(item.id)}
                className="mt-8 mb-4"
              >
                <Receipt />
                PURCHASE THIS PRODUCT
              </Button>
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
    </section>
  )
}

/*
try {
      const response = await axios.post(
        `/api/product-instances?userId=${dbUser.id}&productId=${productId}`
      )
      setProductInstance(response.data)
    } catch (error) {
      toast.error("Failed to create product instance")
      console.log("Error creating product instance:", error)
      return
    }

    // 2. Process the payment logic and get payment status
    // TBD
    setPaymentOk(true) // Simulating payment success for now

    // 3. If payment status OK - update the product instance status to "paid"
    if (paymentOk && productInstance) {
      try {
        const updatedInstance = await axios.patch(`/api/product-instances`, {
          userId: dbUser.id,
          productInstanceId: productInstance.id,
          status: "paid",
        })
        setProductInstance(updatedInstance.data)
        toast.success("Product purchased successfully!")
      } catch (error) {
        toast.error("Failed to update product instance status")
        console.log("Error updating product instance:", error)
      }
    }

    // 4. Navigate to admin page
    router.push("/admin")
*/
