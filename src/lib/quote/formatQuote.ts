import type { QuoteResult } from "./types";

export type QuoteStoragePayload = {
  estimated_amount_min: number | null;
  estimated_amount_max: number | null;
  manual_review_required: boolean;
  quote_status: "indicative";
  pricing_breakdown: Record<string, unknown> | null;
};

export function toStoragePayload(quote: QuoteResult): QuoteStoragePayload {
  return {
    estimated_amount_min: quote.estimatedMin > 0 ? quote.estimatedMin : null,
    estimated_amount_max: quote.estimatedMax > 0 ? quote.estimatedMax : null,
    manual_review_required: true,
    quote_status: "indicative",
    pricing_breakdown: {
      universe: quote.universe,
      pricingMode: quote.pricingMode,
      baseAmountMin: quote.baseAmountMin,
      baseAmountMax: quote.baseAmountMax,
      calculatedOptions: quote.calculatedOptions,
      manualReviewItems: quote.manualReviewItems,
      warnings: quote.warnings,
      displayLabel: quote.displayLabel,
    },
  };
}

export function formatEur(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}
