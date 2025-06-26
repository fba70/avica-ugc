import { Globe } from "lucide-react"
import { File } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="row-start-4 flex flex-row gap-6 flex-wrap items-center justify-center bg-gray-900/70 pt-2 pb-2 pl-4 pr-4 rounded-xl">
      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-white"
        href="/PrivacyPolicy.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        <File />
        Privacy policy
      </Link>

      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-white"
        href="https://www.seendrop.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Globe />
        Company
      </Link>
    </footer>
  )
}
