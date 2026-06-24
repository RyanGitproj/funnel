"use server";

import { redirect } from "next/navigation";
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
import { toStoragePayload } from "@/lib/quote/formatQuote";
import type { ActionResult } from "@/types/lead";

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

  redirect("/confirmation");
}
