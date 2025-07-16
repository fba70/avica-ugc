"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Image as SDImage } from "lucide-react"
import ReactPlayer from "react-player"

export default function Home() {
  const router = useRouter()

  return (
    <section className="max-w-7xl flex flex-col items-center justify-center gap-8 mt-16">
      <div className="w-full aspect-video">
        <ReactPlayer
          src="https://youtu.be/W-wz7uvLs20?si=wW8iCPtXLbqEoCYT"
          playing={true}
          muted={true}
          controls={true}
          loop={true}
          width="100%"
          height="98%"
          style={{
            background: "transparent",
            aspectRatio: "16/9",
          }}
        />
      </div>

      <p className="mx-auto lg:text-7xl text-5xl font-medium text-white lg:pb-12 pb-6 px-6 text-center">
        <span className="text-orange-600">AVICA</span>{" "}
        <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent ml-2">
          SPARKBITS
        </span>
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
        <p className="pr-2 text-lg">Generate your SPARKBIT</p>
      </Button>

      <p className="mx-auto lg:text-3xl text-xl font-medium text-white lg:pb-6 pb-6 lg:w-[70%] w-[90%] text-center">
        Event organizers and brands can easily facilitate the creation of the
        fun, engaging and personalized user-generated images and short videos
        for events and campaigns using generative AI and{" "}
        <span className="text-orange-600">AVICA</span> storytelling engine
      </p>

      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-white text-sm"
        href="https://avica.cloud/contactform"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button className="flex flex-row items-center justify-center gap-4 w-[300px]">
          <Image
            src="/Logo_AVICA.png"
            alt="AVICA logo"
            width={24}
            height={24}
            priority
          />
          <p className="pr-2 text-lg">Contact AVICA Team</p>
        </Button>
      </Link>

      <div className="flex flex-row items-center justify-center gap-8 flex-wrap mt-6">
        <div className="relative h-[400px] w-[400px] border border-white group cursor-pointer">
          <Image
            src={"/HP_1.jpg"}
            fill
            alt="AVICA image"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
            <span className="text-white text-4xl font-bold">Personalized</span>
          </div>
        </div>
        <div className="relative h-[400px] w-[400px] border border-white group cursor-pointer">
          <Image
            src={"/HP_2.jpg"}
            fill
            alt="AVICA image"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
            <span className="text-white text-4xl font-bold">
              Engaging and Fun
            </span>
          </div>
        </div>
        <div className="relative h-[400px] w-[400px] border border-white group cursor-pointer">
          <Image
            src={"/HP_3.jpg"}
            fill
            alt="AVICA image"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
            <span className="text-white text-4xl font-bold">
              Brand interaction
            </span>
          </div>
        </div>
        <div className="relative h-[400px] w-[400px] border border-white group cursor-pointer">
          <Image
            src={"/HP_4.jpg"}
            fill
            alt="AVICA image"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
            <span className="text-white text-4xl font-bold">
              AVICA storytelling
            </span>
          </div>
        </div>
        <div className="relative h-[400px] w-[400px] border border-white group cursor-pointer">
          <Image
            src={"/HP_5.jpg"}
            fill
            alt="AVICA image"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
            <span className="text-white text-4xl font-bold">Generative AI</span>
          </div>
        </div>
        <div className="relative h-[400px] w-[400px] border border-white group cursor-pointer">
          <Image
            src={"/HP_6.jpg"}
            fill
            alt="AVICA image"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
            <span className="text-white text-4xl font-bold">
              Self-care setup
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
