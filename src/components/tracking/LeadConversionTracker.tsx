"use client";

import { useEffect } from "react";
import { pushDataLayerEvent } from "@/lib/tracking/gtm";
import { CONTENT_CATEGORY, fbEvent } from "@/lib/tracking/fpixel";

const SESSION_KEY_PREFIX = "dde_lead_submitted_";

export function LeadConversionTracker({
  universe,
}: {
  universe: "ceremonie" | "festif";
}) {
  useEffect(() => {
    const key = `${SESSION_KEY_PREFIX}${universe}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    pushDataLayerEvent(`${universe}_lead_submitted`);
    // Meta : la demande de devis (funnel profond) — le Lead Meta reste la
    // capture de contact du popup (ContactGateModal).
    fbEvent("SubmitApplication", {
      content_name: "Demande de devis",
      content_category: CONTENT_CATEGORY[universe],
    });
  }, [universe]);

  return null;
}
