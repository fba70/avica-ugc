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
    <section className="max-w-7xl flex flex-col items-center justify-center gap-8 lg:mt-16 mt-6">
      <div className="lg:w-full w-[95%]">
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

      <div className="flex lg:flex-row flex-col items-center justify-center gap-12 mb-12">
        <div className="flex flex-col items-center justify-between w-[400px] h-[460px] bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 p-6 rounded-lg">
          <p className="mx-auto text-2xl font-medium text-white text-center">
            Revolutionizing social interaction through short stories with user
            avatars and brand digital twins as interacting actors. Generate
            personalized engaging content automatically for your sport events,
            music concerts, city cultural program, gaming tournaments and more
          </p>

          <Button
            className="flex flex-row items-center justify-center gap-4 w-[300px]"
            onClick={() => router.push("/events")}
          >
            <SDImage />
            <p className="pr-2 text-lg">Generate first SPARKBIT</p>
          </Button>
        </div>

        <div className="flex flex-col items-center justify-between gap-8 w-[400px] h-[460px] bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 p-6 rounded-lg">
          <p className="mx-auto text-2xl font-medium text-white text-center">
            Marketing agency, Event organizer, Brand owner? We offer the
            platform for you to facilitate the creation of the fun, engaging and
            personalized user-generated images and short videos for your events
            and campaigns using generative AI and{" "}
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
              <p className="pr-2 text-lg">Become a partner!</p>
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-12 mt-6">
        <div className="flex lg:flex-row flex-col items-center justify-center lg:gap-16 gap-6">
          <div className="relative h-[400px] w-[400px] border border-white group cursor-pointer">
            <Image
              src={"/HP_1.jpg"}
              fill
              alt="AVICA image"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
              <span className="text-white text-4xl font-bold">
                Personalized
              </span>
            </div>
          </div>
          <div className="flex flex-col items-left justify-start gap-6 h-[400px] w-[400px] pt-4 ml-4 lg:ml-0">
            <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Social media clicks do not work
            </p>
            <p className="text-lg text-white">
              Social media feeds are a passive and boring experiences. We scroll
              endlessly through content that rarely feels personal or truly
              engaging. For brands and event organizers, cutting through the
              noise to create a lasting impact is harder than ever.
            </p>
            <p className="text-lg text-white">
              User-generated content is mostly generic and disconnected from the
              brand narratives
            </p>
          </div>
        </div>

        <div className="flex lg:flex-row-reverse flex-col items-center justify-center lg:gap-16 gap-6 ">
          <div className="relative h-[400px] w-[400px] border border-white group cursor-pointer">
            <Image
              src={"/HP_2.jpg"}
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
          <div className="flex flex-col items-left justify-start gap-6 h-[400px] w-[400px] pt-4">
            <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Step into the story
            </p>
            <p className="text-lg text-white">
              We are revolutionizing social interaction allowing user generated
              content created as a result of interaction between the brand and
              the user. Our platform transforms your social presence from
              passive consumption to active creation.
            </p>
            <p className="text-lg text-white">
              For brands and event organizers, this means a new era of
              user-personalized and brand-driven storytelling that forges deep
              and meaningful connections with your audience
            </p>
          </div>
        </div>

        <div className="flex lg:flex-row flex-col items-center justify-center lg:gap-16 gap-6">
          <div className="relative h-[400px] w-[400px] border border-white group cursor-pointer">
            <Image
              src={"/HP_3.jpg"}
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
          <div className="flex flex-col items-left justify-start gap-6 h-[400px] w-[400px] pt-4">
            <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              AVICA SPARKBITS magic
            </p>
            <p className="text-lg text-white">
              Create your event digital twin with brand or event styling in 10
              minutes.
            </p>
            <p className="text-lg text-white">
              Test your SPARKBITS and finetune settings for graphical and video
              content.
            </p>
            <p className="text-lg text-white">
              Share the landing page to your audience and let them create their
              own SPARKBITS with their selfies or avatars automatically put into
              the context of your event or brand.
            </p>
            <p className="text-lg text-white">
              Monitor your statistics in real-time
            </p>
          </div>
        </div>

        <div className="flex lg:flex-row-reverse flex-col items-center justify-center lg:gap-16 gap-6">
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
          <div className="flex flex-col items-left justify-start gap-6 h-[400px] w-[400px] pt-4">
            <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              AVICA storytelling engine
            </p>
            <p className="text-lg text-white">
              AVICA engine enable storytelling capabilities which are not
              achievable via publicly available generative AI tools.
            </p>
            <p className="text-lg text-white">
              We allow you to control every single element of the content
              independently such as dynamic styling, automated translation of
              the text, audio tracks generation, custom intro- and outro clips
              and much more
            </p>
          </div>
        </div>

        <div className="flex lg:flex-row flex-col items-center justify-center lg:gap-16 gap-6">
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
          <div className="flex flex-col items-left justify-start gap-6 h-[400px] w-[400px] pt-4">
            <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Business model
            </p>
            <p className="text-lg text-white">
              We offer subscription- or pay-as-you-go pricing models for
              partners for standard SPARKBITS available for free for your users.
            </p>
            <p className="text-lg text-white">
              We also offer the model to work with premium content, such as
              longer videos, complex storytelling templates and so on, so that
              you can monetize it with your clients within the revenue sharing
              model.
            </p>
            <p className="text-lg text-white">
              We also offer white label solutions for you
            </p>
          </div>
        </div>

        <div className="flex lg:flex-row-reverse flex-col items-center justify-center lg:gap-16 gap-6">
          <div className="relative h-[400px] w-[400px] border border-white group cursor-pointer">
            <Image
              src={"/HP_5.jpg"}
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
          <div className="flex flex-col items-left justify-start gap-6 h-[400px] w-[400px] pt-4">
            <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Tailored solutions
            </p>
            <p className="text-lg text-white">
              Start with simple out of the box functionality to engage with your
              audience immediately.
            </p>
            <p className="text-lg text-white">
              Get in touch with us when you want to build a more complex
              solution tailored to your specific events or brand needs. Or maybe
              you want to track the effectiveness of the content in social media
              - let us talk how to integrate that
            </p>
            <p className="text-lg text-white">
              We also offer white label solutions for you
            </p>
          </div>
        </div>
      </div>

      <p className="mx-auto lg:text-3xl text-xl font-medium text-white lg:pb-6 pb-6 lg:w-[70%] w-[90%] text-center lg:mt-10 mt-6">
        Interested? Have questions? Check content examples created on our AVICA
        SPARKBITS platform!
      </p>

      <Button
        className="flex flex-row items-center justify-center gap-4 w-[300px] mb-12"
        onClick={() => router.push("/events")}
      >
        <SDImage />
        <p className="pr-2 text-lg">SPARKBITS examples</p>
      </Button>
    </section>
  )
}
