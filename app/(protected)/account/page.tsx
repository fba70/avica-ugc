import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LoginButton } from "@/components/auth/login-button"
//import banner from "@/public/AVICA_logo.png"
import banner from "@/public/Logo_SeenDrop.png"

export default function Account() {
  return (
    <>
      <main className="flex h-full flex-col items-center justify-start pt-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-600 to-gray-900">
        <div className="text-center">
          <div className="w-full flex flex-row gap-x-3 items-center justify-center">
            <Image
              src={banner}
              alt="banner"
              width={200}
              height={200}
              className="rounded-xl border-0 border-white shadow-xl bg-white p-4"
              priority
            />
          </div>

          <div className="mt-12">
            <LoginButton mode="modal" asChild>
              <Button size="lg">Sign in / Sign up</Button>
            </LoginButton>
          </div>
        </div>
      </main>
    </>
  )
}
