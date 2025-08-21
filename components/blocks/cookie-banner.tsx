"use client"

import { useEffect, useState } from "react"
import { useCookie } from "@/hooks/use-cookie"

export const CookieConsentBanner = () => {
  // Provide a default object for when the cookie doesn't exist yet (It will also be used for the type definition)
  const defaultConsent = { consent: false, marketing: false }

  const [consentCookieValue, setConsentCookieValue, removeCookieConsent] =
    useCookie("consent_cookie", defaultConsent, {
      days: 365,
      sameSite: "lax",
      secure: true,
    })

  // domain: "sparkbits.ai",

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // If the user already consented, hide the banner

  if (isClient && consentCookieValue.consent === true) {
    return <></>
  }

  return (
    <div className="fixed bottom-0 bg-neutral-600 rounded-xl p-4">
      <p className="text-neutral-200">
        We use cookies to enhance user experience. Please accept the option you
        prefer
      </p>
      <div className="mt-2 flex gap-2 justify-center">
        <button
          type="button"
          onClick={() => {
            setConsentCookieValue({ consent: true, marketing: true })
          }}
          className="px-4 py-2 border-b-blue-300 border-1 bg-neutral-600 dark:text-neutral-50 text-neutral-200 rounded-md hover:bg-neutral-400/40"
        >
          Accept All
        </button>
        <button
          type="button"
          onClick={() => {
            setConsentCookieValue({ consent: true, marketing: false })
          }}
          className="px-4 py-2 border-b-blue-300 border-1 bg-neutral-600 dark:text-neutral-50 text-neutral-200 rounded-md hover:bg-neutral-400/40"
        >
          Accept Necessary Only
        </button>
        <button
          type="button"
          onClick={removeCookieConsent}
          className="px-4 py-2 border-b-blue-300 border-1 bg-neutral-600 dark:text-neutral-50 text-neutral-200 rounded-md hover:bg-neutral-400/40"
        >
          Decline
        </button>
      </div>
    </div>
  )
}

export default CookieConsentBanner
