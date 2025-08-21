"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Image as SDImage } from "lucide-react"
import ReactPlayer from "react-player"
import { CookieConsentBanner } from "@/components/blocks/cookie-banner"

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
        <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent ml-2">
          SPARKBITS
        </span>
      </p>

      <p className="mx-auto lg:text-4xl text-2xl font-medium text-white lg:pb-10 pb-6 px-6 text-center">
        The Next-Gen Social & Brand Engagement Ecosystem
      </p>

      <div className="flex lg:flex-row flex-col items-center justify-center lg:gap-24 gap-6">
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
            <p className="pr-2 text-lg">GENERATE FIRST SPARKBIT</p>
          </Button>
        </div>

        <div className="flex flex-col items-center justify-between gap-8 w-[400px] h-[460px] bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 p-6 rounded-lg">
          <p className="mx-auto text-2xl font-medium text-white text-center">
            Marketing agency, Event organizer, Brand owner? We offer you the
            platform to facilitate the creation of the personalized, engaging
            and fun user-generated images and short videos for your events and
            campaigns using generative AI and{" "}
            <span className="text-orange-400">AVICA</span> storytelling engine
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
              <p className="pr-2 text-lg">BECOME A PARTNER</p>
            </Button>
          </Link>
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 mt-12 mb-12" />

      <div className="flex flex-col items-center justify-center gap-12">
        <div className="flex lg:flex-row flex-col items-center justify-center lg:gap-24 gap-6">
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

        <div className="flex lg:flex-row-reverse flex-col items-center justify-center lg:gap-24 gap-6 ">
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

        <div className="flex lg:flex-row flex-col items-center justify-center lg:gap-24 gap-6">
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
              SPARKBITS magic
            </p>
            <p className="text-lg text-white">
              Create your event digital twin with brand styling in just 10
              minutes.
            </p>
            <p className="text-lg text-white">
              Test your SPARKBITS and finetune settings for graphical and video
              content.
            </p>
            <p className="text-lg text-white">
              Share the landing page to your audience and let them create their
              own SPARKBITS with their selfies or avatars automatically.
              SPARKBITS magic will put them into the context of your event or
              brand
            </p>
          </div>
        </div>

        <div className="flex lg:flex-row-reverse flex-col items-center justify-center lg:gap-24 gap-6">
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
              AVICA content generation engine enables automated storytelling
              capabilities which are not achievable via publicly available
              generative AI tools.
            </p>
            <p className="text-lg text-white">
              We allow you to control every single element of the content such
              as dynamic styling, automated translation of the text, audio
              tracks generation, custom intro- and outro clips and much more
            </p>
          </div>
        </div>

        <div className="flex lg:flex-row flex-col items-center justify-center lg:gap-24 gap-6">
          <div className="relative h-[400px] w-[400px] border border-white group cursor-pointer">
            <Image
              src={"/HP_6.jpg"}
              fill
              alt="AVICA image"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
              <span className="text-white text-4xl font-bold">
                All billing models
              </span>
            </div>
          </div>
          <div className="flex flex-col items-left justify-start gap-6 h-[400px] w-[400px] pt-4">
            <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Business model that fits
            </p>
            <p className="text-lg text-white">
              We offer subscription- or pay-as-you-go pricing models for
              partners for standard SPARKBITS available for free for your users.
            </p>
            <p className="text-lg text-white">
              We also offer business model to work with premium content, such as
              longer videos, complex storytelling templates and so on, so that
              you can monetize it with your clients within the revenue sharing
              model.
            </p>
            <p className="text-lg text-white">
              Finally, we offer white label solutions for you
            </p>
          </div>
        </div>

        <div className="flex lg:flex-row-reverse flex-col items-center justify-center lg:gap-24 gap-6">
          <div className="relative h-[400px] w-[400px] border border-white group cursor-pointer">
            <Image
              src={"/HP_5.jpg"}
              fill
              alt="AVICA image"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
              <span className="text-white text-4xl font-bold">
                Tailored solutions
              </span>
            </div>
          </div>
          <div className="flex flex-col items-left justify-start gap-6 h-[400px] w-[400px] pt-4">
            <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Tailored solutions
            </p>
            <p className="text-lg text-white">
              Start with simple out of the box functionality to engage with your
              audience immediately. Get your usage statistics specific to your
              event and content type in partner dashboard.
            </p>
            <p className="text-lg text-white">
              Get in touch with us when you want to build a more complex
              solution tailored to your specific events or brand needs
            </p>
            <p className="text-lg text-white">
              We also offer white label solutions for you
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 mt-12 mb-12" />

      <p className="mx-auto lg:text-3xl text-xl font-medium text-white lg:pb-6 pb-6 lg:w-[70%] w-[90%] text-center">
        Interested? Have questions? Check content examples created on our{" "}
        <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent ml-2">
          SPARKBITS
        </span>{" "}
        platform. You can sign up and create your own{" "}
        <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent ml-2">
          SPARKBITS
        </span>{" "}
        in your account. Get in touch with us to become a partner and start
        using the platform!
      </p>

      <Button
        className="flex flex-row items-center justify-center gap-4 w-[300px]"
        onClick={() => router.push("/events")}
      >
        <SDImage />
        <p className="pr-2 text-lg">SPARKBITS EXAMPLES</p>
      </Button>

      <Separator className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 mt-12 mb-12" />

      <p className="mx-auto lg:text-3xl text-xl font-medium text-white lg:pb-6 pb-6 lg:w-[70%] w-[90%] text-center">
        FAQ
      </p>

      <Accordion
        type="single"
        collapsible
        className="w-[80%] mb-12"
        defaultValue="item-0"
      >
        <AccordionItem value="item-0">
          <AccordionTrigger className="text-2xl text-orange-600 w-full">
            Is this a commercial platform or a demo?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p className="text-lg text-white w-full">
              This is a demo version of the platform SPARKBITS which illustrates
              main product features and capabilities.
            </p>
            <p className="text-lg text-white w-full">
              Interested partners can register and create their events and allow
              co0ntent creation within the free demo package.
            </p>
            <p className="text-lg text-white w-full">
              We are looking for pilot projects with interested partners to
              address their specific needs and use cases and make our product
              better! Please get in touch with us with your ideas and
              requirements.
            </p>
            <p className="text-lg text-white w-full">
              We are working to launch commercial version of the platform during
              the fall of 2025. Stay tuned!
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-2xl text-orange-600 w-full">
            What kind of events can be configured?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p className="text-lg text-white w-full">
              The only limit is your imagination! It can be anything from sport
              events, to music concerts, city cultural spots, entertainment and
              gaming events, brand campaigns, product promotions and so on.
              Important only is that event needs to be the place with which user
              can interact with so that system can put the user virtually into
              the context of this event using the AVICA SPARKBITS magic.
            </p>
            <p className="text-lg text-white w-full">
              For example for sport event it can be the sport arena where the
              user can play the game with the team, or for music event it can be
              the stage where the user can play with musicians and so on.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-2xl text-orange-600 w-full">
            What do I need to configure my event?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p className="text-lg text-white w-full">
              You need to specify the name of the event, short description,
              event or brand logo and image that will be used as graphical
              context (digital avatar) of the event by generative AI. You also
              need to define the prompt for generative AI to drive the
              storytelling part of the image and video generation. You can also
              specify some styling parameters for the event and landing page.
            </p>
            <p className="text-lg text-white w-full">
              Normally it will take only 5-10 minutes to configure your event.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-2xl text-orange-600 w-full">
            What kind of content is generated?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p className="text-lg text-white w-full">
              SPARKBITS can be either images or short videos with branded
              overlay and user personalization.
            </p>
            <p className="text-lg text-white w-full">
              We offer standard layout and presonalization options but can
              provide custom solutions for you.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-2xl text-orange-600 w-full">
            How end-users can generate their SPARKBITS?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p className="text-lg text-white w-full">
              Once partner creates the event it is available as landing page
              with specific URL. QR code is generated automatically which can be
              used to scan by users vising your real or virtual events.
            </p>
            <p className="text-lg text-white w-full">
              End-users can visit it, see the event description and examples of
              the content generated by other users, register and generate the
              content for themselves by specifying their user name and image
              uploading it or making selfie using the smartphone camera. It
              takes just few seconds to generate the image or video.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger className="text-2xl text-orange-600 w-full">
            Is there premium type of the content?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p className="text-lg text-white w-full">
              Yes, we offer premium content options such as: higher resolution
              images, longer videos, videos enhanced with AVICA storytelling
              engine, content personalization options such as automated text
              translation into different languages, audio tracks generation,
              custom intro- and outro-tracks and so on.
            </p>
            <p className="text-lg text-white w-full">
              It is not available in demo examples. Get in touch with us to
              discuss your specific needs and we will provide custom tailored
              solution for you.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger className="text-2xl text-orange-600 w-full">
            Can I control the way the content is generated?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p className="text-lg text-white w-full">
              Yes, you have full control over the sources and prompts for image
              and video content generation.
            </p>
            <p className="text-lg text-white w-full">
              You can select appropriate reference image for the event context
              and fully configure the generative AI prompts which will drive the
              storytelling part of image and video content generation. We offer
              templates which help to configure it.
            </p>
            <p className="text-lg text-white w-full">
              You might need several iterations to make test generations and
              fine tune your event content and prompts to achieve better
              outcome.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-7">
          <AccordionTrigger className="text-2xl text-orange-600 w-full">
            What is the subscription model?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p className="text-lg text-white w-full">
              Subscription model is based on number of SPARKBITS generated per
              month including certain number of images and short videos. It is
              recommendede if you plan to use the platform frequently.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-8">
          <AccordionTrigger className="text-2xl text-orange-600 w-full">
            What is the pay-as-you-go model?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p className="text-lg text-white w-full">
              In this model you pay only for the SPARKBITS you generate without
              any subscription commitment. It is recommended for trial purposes
              or if your operations are not regular in terms of content
              generation workflows.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-9">
          <AccordionTrigger className="text-2xl text-orange-600 w-full">
            Is there a model when users pay for the premium content?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p className="text-lg text-white w-full">
              Yes, we offer options for the users to purchase premium content
              and offer partners revenue sharing opportunities in this case.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-10">
          <AccordionTrigger className="text-2xl text-orange-600 w-full">
            I still don{"'"}t understand how it works ...
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p className="text-lg text-white w-full">
              Take a look at examples of the EVENTS and SPARKBITS we offer.
              Generate test content for predefined example events. If you are
              still not sure we recommend getting in touch with us to clarify
              details and offer you the solution which fits your specific needs.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-11">
          <AccordionTrigger className="text-2xl text-orange-600 w-full">
            How to subscribe as a B2B partner?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p className="text-lg text-white w-full">
              You can register in a system providing your email address and
              selecting partner type of the account. Every new partner account
              gets free trial product with 25 images and 5 video SPARKBITS.
            </p>
            <p className="text-lg text-white w-full">
              Get in touch with us to let us know your interest or explore
              premium options of the platform.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-12">
          <AccordionTrigger className="text-2xl text-orange-600 w-full">
            What is SPARKBITS, AVICA and IN4COM?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p className="text-lg text-white w-full">
              SPARKBITS is a digital content generation tool that leverages AI
              to create engaging multimedia content as a result of users
              interacting with brands, products or events.
            </p>
            <p className="text-lg text-white w-full">
              AVICA is a digital content generation automation platform which
              enables complex storytelling scenarios for digital content
              generation using AVICA storytelling templates at scale and with
              low cost. AVICA is an engine when generative AI is not enough to
              manage the creative process.
            </p>
            <p className="text-lg text-white w-full">
              IN4COM GmbH is the Austrian company which develops and supports
              SPARKBITS and AVICA platforms.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <CookieConsentBanner />
    </section>
  )
}
