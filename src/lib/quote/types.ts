export type QuoteUniverse = "ceremonie" | "festif";
export type PricingMode = "base" | "pack" | "standard";
export type ManualReviewReason =
  | "missing_price"
  | "sur_devis"
  | "capacity_check"
  | "logistics_check";

export type IncludedItemCategory = "included_domain" | "included_pack";

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

export type IncludedItem = {
  id: string;
  label: string;
  category: IncludedItemCategory;
};

export type InterestItem = {
  id: string;
  label: string;
  indicativePrice?: string;
};

export type QuoteResult = {
  universe: QuoteUniverse;
  pricingMode: PricingMode;
  currency: "EUR";
  baseAmountMin: number;
  baseAmountMax: number;
  includedItems: IncludedItem[];
  calculatedOptions: CalculatedOption[];
  interestItems: InterestItem[];
  manualReviewItems: ManualReviewItem[];
  warnings: string[];
  estimatedMin: number;
  estimatedMax: number;
  displayLabel: string;
  disclaimer: string;
};
