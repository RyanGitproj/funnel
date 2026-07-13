import { getConsentChoice } from "./consent";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Catégorie Meta par univers — partagée entre ViewContent, Lead et
 * SubmitApplication pour que les événements s'agrègent sous les mêmes
 * libellés dans Ads Manager.
 */
export const CONTENT_CATEGORY = {
  accueil: "Accueil",
  ceremonie: "Univers cérémonie",
  festif: "Univers festif",
} as const;

export type UniverseCategoryKey = keyof typeof CONTENT_CATEGORY;

const PATH_CATEGORY: Record<string, string> = {
  "/": CONTENT_CATEGORY.accueil,
  "/ceremonie": CONTENT_CATEGORY.ceremonie,
  "/festif": CONTENT_CATEGORY.festif,
};

/** Catégorie Meta d'une page d'atterrissage (popup monté sur /, /ceremonie, /festif). */
export function contentCategoryForPath(path: string): string {
  return PATH_CATEGORY[path] ?? CONTENT_CATEGORY.accueil;
}

type PendingMetaEvent = {
  name: string;
  params?: Record<string, unknown>;
};

const PENDING_EVENTS_KEY = "dde_meta_pending_events";
const PENDING_EVENTS_MAX = 20;

function readPendingEvents(): PendingMetaEvent[] {
  try {
    const raw = window.sessionStorage.getItem(PENDING_EVENTS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PendingMetaEvent[]) : [];
  } catch {
    return [];
  }
}

/**
 * Envoie un événement Meta si le pixel est monté ; sinon le met en attente
 * dans sessionStorage tant que le visiteur n'a pas refusé les cookies.
 * Rien ne part vers Meta avant consentement : la file est purement locale
 * (aucune requête, aucun cookie), vidée au montage du pixel — ou purgée
 * sans envoi si le visiteur refuse.
 *
 * Cas couvert : le popup contact est souvent soumis avant que le bandeau
 * cookies n'ait été accepté — sans file d'attente, le Lead serait perdu.
 */
export function fbEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (window.fbq) {
    window.fbq("track", name, params);
    return;
  }
  if (getConsentChoice() === "denied") return;
  const pending = readPendingEvents();
  if (pending.length >= PENDING_EVENTS_MAX) return;
  pending.push({ name, params });
  window.sessionStorage.setItem(PENDING_EVENTS_KEY, JSON.stringify(pending));
}

/** Appelé au montage du pixel (consentement accordé) : envoie la file d'attente. */
export function flushPendingMetaEvents() {
  if (typeof window === "undefined" || !window.fbq) return;
  const pending = readPendingEvents();
  clearPendingMetaEvents();
  for (const event of pending) {
    window.fbq("track", event.name, event.params);
  }
}

/** Appelé au refus des cookies : la file ne doit jamais partir. */
export function clearPendingMetaEvents() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(PENDING_EVENTS_KEY);
}
