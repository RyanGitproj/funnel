"use server";

import { cookies } from "next/headers";
import {
  contactSchema,
} from "@/lib/validations/contact-schema";
import { normalizeEmptyToUndefined } from "@/lib/validations/lead-schema";
import { insertContact } from "@/lib/supabase/contacts";
import {
  CONTACT_ID_COOKIE,
  CONTACT_ID_COOKIE_MAX_AGE,
} from "@/lib/contact/contactCookie";
import type { ActionResult } from "@/types/lead";

/**
 * Soumission du popup de capture : validation → insert avec un id
 * généré côté serveur → cookie httpOnly mémorisant cet id (référence
 * FK des futures demandes de devis). Pas de redirect : le client
 * ferme le modal ou enchaîne la resoumission du devis en attente.
 */
export async function submitContact(values: unknown): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(values);

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

  const id = crypto.randomUUID();

  const result = await insertContact({
    id,
    ...normalizeEmptyToUndefined(parsed.data),
  });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  const cookieStore = await cookies();
  cookieStore.set(CONTACT_ID_COOKIE, id, {
    httpOnly: true,
    maxAge: CONTACT_ID_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return { success: true };
}
