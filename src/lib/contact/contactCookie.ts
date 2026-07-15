/**
 * Cookie mémorisant l'id du contact capturé par le popup d'entrée.
 * Sert de référence FK (funnel_elegance_requests.contact_id) lors de la
 * soumission des formulaires Cérémonie/Festif.
 *
 * Posé et lu exclusivement dans les Server Actions (httpOnly : le
 * client ne peut ni le lire ni le forger trivialement). Même en cas
 * de cookie forgé, la contrainte FK côté Supabase rejette l'insert
 * (code 23503) et l'action purge le cookie.
 */

export const CONTACT_ID_COOKIE = "dde_contact_id";

/** 2 jours : un visiteur qui revient ne repasse pas par le popup. */
export const CONTACT_ID_COOKIE_MAX_AGE = 60 * 60 * 24 * 2;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Garde-fou d'entrée du FK : n'accepte qu'un UUID bien formé. */
export function isValidContactId(
  value: string | undefined,
): value is string {
  return value !== undefined && UUID_REGEX.test(value);
}
