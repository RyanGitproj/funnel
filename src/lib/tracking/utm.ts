/**
 * Capture des paramètres UTM des campagnes Meta/Google Ads.
 *
 * L'atterrissage se fait avec `?utm_source=...&utm_campaign=...` ; les
 * paramètres sont mémorisés en sessionStorage dès la première page vue
 * (ils survivent à la navigation interne, qui perd la query string),
 * puis rattachés au contact lors de la soumission du popup de capture.
 */

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];
export type UtmParams = Partial<Record<UtmKey, string>>;

const STORAGE_KEY = "dde_utm";
const MAX_VALUE_LENGTH = 255;

/** Extrait les UTM d'une query string. Fonction pure (testable). */
export function parseUtmParams(search: string): UtmParams {
  const params = new URLSearchParams(search);
  const out: UtmParams = {};

  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) out[key] = value.slice(0, MAX_VALUE_LENGTH);
  }

  return out;
}

/**
 * Mémorise les UTM de l'URL courante s'il y en a (un nouvel atterrissage
 * tagué écrase le précédent), sinon conserve ceux déjà stockés.
 */
export function rememberUtmParams(): void {
  if (typeof window === "undefined") return;

  const utm = parseUtmParams(window.location.search);
  if (Object.keys(utm).length === 0) return;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
  } catch {
    // sessionStorage indisponible (navigation privée stricte) : tant pis,
    // le contact sera enregistré sans attribution.
  }
}

/** Relit les UTM mémorisés (objet vide si aucun). */
export function readUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};

    const out: UtmParams = {};
    for (const key of UTM_KEYS) {
      const value = (parsed as Record<string, unknown>)[key];
      if (typeof value === "string" && value) {
        out[key] = value.slice(0, MAX_VALUE_LENGTH);
      }
    }
    return out;
  } catch {
    return {};
  }
}
