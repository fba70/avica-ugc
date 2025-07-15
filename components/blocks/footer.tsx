import { Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
// import { File } from "lucide-react"

export default function Footer() {
  return (
    <footer className="row-start-4 flex flex-row gap-6 flex-wrap items-center justify-center bg-gray-900/70 py-2 px-4 rounded-xl mt-6">
      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-white text-sm"
        href="https://avica.cloud/impressum"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Globe />
        Impressum
      </Link>

      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-white text-sm"
        href="https://avica.cloud/privacy"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Globe />
        Privacy policy
      </Link>

      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-white text-sm"
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
        Company
      </Link>
    </footer>
  )
}
