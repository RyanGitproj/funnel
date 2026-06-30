"use client";

import { useEffect } from "react";
import { pushDataLayerEvent } from "@/lib/tracking/gtm";

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
  }, [universe]);

  return null;
}
