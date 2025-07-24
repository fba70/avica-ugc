import arcjet, { shield } from "@arcjet/next"
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export const config = {
  // See https://clerk.com/docs/references/nextjs/clerk-middleware
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    // Protect against common attacks with Arcjet Shield
    shield({
      mode: "LIVE",
    }),
  ],
})

const isProtectedRoute = createRouteMatcher(["/api/private"])

// Arcjet runs first to protect all routes defined in the matcher config above.
// Then if the request is allowed, Clerk runs
export default clerkMiddleware(async (auth, req) => {
  const decision = await aj.protect(req)

  if (decision.isDenied()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  return NextResponse.next()
})

/*
import { clerkMiddleware } from "@clerk/nextjs/server"

export default clerkMiddleware()

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
*/
