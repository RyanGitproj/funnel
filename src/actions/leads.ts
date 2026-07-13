"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  ceremonieLeadSchema,
  festifLeadSchema,
  normalizeEmptyToUndefined,
} from "@/lib/validations/lead-schema";
import { insertRequest } from "@/lib/supabase/requests";
import {
  computeCeremonieQuote,
  computeFestifQuote,
} from "@/lib/quote/quoteCalculator";
import type { QuoteResult } from "@/lib/quote/types";
import {
  CONFIRMATION_QUOTE_COOKIE,
  createConfirmationQuoteSnapshot,
  encodeConfirmationQuoteCookie,
} from "@/lib/quote/confirmationQuote";
import {
  CONTACT_ID_COOKIE,
  isValidContactId,
} from "@/lib/contact/contactCookie";
import { toStoragePayload } from "@/lib/quote/formatQuote";
import type { ActionResult } from "@/types/lead";

/**
 * Le contact_id provient exclusivement du cookie httpOnly posé par le
 * popup de capture — jamais du payload client (les schémas .strict()
 * le rejetteraient de toute façon).
 */
async function readContactId(): Promise<string | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(CONTACT_ID_COOKIE)?.value;
  return isValidContactId(value) ? value : null;
}

const CONTACT_REQUIRED: ActionResult = {
  success: false,
  errorCode: "contact_required",
  error: "Renseignez d'abord vos coordonnées pour finaliser votre demande.",
};

/**
 * FK violée (cookie forgé ou contact purgé) : on supprime le cookie
 * invalide pour que le popup se rouvre et recrée un contact sain.
 */
async function handleContactMissing(): Promise<ActionResult> {
  const cookieStore = await cookies();
  cookieStore.delete(CONTACT_ID_COOKIE);
  return CONTACT_REQUIRED;
}

async function rememberConfirmationQuote(quote: QuoteResult) {
  const cookieStore = await cookies();

  cookieStore.set(
    CONFIRMATION_QUOTE_COOKIE,
    encodeConfirmationQuoteCookie(createConfirmationQuoteSnapshot(quote)),
    {
      httpOnly: true,
      maxAge: 60 * 30,
      path: "/confirmation",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  );
}

export async function submitCeremonieLead(
  values: unknown,
): Promise<ActionResult> {
  const contactId = await readContactId();

  if (!contactId) {
    return CONTACT_REQUIRED;
  }

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

  const quote = computeCeremonieQuote({
    guest_count: parsed.data.guest_count,
    selected_options: parsed.data.selected_options,
    heater_count: parsed.data.heater_count,
  });

  const result = await insertRequest({
    ...normalizeEmptyToUndefined(parsed.data),
    ...toStoragePayload(quote),
    contact_id: contactId,
  });

  if (!result.success) {
    if (result.code === "contact_missing") {
      return handleContactMissing();
    }
    return { success: false, error: result.error };
  }

  await rememberConfirmationQuote(quote);

  redirect("/confirmation");
}

export async function submitFestifLead(values: unknown): Promise<ActionResult> {
  const contactId = await readContactId();

  if (!contactId) {
    return CONTACT_REQUIRED;
  }

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

  const quote = computeFestifQuote({
    festif_duration: parsed.data.festif_duration,
    guest_count: parsed.data.guest_count,
    activites_interest: parsed.data.activites_interest,
    event_type: parsed.data.event_type,
    loisirs_pack: parsed.data.loisirs_pack,
    repas_upgrade: parsed.data.repas_upgrade,
    buffet_choice: parsed.data.buffet_choice,
    service_courses: parsed.data.service_courses,
    intervenants: parsed.data.intervenants,
    materiel: parsed.data.materiel,
    cadeau_choice: parsed.data.cadeau_choice,
  });

  const result = await insertRequest({
    ...normalizeEmptyToUndefined(parsed.data),
    ...toStoragePayload(quote),
    contact_id: contactId,
  });

  if (!result.success) {
    if (result.code === "contact_missing") {
      return handleContactMissing();
    }
    return { success: false, error: result.error };
  }

  await rememberConfirmationQuote(quote);

  redirect("/confirmation");
}
