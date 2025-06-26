import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Header from "@/components/blocks/header"
import Footer from "@/components/blocks/footer"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
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
  title: "UGC DEMO APP",
  description: "Generate your UGC with AI interacting with brands and events!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased grid grid-rows-[240px_1fr_80px] lg:grid-rows-[120px_1fr_80px] items-center justify-items-center min-h-screen gap-4 bg-[url(/BG_6.jpg)] bg-cover bg-no-repeat bg-center`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />

          <section className="row-start-1">
            <Header />
          </section>

          <section className="row-start-2">{children}</section>

          <section className="row-start-3">
            <Footer />
          </section>
        </ThemeProvider>
      </body>
    </html>
  )
}
