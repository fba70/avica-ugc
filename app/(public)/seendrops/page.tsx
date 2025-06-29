import { Suspense } from "react"
import CreateSeenDrop from "@/components/blocks/create-seendrop"
import { LoaderCircle } from "lucide-react"

export default function SeenDrop() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <LoaderCircle className="animate-spin w-12 h-12 text-green-500" />
        </div>
      }
    >
      <CreateSeenDrop />
    </Suspense>
  )
}
