// import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LocationEdit } from "lucide-react"

export default function Home() {
  return (
    <section className="max-w-7xl flex flex-col items-center justify-center">
      <p className="mx-auto text-7xl font-medium text-white pb-16">SEENDROP</p>
      <p className="mx-auto text-5xl font-medium text-white pb-16">
        USER-GENERATED CONTENT DEMO
      </p>
      <p className="w-[60%] text-2xl font-medium text-cyan-500 pb-16 text-center">
        Create your event or brand spot and personalize it for the interaction
        with your clients
      </p>
      <Button className="flex flex-row items-center justify-center gap-4">
        <LocationEdit />
        <p className="pr-2 text-lg">Create your event!</p>
      </Button>
      <div className="flex flex-col items-center justify-center gap-8"></div>
    </section>
  )
}
