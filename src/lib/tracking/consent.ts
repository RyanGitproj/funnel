import { useSyncExternalStore } from "react";

export type ConsentChoice = "granted" | "denied";

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
 * Source unique du choix cookies : le bandeau l'écrit, GTM et le Meta Pixel
 * s'y abonnent. Jamais de deuxième mécanisme de consentement par pixel.
 *
 * useSyncExternalStore lit localStorage (état externe au rendu React) :
 * le serveur n'a pas accès à ce stockage, donc getServerSnapshot renvoie
 * toujours `null` (comportement identique à un premier visiteur), et
 * React resynchronise avec la vraie valeur juste après l'hydratation,
 * sans avertissement de mismatch ni cascade de re-render.
 */
export function useConsentChoice(): ConsentChoice | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Lecture ponctuelle hors rendu React (helpers d'événements). */
export function getConsentChoice(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  return getSnapshot();
}

export function saveConsentChoice(choice: ConsentChoice) {
  window.localStorage.setItem(STORAGE_KEY, choice);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
