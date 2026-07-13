import type { CeremonieLeadInput, FestifLeadInput } from "@/lib/validations/lead-schema";

/**
 * Types TypeScript dérivés des schémas Zod (z.infer) — source unique
 * de vérité. Aucun type n'est écrit à la main en parallèle des
 * schémas.
 */

export type { CeremonieLeadInput, FestifLeadInput } from "@/lib/validations/lead-schema";

/** Discriminated union des inputs possibles (utile pour les helpers). */
export type LeadInput = CeremonieLeadInput | FestifLeadInput;

/** Champs de devis calculés côté serveur, ajoutés au payload avant insertion. */
export type QuoteStorageFields = {
  estimated_amount_min?: number | null;
  estimated_amount_max?: number | null;
  manual_review_required?: boolean | null;
  quote_status?: string | null;
  pricing_breakdown?: Record<string, unknown> | null;
};

/**
 * Payload envoyé à la couche d'accès aux données (lib/supabase/requests.ts).
 * `contact_id` est injecté exclusivement côté serveur depuis le cookie
 * httpOnly du popup — jamais accepté du client (les schémas .strict()
 * le rejetteraient de toute façon).
 */
export type LeadInsertPayload = LeadInput &
  QuoteStorageFields & { contact_id: string };

/**
 * Résultat typé d'une insertion — jamais d'exception, toujours un
 * état explicite. `code: "contact_missing"` signale une violation de
 * FK (cookie forgé ou contact purgé) : la Server Action purge alors
 * le cookie et redemande le popup.
 */
export type RequestInsertResult =
  | { success: true }
  | { success: false; error: string; code?: "contact_missing" };

/**
 * Codes d'erreur métier que le client interprète (au-delà du message
 * affichable). `contact_required` → le formulaire funnel ouvre le
 * popup de capture puis resoumet.
 */
export type ActionErrorCode = "contact_required";

/**
 * Format de retour public d'une Server Action. Le champ `fieldErrors`
 * est facultatif : présent uniquement si la re-validation serveur a
 * échoué (le client l'utilise pour synchroniser les erreurs RHF).
 */
export type ActionResult =
  | { success: true }
  | {
      success: false;
      error: string;
      errorCode?: ActionErrorCode;
      fieldErrors?: Record<string, string>;
    };
