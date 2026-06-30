"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pushDataLayerEvent } from "@/lib/tracking/gtm";

export function RouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    pushDataLayerEvent("page_view", { page_path: pathname });
  }, [pathname]);

  return null;
}
