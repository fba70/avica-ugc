"use client"

import { useRouter } from "next/navigation"
// import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LocationEdit, Image as SDImage } from "lucide-react"

export default function Home() {
  const router = useRouter()

  return (
    <section className="max-w-7xl flex flex-col items-center justify-center">
      <p className="mx-auto text-7xl font-medium text-white pb-16 mt-6 lg:mt-0">
        SEENDROP
      </p>
      <p className="mx-auto text-5xl font-medium text-white pb-16 text-center">
        USER-GENERATED CONTENT DEMO
      </p>

      <p className="lg:w-[60%] w-[80%] text-2xl font-medium text-cyan-500 pb-8 text-center">
        Create your event or brand spot and personalize it for the interaction
        with your clients
      </p>
      <Button
        className="flex flex-row items-center justify-center gap-4"
        onClick={() => router.push("/events")}
      >
        <LocationEdit />
        <p className="pr-2 text-lg">Create your event!</p>
      </Button>

      <p className="lg:w-[60%] w-[80%] text-2xl font-medium text-orange-500 pb-8 pt-16 text-center">
        Select the event and generate your SeenDrop!
      </p>
      <Button
        className="flex flex-row items-center justify-center gap-4"
        onClick={() => router.push("/events")}
      >
        <SDImage />
        <p className="pr-2 text-lg">Generate your SeenDrop!</p>
      </Button>
    </section>
  )
}
