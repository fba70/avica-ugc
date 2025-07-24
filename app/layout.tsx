import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Header from "@/components/blocks/header"
import Footer from "@/components/blocks/footer"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs"
import { Suspense } from "react"
import { dark } from "@clerk/themes"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "AVICA SPARKBITS DEMO APP",
  description: "Generate your UGC with AI interacting with brands and events!",
}

// metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"),

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased grid grid-rows-[240px_1fr_80px] lg:grid-rows-[120px_1fr_80px] items-center justify-items-center min-h-screen gap-4 bg-[url(/BG_1.jpg)] bg-cover bg-no-repeat bg-center`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster position="top-right" />

            <section className="row-start-1">
              <Suspense fallback={<div>Loading...</div>}>
                <Header />
              </Suspense>
            </section>

            <section className="row-start-2 self-start">{children}</section>

            <section className="row-start-3">
              <Footer />
            </section>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
