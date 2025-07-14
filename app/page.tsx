"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Image as SDImage } from "lucide-react"

// import Image from "next/image"

export default function Home() {
  const router = useRouter()

  return (
    <section className="max-w-7xl flex flex-col items-center justify-center gap-8 mt-16 px-6">
      <p className="mx-auto lg:text-7xl text-5xl font-medium text-white lg:pb-12 pb-6 px-6 text-center">
        <span className="text-orange-600">AVICA</span> MYFLIX
      </p>

      <p className="mx-auto lg:text-4xl text-2xl font-medium text-white lg:pb-10 pb-6 px-6 text-center">
        The Next-Gen Social & Brand Engagement Ecosystem
      </p>

      <p className="mx-auto lg:text-3xl text-xl font-medium text-white lg:pb-6 pb-6 lg:w-[70%] w-[90%] text-center">
        Revolutionizing social interaction through short stories with user
        avatars and brand digital twins as actors
      </p>

      <Button
        className="flex flex-row items-center justify-center gap-4 w-[300px]"
        onClick={() => router.push("/events")}
      >
        <SDImage />
        <p className="pr-2 text-lg">Generate your SeenDrop!</p>
      </Button>

      <div className="flex flex-row items-center justify-center gap-8 flex-wrap mt-6">
        <div className="relative h-[400px] w-[400px] border border-white group cursor-pointer">
          <Image
            src={"/Card_1.png"}
            fill
            alt="SeenDrop image"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
            <span className="text-white text-4xl font-bold">Personalized</span>
          </div>
        </div>
        <div className="relative h-[400px] w-[400px] border border-white group cursor-pointer">
          <Image
            src={"/Card_2.png"}
            fill
            alt="SeenDrop image"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
            <span className="text-white text-4xl font-bold">Engaging</span>
          </div>
        </div>
        <div className="relative h-[400px] w-[400px] border border-white group cursor-pointer">
          <Image
            src={"/Card_3.png"}
            fill
            alt="SeenDrop image"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
            <span className="text-white text-4xl font-bold">Interaction</span>
          </div>
        </div>
        <div className="relative h-[400px] w-[400px] border border-white group cursor-pointer">
          <Image
            src={"/Card_4.png"}
            fill
            alt="SeenDrop image"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
            <span className="text-white text-4xl font-bold">Gen AI</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/*
<div className="relative h-[400px] w-[400px] border border-white">
          <Image
            src={"/Card_1.png"}
            fill
            alt="SeenDrop image"
            className="object-cover object-center"
          />
        </div>
*/
