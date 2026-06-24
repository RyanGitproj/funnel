export type QuoteUniverse = "ceremonie" | "festif";
export type PricingMode = "base" | "pack" | "standard";
export type ManualReviewReason =
  | "missing_price"
  | "sur_devis"
  | "capacity_check"
  | "logistics_check";

export type CalculatedOption = {
  id: string;
  label: string;
  quantity: number;
  unitPriceMin: number;
  unitPriceMax: number;
  totalMin: number;
  totalMax: number;
};

export type ManualReviewItem = {
  id: string;
  label: string;
  reason: ManualReviewReason;
};

export type QuoteResult = {
  universe: QuoteUniverse;
  pricingMode: PricingMode;
  currency: "EUR";
  baseAmountMin: number;
  baseAmountMax: number;
  calculatedOptions: CalculatedOption[];
  manualReviewItems: ManualReviewItem[];
  warnings: string[];
  estimatedMin: number;
  estimatedMax: number;
  displayLabel: string;
  disclaimer: string;
};
