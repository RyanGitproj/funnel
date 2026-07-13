"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { fbEvent, flushPendingMetaEvents } from "@/lib/tracking/fpixel";

function MetaPixelPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const url = `${pathname}?${searchParams}`;
  // L'URL initiale est déjà comptée par le fbq('track','PageView') du script
  // d'init : on ne pousse qu'aux navigations SPA suivantes, en comparant la
  // dernière URL traitée (jamais de booléen « premier rendu » — les effects
  // se ré-exécutent en navigation SPA).
  const lastUrl = useRef(url);
  useEffect(() => {
    if (lastUrl.current === url) return;
    lastUrl.current = url;
    fbEvent("PageView");
  }, [url]);
  return null;
}

/** Ne jamais monter directement : passer par MetaPixelGate (consentement). */
export function MetaPixel({ pixelId }: { pixelId: string }) {
  // Le script inline (enfant, effect avant le parent) a déjà défini window.fbq
  // quand cet effect s'exécute : les événements mis en attente avant le
  // consentement (ex. Lead du popup) partent ici, après le PageView d'init.
  useEffect(() => {
    flushPendingMetaEvents();
  }, []);

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');`}
      </Script>
      {/* useSearchParams exige une frontière Suspense au build */}
      <Suspense fallback={null}>
        <MetaPixelPageViews />
      </Suspense>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
