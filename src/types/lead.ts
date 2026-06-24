import type { CeremonieLeadInput, FestifLeadInput } from "@/lib/validations/lead-schema";

/**
 * Types TypeScript dérivés des schémas Zod (z.infer) — source unique
 * de vérité. Aucun type n'est écrit à la main en parallèle des
 * schémas.
 */

export type { CeremonieLeadInput, FestifLeadInput } from "@/lib/validations/lead-schema";

/** Discriminated union des inputs possibles (utile pour les helpers). */
export type LeadInput = CeremonieLeadInput | FestifLeadInput;

/**
 * Champs de devis calculés côté serveur, ajoutés au payload avant insertion.
 * Nécessitent la migration SQL [Q1] dans TODO.md avant déploiement.
 */
export type QuoteStorageFields = {
  estimated_amount_min?: number | null;
  estimated_amount_max?: number | null;
  manual_review_required?: boolean | null;
  quote_status?: string | null;
  pricing_breakdown?: Record<string, unknown> | null;
};

/**
 * Payload envoyé à la couche d'accès aux données (lib/supabase/leads.ts).
 * Inclut les champs du formulaire + les champs de devis calculés.
 */
export type LeadInsertPayload = LeadInput & QuoteStorageFields;

/**
 * Résultat typé d'une insertion — jamais d'exception, toujours un
 * état explicite. La Server Action l'utilise directement pour renvoyer
 * sa propre réponse typée au client.
 */
export type LeadInsertResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Format de retour public d'une Server Action. Le champ `fieldErrors`
 * est facultatif : présent uniquement si la re-validation serveur a
 * échoué (le client l'utilise pour synchroniser les erreurs RHF).
 */
export type ActionResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string> };
