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

type ConfirmationQuoteIncludedItem = {
  id: string;
  label: string;
  category: string;
};

type ConfirmationQuoteInterestItem = {
  id: string;
  label: string;
  indicativePrice?: string;
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
  includedItems: ConfirmationQuoteIncludedItem[];
  calculatedOptions: ConfirmationQuoteOption[];
  interestItems: ConfirmationQuoteInterestItem[];
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
  grid: "Séjour estimé (durée × personnes)",
  pending: "Estimation à confirmer",
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
    includedItems: quote.includedItems.map((item) => ({
      id: item.id,
      label: item.label,
      category: item.category,
    })),
    calculatedOptions: quote.calculatedOptions.map((option) => ({
      id: option.id,
      label: option.label,
      quantity: option.quantity,
      unitPriceMin: option.unitPriceMin,
      unitPriceMax: option.unitPriceMax,
      totalMin: option.totalMin,
      totalMax: option.totalMax,
    })),
    interestItems: quote.interestItems.map((item) => ({
      id: item.id,
      label: item.label,
      indicativePrice: item.indicativePrice,
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
      !Array.isArray(parsed.includedItems) ||
      !Array.isArray(parsed.calculatedOptions) ||
      !Array.isArray(parsed.interestItems) ||
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
