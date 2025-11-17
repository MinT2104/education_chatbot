import { useState, useEffect } from "react";
import { getCookie, setCookie } from "@/core/utils/cookie";

export type CookieConsentType = "accepted" | "rejected" | null;

const COOKIE_CONSENT_NAME = "cookie_consent";
const COOKIE_CONSENT_EXPIRY_DAYS = 365; // Store consent for 1 year

export const useCookieConsent = () => {
  const [consent, setConsent] = useState<CookieConsentType>(null);
  const [showBanner, setShowBanner] = useState(false);

  // Load consent from cookie on mount
  useEffect(() => {
    const storedConsent = getCookie(COOKIE_CONSENT_NAME);
    if (storedConsent === "accepted" || storedConsent === "rejected") {
      setConsent(storedConsent as CookieConsentType);
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    setCookie(COOKIE_CONSENT_NAME, "accepted", {
      expires: COOKIE_CONSENT_EXPIRY_DAYS,
      path: "/",
      sameSite: "lax",
    });
    setConsent("accepted");
    setShowBanner(false);
  };

  const rejectNonEssential = () => {
    setCookie(COOKIE_CONSENT_NAME, "rejected", {
      expires: COOKIE_CONSENT_EXPIRY_DAYS,
      path: "/",
      sameSite: "lax",
    });
    setConsent("rejected");
    setShowBanner(false);
  };

  const hasConsent = consent === "accepted";
  const hasRejected = consent === "rejected";

  return {
    consent,
    hasConsent,
    hasRejected,
    showBanner,
    acceptAll,
    rejectNonEssential,
  };
};


