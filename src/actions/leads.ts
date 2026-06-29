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

function getCalculatedDuration(startDate: string, endDate: string): string {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const diffMs = end.getTime() - start.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

  return days <= 1 ? "1 jour" : `${days} jours`;
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
    ...(parsed.data.event_end_date
      ? { duration: getCalculatedDuration(parsed.data.event_date, parsed.data.event_end_date) }
      : {}),
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
    festif_duration: parsed.data.festif_duration,
    guest_count: parsed.data.guest_count,
    selected_options: parsed.data.selected_options,
    activites_interest: parsed.data.activites_interest,
  });

  const result = await insertLead({
    ...normalizeEmptyToUndefined(parsed.data),
    ...(parsed.data.event_end_date
      ? { duration: getCalculatedDuration(parsed.data.event_date, parsed.data.event_end_date) }
      : {}),
    ...toStoragePayload(quote),
  });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  await rememberConfirmationQuote(quote);

  redirect("/confirmation");
}
