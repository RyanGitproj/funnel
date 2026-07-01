"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Script from "next/script";

type ConsentChoice = "granted" | "denied";

const STORAGE_KEY = "cookie_consent";
const CONSENT_EVENT = "cookie-consent-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CONSENT_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CONSENT_EVENT, callback);
  };
}

function getSnapshot(): ConsentChoice | null {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "granted" || stored === "denied" ? stored : null;
}

function getServerSnapshot(): ConsentChoice | null {
  return null;
}

/**
 * Charge le conteneur GTM uniquement si l'utilisateur a donné son
 * consentement, et affiche le bandeau tant qu'aucun choix n'a été fait.
 * Sans consentement stocké : aucun script GTM n'est injecté, donc aucun
 * cookie de mesure d'audience n'est posé (exigence CNIL).
 *
 * useSyncExternalStore lit localStorage (état externe au rendu React) :
 * le serveur n'a pas accès à ce stockage, donc getServerSnapshot renvoie
 * toujours `null` (comportement identique à un premier visiteur), et
 * React resynchronise avec la vraie valeur juste après l'hydratation,
 * sans avertissement de mismatch ni cascade de re-render.
 */
export function CookieConsent({ gtmId }: { gtmId?: string }) {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function handleChoice(choice: ConsentChoice) {
    window.localStorage.setItem(STORAGE_KEY, choice);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }

  return (
    <>
      {gtmId && consent === "granted" && (
        <>
          <Script id="gtm-script" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}

      {consent === null && (
        <div
          role="dialog"
          aria-label="Consentement aux cookies"
          data-theme="accueil"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface-elevated px-6 py-5 shadow-soft"
        >
          <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-ink-muted">
              Nous utilisons des cookies de mesure d&rsquo;audience (Google
              Analytics) pour comprendre l&rsquo;utilisation du site. Vous
              pouvez accepter ou refuser à tout moment.{" "}
              <Link
                href="/politique-de-confidentialite"
                className="text-accent-strong underline underline-offset-2"
              >
                En savoir plus
              </Link>
            </p>
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => handleChoice("denied")}
                className="rounded-full border border-line px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-alt"
              >
                Refuser
              </button>
              <button
                type="button"
                onClick={() => handleChoice("granted")}
                className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
              >
                Accepter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
