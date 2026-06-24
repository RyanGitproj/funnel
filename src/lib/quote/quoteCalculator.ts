import {
  CEREMONIE_BASE,
  CEREMONIE_CAPACITY,
  CEREMONIE_INCLUDED_DOMAIN_ITEMS,
  CEREMONIE_MANUAL_OPTIONS,
  CEREMONIE_PRICED_OPTIONS,
} from "@/config/pricing/ceremonie";
import {
  FESTIF_ACTIVITY_OPTIONS,
  FESTIF_CAPACITY,
  FESTIF_INCLUDED_DOMAIN_ITEMS,
  FESTIF_MANUAL_OPTIONS,
  FESTIF_PACKS,
  FESTIF_PRICED_OPTIONS,
  FESTIF_STANDARD_RATES,
  getFestifOptionIdByLabel,
  getFestifOptionLabelById,
} from "@/config/pricing/festif";
import type {
  CalculatedOption,
  IncludedItem,
  InterestItem,
  ManualReviewItem,
  QuoteResult,
} from "./types";

const DISCLAIMER =
  "Estimation indicative avant validation commerciale, disponibilité, configuration et confirmation partenaire.";

function formatEur(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatRange(min: number, max: number): string {
  if (min === max) return `${formatEur(min)} (estimatif)`;
  return `${formatEur(min)} – ${formatEur(max)} (estimatif)`;
}

export type CeremonieQuoteInput = {
  guest_count?: number;
  selected_options?: string[];
  heater_count?: number;
};

export function computeCeremonieQuote(input: CeremonieQuoteInput): QuoteResult {
  const { guest_count, selected_options = [], heater_count = 1 } = input;

  const calculatedOptions: CalculatedOption[] = [];
  const manualReviewItems: ManualReviewItem[] = [];
  const warnings: string[] = [];

  if (guest_count !== undefined && guest_count > CEREMONIE_CAPACITY.maxGuests) {
    warnings.push(
      `Nombre d'invités (${guest_count}) supérieur à la capacité visible de ${CEREMONIE_CAPACITY.maxGuests} invités — validation humaine obligatoire.`,
    );
    manualReviewItems.push({
      id: "capacity_guests",
      label: "Capacité invités dépassée",
      reason: "capacity_check",
    });
  }

  for (const optLabel of selected_options) {
    const priced = CEREMONIE_PRICED_OPTIONS.find((p) => p.formLabel === optLabel);

    if (priced) {
      const qty = priced.perUnit ? (heater_count ?? 1) : 1;
      calculatedOptions.push({
        id: priced.id,
        label: priced.formLabel,
        quantity: qty,
        unitPriceMin: priced.priceMin,
        unitPriceMax: priced.priceMax,
        totalMin: priced.priceMin * qty,
        totalMax: priced.priceMax * qty,
      });
      continue;
    }

    const manual = CEREMONIE_MANUAL_OPTIONS.find((m) => m.formLabel === optLabel);
    if (manual) {
      manualReviewItems.push({
        id: manual.id,
        label: manual.formLabel,
        reason: "sur_devis",
      });
    }
  }

  const optionsMin = calculatedOptions.reduce((s, o) => s + o.totalMin, 0);
  const optionsMax = calculatedOptions.reduce((s, o) => s + o.totalMax, 0);
  const estimatedMin = CEREMONIE_BASE.min + optionsMin;
  const estimatedMax = CEREMONIE_BASE.max + optionsMax;
  const includedItems: IncludedItem[] = CEREMONIE_INCLUDED_DOMAIN_ITEMS.map(
    (item) => ({
      ...item,
      category: "included_domain",
    }),
  );

  return {
    universe: "ceremonie",
    pricingMode: "base",
    currency: "EUR",
    baseAmountMin: CEREMONIE_BASE.min,
    baseAmountMax: CEREMONIE_BASE.max,
    includedItems,
    calculatedOptions,
    interestItems: [],
    manualReviewItems,
    warnings,
    estimatedMin,
    estimatedMax,
    displayLabel: formatRange(estimatedMin, estimatedMax),
    disclaimer: DISCLAIMER,
  };
}

export type FestifQuoteInput = {
  guest_count?: number;
  selected_options?: string[];
  activites_interest?: string[];
  festif_pack?: string;
};

export function computeFestifQuote(input: FestifQuoteInput): QuoteResult {
  const {
    guest_count,
    selected_options = [],
    activites_interest = [],
    festif_pack,
  } = input;

  const calculatedOptions: CalculatedOption[] = [];
  const manualReviewItems: ManualReviewItem[] = [];
  const warnings: string[] = [];

  let baseAmountMin = 0;
  let baseAmountMax = 0;
  let pricingMode: "pack" | "standard" = "standard";
  let packIncludedOptionIds: string[] = [];

  const pack =
    festif_pack && festif_pack !== "standard"
      ? FESTIF_PACKS.find((p) => p.id === festif_pack)
      : undefined;

  if (pack) {
    baseAmountMin = pack.price;
    baseAmountMax = pack.price;
    pricingMode = "pack";
    packIncludedOptionIds = pack.includedOptionIds;
  } else if (guest_count !== undefined) {
    const rate = FESTIF_STANDARD_RATES.find((r) => r.persons === guest_count);
    if (rate) {
      baseAmountMin = rate.persons * rate.ratePerPerson;
      baseAmountMax = baseAmountMin;
    } else if (
      guest_count < FESTIF_CAPACITY.minPersons ||
      guest_count > FESTIF_CAPACITY.maxPersons
    ) {
      warnings.push(
        `Nombre de participants (${guest_count}) hors barème visible (${FESTIF_CAPACITY.minPersons} à ${FESTIF_CAPACITY.maxPersons} personnes) — validation humaine obligatoire.`,
      );
      manualReviewItems.push({
        id: "capacity_persons",
        label: "Nombre de participants hors barème",
        reason: "capacity_check",
      });
    } else {
      // Guest count is in range but not an exact match — find nearest
      const sorted = [...FESTIF_STANDARD_RATES].sort(
        (a, b) => Math.abs(a.persons - guest_count) - Math.abs(b.persons - guest_count),
      );
      const nearest = sorted[0];
      if (nearest) {
        baseAmountMin = nearest.persons * nearest.ratePerPerson;
        baseAmountMax = baseAmountMin;
        warnings.push(
          `Barème exact non disponible pour ${guest_count} personnes — estimation basée sur ${nearest.persons} personnes.`,
        );
      }
    }
  }

  for (const optLabel of selected_options) {
    const optionId = getFestifOptionIdByLabel(optLabel);
    if (optionId && packIncludedOptionIds.includes(optionId)) {
      continue;
    }

    const priced = FESTIF_PRICED_OPTIONS.find((p) => p.formLabel === optLabel);

    if (priced) {
      if (priced.priceMode === "flat_range") {
        calculatedOptions.push({
          id: priced.id,
          label: priced.formLabel,
          quantity: 1,
          unitPriceMin: priced.priceMin!,
          unitPriceMax: priced.priceMax!,
          totalMin: priced.priceMin!,
          totalMax: priced.priceMax!,
        });
      } else {
        const qty = priced.priceMode === "per_person" ? (guest_count ?? 22) : 1;
        const total = priced.unitPrice! * qty;
        calculatedOptions.push({
          id: priced.id,
          label: priced.formLabel,
          quantity: qty,
          unitPriceMin: priced.unitPrice!,
          unitPriceMax: priced.unitPrice!,
          totalMin: total,
          totalMax: total,
        });
      }
      continue;
    }

    const manual = FESTIF_MANUAL_OPTIONS.find((m) => m.formLabel === optLabel);
    if (manual) {
      manualReviewItems.push({
        id: manual.id,
        label: manual.formLabel,
        reason: "sur_devis",
      });
    }
  }

  const optionsMin = calculatedOptions.reduce((s, o) => s + o.totalMin, 0);
  const optionsMax = calculatedOptions.reduce((s, o) => s + o.totalMax, 0);
  const estimatedMin = baseAmountMin + optionsMin;
  const estimatedMax = baseAmountMax + optionsMax;

  const displayLabel =
    baseAmountMin === 0 && warnings.length === 0
      ? "À définir"
      : formatRange(estimatedMin, estimatedMax);

  const packIncludedItems: IncludedItem[] = packIncludedOptionIds.flatMap(
    (id) => {
      const label = getFestifOptionLabelById(id);
      if (!label) return [];

      return [
        {
          id,
          label,
          category: "included_pack",
        },
      ];
    },
  );
  const includedItems: IncludedItem[] = [
    ...FESTIF_INCLUDED_DOMAIN_ITEMS.map((item) => ({
      ...item,
      category: "included_domain" as const,
    })),
    ...packIncludedItems,
  ];
  const interestItems: InterestItem[] = activites_interest.map((label) => {
    const activity = FESTIF_ACTIVITY_OPTIONS.find(
      (option) => option.formLabel === label,
    );

    return {
      id: activity?.id ?? label,
      label,
      indicativePrice: activity?.indicativePrice,
    };
  });

  return {
    universe: "festif",
    pricingMode,
    currency: "EUR",
    baseAmountMin,
    baseAmountMax,
    includedItems,
    calculatedOptions,
    interestItems,
    manualReviewItems,
    warnings,
    estimatedMin,
    estimatedMax,
    displayLabel,
    disclaimer: DISCLAIMER,
  };
}
