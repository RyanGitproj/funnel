import { supabaseClient } from "./client";
import { toNullablePayload } from "./payload";
import type { LeadInsertPayload, RequestInsertResult } from "@/types/lead";

/** Code PostgreSQL : violation de contrainte de clé étrangère. */
const FOREIGN_KEY_VIOLATION = "23503";

export async function insertRequest(
  payload: LeadInsertPayload,
): Promise<RequestInsertResult> {
  const supabase = supabaseClient();

  if (!supabase) {
    return {
      success: false,
      error:
        "Le service de réservation n'est pas configuré. Veuillez réessayer ultérieurement ou nous contacter directement.",
    };
  }

  const { error } = await supabase
    .from("funnel_elegance_requests")
    .insert(toNullablePayload(payload));

  if (error) {
    console.error("[insertRequest]", error.code, error.message);

    if (error.code === FOREIGN_KEY_VIOLATION) {
      return {
        success: false,
        code: "contact_missing",
        error:
          "Vos coordonnées n'ont pas été retrouvées. Veuillez les renseigner à nouveau.",
      };
    }

    return {
      success: false,
      error:
        "Une erreur est survenue lors de l'enregistrement de votre demande. Veuillez réessayer ou nous contacter par téléphone.",
    };
  }

  return { success: true };
}
