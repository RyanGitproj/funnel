import { supabaseClient } from "./client";
import { toNullablePayload } from "./payload";
import type { ContactInsertPayload, ContactInsertResult } from "@/types/contact";

export async function insertContact(
  payload: ContactInsertPayload,
): Promise<ContactInsertResult> {
  const supabase = supabaseClient();

  if (!supabase) {
    return {
      success: false,
      error:
        "Le service n'est pas configuré. Veuillez réessayer ultérieurement ou nous contacter directement.",
    };
  }

  const { error } = await supabase
    .from("funnel_elegance_contacts")
    .insert(toNullablePayload(payload));

  if (error) {
    console.error("[insertContact]", error.code, error.message);
    return {
      success: false,
      error:
        "Une erreur est survenue lors de l'enregistrement de vos coordonnées. Veuillez réessayer.",
    };
  }

  return { success: true };
}
