"use server";

import { redirect } from "next/navigation";
import {
  ceremonieLeadSchema,
  festifLeadSchema,
  normalizeEmptyToUndefined,
} from "@/lib/validations/lead-schema";
import { insertLead } from "@/lib/supabase/leads";
import type { ActionResult } from "@/types/lead";

/**
 * Server Actions pour la soumission des formulaires lead.
 *
 * Règles :
 *   1. Re-validation Zod côté serveur (ne jamais faire confiance au
 *      client). En cas d'échec, on renvoie un état typé sans planter.
 *   2. Insertion via la couche isolée lib/supabase/leads.ts.
 *   3. Sur succès : redirect() vers /confirmation. La redirection est
 *      levée comme une erreur spéciale par Next.js (NEXT_REDIRECT) et
 *      interceptée côté runtime — l'appel client ne recevra donc pas
 *      de valeur de retour, le navigateur naviguera directement.
 *
 * Les actions acceptent `unknown` (et pas le type inféré) pour
 * pouvoir re-valider n'importe quelle entrée venant du client sans
 * risque de typage trompeur.
 */

export async function submitCeremonieLead(
  values: unknown,
): Promise<ActionResult> {
  const parsed = ceremonieLeadSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      error: "Certains champs sont invalides. Veuillez les corriger.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string
      >,
    };
  }

  const result = await insertLead(
    normalizeEmptyToUndefined({
      univers: "ceremonie" as const,
      nom: parsed.data.nom,
      email: parsed.data.email,
      telephone: parsed.data.telephone,
      date_evenement: parsed.data.date_evenement,
      nb_invites: parsed.data.nb_invites,
      message: parsed.data.message,
    }),
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  redirect("/confirmation");
}

export async function submitFestifLead(values: unknown): Promise<ActionResult> {
  const parsed = festifLeadSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      error: "Certains champs sont invalides. Veuillez les corriger.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string
      >,
    };
  }

  const result = await insertLead(
    normalizeEmptyToUndefined({
      univers: "festif" as const,
      nom: parsed.data.nom,
      email: parsed.data.email,
      telephone: parsed.data.telephone,
      date_evenement: parsed.data.date_evenement,
      type_activite: parsed.data.type_activite,
      message: parsed.data.message,
    }),
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  redirect("/confirmation");
}
