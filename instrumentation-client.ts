import { initBotId } from "botid/client/core"

// Define the paths that need bot protection:
// - API endpoints (e.g., '/api/checkout')
// - Server actions invoked from a page (e.g., '/dashboard')
// - Dynamic routes (e.g., '/api/create/*')
// Wildcards can be used to expand multiple segments
// /team/*/activate will match
// /team/a/activate
// /team/a/b/activate
// /team/a/b/c/activate
// ...

initBotId({
  protect: [
    {
      path: "/api/events",
      method: "POST",
    },
    {
      path: "/api/image-gen",
      method: "POST",
    },
    {
      path: "/api/video-gen",
      method: "POST",
    },
    {
      path: "/api/user",
      method: "POST",
    },
    {
      path: "/api/seendrops",
      method: "POST",
    },
    {
      path: "/api/seendrops/*",
      method: "POST",
    },
  ],
})
