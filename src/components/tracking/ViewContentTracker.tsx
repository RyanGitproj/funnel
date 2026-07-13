"use client";

import { useEffect } from "react";
import {
  CONTENT_CATEGORY,
  fbEvent,
  type UniverseCategoryKey,
} from "@/lib/tracking/fpixel";

/** ViewContent Meta des pages d'offre (/ceremonie, /festif). */
export function ViewContentTracker({
  universe,
  contentName,
}: {
  universe: UniverseCategoryKey;
  contentName: string;
}) {
  useEffect(() => {
    fbEvent("ViewContent", {
      content_name: contentName,
      content_category: CONTENT_CATEGORY[universe],
    });
  }, [universe, contentName]);

  return null;
}
