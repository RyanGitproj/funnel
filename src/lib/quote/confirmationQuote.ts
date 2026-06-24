import type { QuoteResult, QuoteUniverse } from "./types";

export const CONFIRMATION_QUOTE_COOKIE = "dde_last_quote";

type ConfirmationQuoteOption = {
  id: string;
  label: string;
  quantity: number;
  unitPriceMin: number;
  unitPriceMax: number;
  totalMin: number;
  totalMax: number;
};

type ConfirmationQuoteManualItem = {
  id: string;
  label: string;
  reason: string;
};

export type ConfirmationQuoteSnapshot = {
  universe: QuoteUniverse;
  universeLabel: string;
  returnPath: string;
  returnLabel: string;
  pricingModeLabel: string;
  displayLabel: string;
  baseAmountMin: number;
  baseAmountMax: number;
  calculatedOptions: ConfirmationQuoteOption[];
  manualReviewItems: ConfirmationQuoteManualItem[];
  warnings: string[];
  disclaimer: string;
};

const UNIVERSE_COPY: Record<
  QuoteUniverse,
  {
    universeLabel: string;
    returnPath: string;
    returnLabel: string;
  }
> = {
  ceremonie: {
    universeLabel: "Univers cérémonie",
    returnPath: "/ceremonie",
    returnLabel: "Confirmer et revenir au parcours cérémonie",
  },
  festif: {
    universeLabel: "Univers festif",
    returnPath: "/festif",
    returnLabel: "Confirmer et revenir au parcours festif",
  },
};

const PRICING_MODE_LABELS = {
  base: "Base domaine",
  pack: "Pack sélectionné",
  standard: "Barème standard",
} as const;

export function createConfirmationQuoteSnapshot(
  quote: QuoteResult,
): ConfirmationQuoteSnapshot {
  const universe = UNIVERSE_COPY[quote.universe];

  return {
    universe: quote.universe,
    universeLabel: universe.universeLabel,
    returnPath: universe.returnPath,
    returnLabel: universe.returnLabel,
    pricingModeLabel: PRICING_MODE_LABELS[quote.pricingMode],
    displayLabel: quote.displayLabel,
    baseAmountMin: quote.baseAmountMin,
    baseAmountMax: quote.baseAmountMax,
    calculatedOptions: quote.calculatedOptions.map((option) => ({
      id: option.id,
      label: option.label,
      quantity: option.quantity,
      unitPriceMin: option.unitPriceMin,
      unitPriceMax: option.unitPriceMax,
      totalMin: option.totalMin,
      totalMax: option.totalMax,
    })),
    manualReviewItems: quote.manualReviewItems.map((item) => ({
      id: item.id,
      label: item.label,
      reason: item.reason,
    })),
    warnings: quote.warnings,
    disclaimer: quote.disclaimer,
  };
}

export function encodeConfirmationQuoteCookie(
  snapshot: ConfirmationQuoteSnapshot,
): string {
  return encodeURIComponent(JSON.stringify(snapshot));
}

export function parseConfirmationQuoteCookie(
  value: string | undefined,
): ConfirmationQuoteSnapshot | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as Partial<
      ConfirmationQuoteSnapshot
    >;

    if (
      (parsed.universe !== "ceremonie" && parsed.universe !== "festif") ||
      typeof parsed.displayLabel !== "string" ||
      typeof parsed.returnPath !== "string" ||
      typeof parsed.returnLabel !== "string" ||
      !Array.isArray(parsed.calculatedOptions) ||
      !Array.isArray(parsed.manualReviewItems) ||
      !Array.isArray(parsed.warnings)
    ) {
      return null;
    }

    return parsed as ConfirmationQuoteSnapshot;
  } catch {
    return null;
  }
}
