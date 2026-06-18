"use server";

import { redirect } from "next/navigation";
import {
  ceremonieLeadSchema,
  festifLeadSchema,
  normalizeEmptyToUndefined,
} from "@/lib/validations/lead-schema";
import { insertLead } from "@/lib/supabase/leads";
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

  const result = await insertLead(normalizeEmptyToUndefined(parsed.data));

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

  const result = await insertLead(normalizeEmptyToUndefined(parsed.data));

  if (!result.success) {
    return { success: false, error: result.error };
  }

  redirect("/confirmation");
}
