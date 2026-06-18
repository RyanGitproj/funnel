import { supabaseClient } from "./client";
import type { LeadInsertPayload, LeadInsertResult } from "@/types/lead";

export async function insertLead(
  payload: LeadInsertPayload,
): Promise<LeadInsertResult> {
  const supabase = supabaseClient();

  if (!supabase) {
    return {
      success: false,
      error:
        "Le service de réservation n'est pas configuré. Veuillez réessayer ultérieurement ou nous contacter directement.",
    };
  }

  const cleanPayload = Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [
      key,
      value === undefined ? null : value,
    ]),
  );

  const { error } = await supabase.from("elegance_leads").insert(cleanPayload);

  if (error) {
    return {
      success: false,
      error:
        "Une erreur est survenue lors de l'enregistrement de votre demande. Veuillez réessayer ou nous contacter par téléphone.",
    };
  }

  return { success: true };
}
