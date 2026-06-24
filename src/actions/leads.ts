"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  ceremonieLeadSchema,
  festifLeadSchema,
  normalizeEmptyToUndefined,
} from "@/lib/validations/lead-schema";
import { insertLead } from "@/lib/supabase/leads";
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
import { toStoragePayload } from "@/lib/quote/formatQuote";
import type { ActionResult } from "@/types/lead";

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

  const result = await insertLead({
    ...normalizeEmptyToUndefined(parsed.data),
    ...toStoragePayload(quote),
  });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  await rememberConfirmationQuote(quote);

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

  const quote = computeFestifQuote({
    guest_count: parsed.data.guest_count,
    selected_options: parsed.data.selected_options,
    festif_pack: parsed.data.festif_pack,
  });

  const result = await insertLead({
    ...normalizeEmptyToUndefined(parsed.data),
    ...toStoragePayload(quote),
  });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  await rememberConfirmationQuote(quote);

  redirect("/confirmation");
}
