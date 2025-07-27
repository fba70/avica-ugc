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
  title: "SPARKBITS",
  description: "Generate your UGC with AI interacting with brands and events!",
  authors: [{ name: "IN4COM GmbH", url: "https://www.in4comgroup.com" }],
  keywords: ["UGC", "AI", "marketing", "brands", "events", "content creation"],
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

/*
export const metadata: Metadata = {
  // Basic Metadata
  title: 'SPARKBITS',
  description: 'Generate your UGC with AI interacting with brands and events!',
  metadataBase: new URL('https://www.sparkbits.com'), // Base URL for absolute URLs
  // Viewport for responsive design
  viewport: {
    width: 'device-width',
    initialScale: 1.0,
  },
  // Author
  authors: [{ name: 'Your Name or Team', url: 'https://www.sparkbits.com/about' }],
  // Keywords (optional, less impactful for SEO)
  keywords: ['UGC', 'AI', 'brands', 'events', 'content creation'],
  // Robots (control search engine indexing)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Open Graph (for social media sharing)
  openGraph: {
    title: 'SPARKBITS',
    description: 'Generate your UGC with AI interacting with brands and events!',
    url: 'https://www.sparkbits.com',
    siteName: 'SPARKBITS',
    images: [
      {
        url: '/og-image.jpg', // Path to image in /public or absolute URL
        width: 1200,
        height: 630,
        alt: 'SPARKBITS Preview Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'SPARKBITS',
    description: 'Generate your UGC with AI interacting with brands and events!',
    images: ['/twitter-image.jpg'], // Path to image in /public or absolute URL
    creator: '@sparkbits', // Optional: Twitter handle
  },
  // Favicon and Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  // Theme Color (for mobile browser UI)
  themeColor: '#ffffff',
  // Language (optional, can also be set in <html lang="en">)
  alternates: {
    languages: {
      'en-US': '/en-US',
    },
  },
};
*/
