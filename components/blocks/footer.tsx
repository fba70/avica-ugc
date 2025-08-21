import { Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
// import { File } from "lucide-react"

export default function Footer() {
  return (
    <footer className="row-start-4 flex flex-row gap-4 lg:gap-8 flex-wrap items-center justify-center bg-gray-900/70 py-2 px-4 rounded-xl mt-6 lg:mx-0 mx-10">
      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-white text-xs lg:text-sm"
        href="https://avica.cloud/impressum"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Globe />
        Impressum
      </Link>

      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-white text-xs lg:text-sm"
        href="https://avica.cloud/privacy"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Globe />
        Privacy
      </Link>

      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-white text-xs lg:text-sm"
        href="https://avica.cloud/terms"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Globe />
        Terms
      </Link>

      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-white text-xs lg:text-sm"
        href="https://avica.cloud/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="/Logo_AVICA.png"
          alt="AVICA logo"
          width={24}
          height={24}
          priority
        />
        AVICA
      </Link>

      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-white text-xs lg:text-sm"
        href="https://www.in4comgroup.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="/Logo_IN4COM.png"
          alt="AVICA logo"
          width={24}
          height={24}
          priority
        />
        IN4COM
      </Link>
    </footer>
  )
}
