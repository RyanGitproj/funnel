"use client";

import type { AnchorHTMLAttributes } from "react";
import { pushDataLayerEvent } from "@/lib/tracking/gtm";

type ContactLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export function PhoneLink({ onClick, ...props }: ContactLinkProps) {
  return (
    <a
      {...props}
      href="tel:+33788808194"
      onClick={(e) => {
        pushDataLayerEvent("contact_phone_click");
        onClick?.(e);
      }}
    />
  );
}

export function EmailLink({ onClick, ...props }: ContactLinkProps) {
  return (
    <a
      {...props}
      href="mailto:contact@domainedeselegances.fr"
      onClick={(e) => {
        pushDataLayerEvent("contact_email_click");
        onClick?.(e);
      }}
    />
  );
}
