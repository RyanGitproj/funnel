"use client";

import { useEffect } from "react";
import { MetaPixel } from "@/components/tracking/MetaPixel";
import { useConsentChoice } from "@/lib/tracking/consent";
import { clearPendingMetaEvents } from "@/lib/tracking/fpixel";

/**
 * Ne monte le Meta Pixel qu'après consentement (même exigence CNIL que GTM) :
 * sans accord, ni fbevents ni le pixel noscript ne sont rendus, et les appels
 * fbEvent des pages restent en attente locale (window.fbq absent).
 */
export function MetaPixelGate() {
  const consent = useConsentChoice();
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  useEffect(() => {
    if (consent === "denied") clearPendingMetaEvents();
  }, [consent]);

  if (!pixelId || consent !== "granted") return null;
  return <MetaPixel pixelId={pixelId} />;
}
