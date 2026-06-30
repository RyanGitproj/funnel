"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { pushDataLayerEvent } from "@/lib/tracking/gtm";

type TrackedLinkProps = ComponentProps<typeof Link> & {
  event: string;
  eventParams?: Record<string, unknown>;
};

export function TrackedLink({
  event,
  eventParams,
  onClick,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        pushDataLayerEvent(event, eventParams);
        onClick?.(e);
      }}
    />
  );
}
