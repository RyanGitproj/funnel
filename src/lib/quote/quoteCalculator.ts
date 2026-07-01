import {
  CEREMONIE_BASE,
  CEREMONIE_CAPACITY,
  CEREMONIE_INCLUDED_DOMAIN_ITEMS,
  CEREMONIE_MANUAL_OPTIONS,
  CEREMONIE_PRICED_OPTIONS,
} from "@/config/pricing/ceremonie";
import {
  FESTIF_ACTIVITY_OPTIONS,
  FESTIF_BUFFET_OPTIONS,
  FESTIF_CADEAU_OPTIONS,
  FESTIF_DURATION_CAPACITY,
  FESTIF_INCLUDED_DOMAIN_ITEMS,
  FESTIF_INTERVENANTS,
  FESTIF_MATERIEL,
  FESTIF_REPAS_OPTIONS,
  FESTIF_SERVICE_COURSES,
  getFestifDurationRate,
  getFestifLoisirsPack,
  isCadeauEligible,
  type FestifDuration,
  type FestifIntervenantKey,
  type FestifMaterielKey,
} from "@/config/pricing/festif";
import type {
  CalculatedOption,
  IncludedItem,
  InterestItem,
  ManualReviewItem,
  QuoteResult,
} from "./types";

const DISCLAIMER =
  "Estimation indicative avant validation de la date, des disponibilités, de la configuration, des options et des prestations partenaires.";

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
  // Phase 1
  guest_count?: number;
  activites_interest?: string[];
  festif_duration?: FestifDuration;
  // Phase 2
  event_type?: string;
  loisirs_pack?: string;
  repas_upgrade?: string;
  buffet_choice?: string;
  service_courses?: string;
  intervenants?: string[];
  materiel?: string[];
  cadeau_choice?: string;
};

export function computeFestifQuote(input: FestifQuoteInput): QuoteResult {
  const {
    guest_count,
    activites_interest = [],
    festif_duration,
  } = input;

  const calculatedOptions: CalculatedOption[] = [];
  const manualReviewItems: ManualReviewItem[] = [];
  const warnings: string[] = [];

  let baseAmountMin = 0;
  let baseAmountMax = 0;
  let pricingMode: "grid" | "pending" = "grid";

  if (festif_duration === "weekend_long_3_nuits") {
    pricingMode = "pending";
    warnings.push(
      "Le barème week-end long 3 nuits n'est pas encore validé — estimation à confirmer par l'équipe.",
    );
    manualReviewItems.push({
      id: "duration_pending",
      label: "Week-end long — barème non validé, estimation à confirmer",
      reason: "duration_pending",
    });
  } else if (festif_duration !== undefined && guest_count !== undefined) {
    const capacity = FESTIF_DURATION_CAPACITY[festif_duration];
    if (guest_count < capacity!.min || guest_count > capacity!.max) {
      warnings.push(
        `Nombre de participants (${guest_count}) hors barème visible (${capacity!.min} à ${capacity!.max} personnes) — validation humaine obligatoire.`,
      );
      manualReviewItems.push({
        id: "capacity_persons",
        label: "Nombre de participants hors barème",
        reason: "capacity_check",
      });
    } else {
      const rate = getFestifDurationRate(festif_duration, guest_count);
      if (rate) {
        baseAmountMin = rate.total;
        baseAmountMax = rate.total;
      }
    }
  }

  // ── Phase 2 options ────────────────────────────────────────────────────────

  // Packs loisirs
  if (input.loisirs_pack && input.loisirs_pack !== "loisirs_domaine_only") {
    const pack = getFestifLoisirsPack(input.loisirs_pack);
    if (pack && pack.pricePerPerson > 0 && guest_count) {
      const amount = pack.pricePerPerson * guest_count;
      calculatedOptions.push({
        id: pack.key,
        label: pack.label,
        quantity: guest_count,
        unitPriceMin: pack.pricePerPerson,
        unitPriceMax: pack.pricePerPerson,
        totalMin: amount,
        totalMax: amount,
      });
    }
  }

  // Repas upgrade
  if (input.repas_upgrade && input.repas_upgrade !== "none") {
    const repas = FESTIF_REPAS_OPTIONS[input.repas_upgrade as keyof typeof FESTIF_REPAS_OPTIONS];
    if (repas && guest_count) {
      const amount = repas.pricePerPerson * guest_count;
      calculatedOptions.push({
        id: repas.id,
        label: repas.label,
        quantity: guest_count,
        unitPriceMin: repas.pricePerPerson,
        unitPriceMax: repas.pricePerPerson,
        totalMin: amount,
        totalMax: amount,
      });
    }
  }

  // Buffet / apéro
  if (input.buffet_choice && input.buffet_choice !== "none") {
    const buffet = FESTIF_BUFFET_OPTIONS[input.buffet_choice as keyof typeof FESTIF_BUFFET_OPTIONS];
    if (buffet && guest_count) {
      const amount = buffet.pricePerPerson * guest_count;
      calculatedOptions.push({
        id: buffet.id,
        label: buffet.label,
        quantity: guest_count,
        unitPriceMin: buffet.pricePerPerson,
        unitPriceMax: buffet.pricePerPerson,
        totalMin: amount,
        totalMax: amount,
      });
    }
  }

  // Service courses (forfait fixe)
  if (input.service_courses === "service_courses") {
    calculatedOptions.push({
      id: FESTIF_SERVICE_COURSES.id,
      label: FESTIF_SERVICE_COURSES.label,
      quantity: 1,
      unitPriceMin: FESTIF_SERVICE_COURSES.priceFlatRate,
      unitPriceMax: FESTIF_SERVICE_COURSES.priceFlatRate,
      totalMin: FESTIF_SERVICE_COURSES.priceFlatRate,
      totalMax: FESTIF_SERVICE_COURSES.priceFlatRate,
    });
  }

  // Intervenants
  for (const id of input.intervenants ?? []) {
    const intervenant = FESTIF_INTERVENANTS[id as FestifIntervenantKey];
    if (!intervenant) continue;
    if (intervenant.requiresManualReview) {
      manualReviewItems.push({
        id: intervenant.id,
        label: intervenant.label,
        reason: "intervenant_on_demand",
      });
    } else {
      calculatedOptions.push({
        id: intervenant.id,
        label: intervenant.label,
        quantity: 1,
        unitPriceMin: intervenant.priceFlat,
        unitPriceMax: intervenant.priceFlat,
        totalMin: intervenant.priceFlat,
        totalMax: intervenant.priceFlat,
      });
    }
  }

  // Matériel
  for (const id of input.materiel ?? []) {
    const mat = FESTIF_MATERIEL[id as FestifMaterielKey];
    if (mat) {
      calculatedOptions.push({
        id: mat.id,
        label: mat.label,
        quantity: 1,
        unitPriceMin: mat.priceFlat,
        unitPriceMax: mat.priceFlat,
        totalMin: mat.priceFlat,
        totalMax: mat.priceFlat,
      });
    }
  }

  // ── Totaux ─────────────────────────────────────────────────────────────────

  const optionsMin = calculatedOptions.reduce((s, o) => s + o.totalMin, 0);
  const optionsMax = calculatedOptions.reduce((s, o) => s + o.totalMax, 0);
  const estimatedMin = baseAmountMin + optionsMin;
  const estimatedMax = baseAmountMax + optionsMax;

  const cadeauEligible = isCadeauEligible(festif_duration, guest_count, estimatedMin);
  const cadeauChoiceLabel =
    cadeauEligible && input.cadeau_choice
      ? FESTIF_CADEAU_OPTIONS.find((option) => option.key === input.cadeau_choice)?.label
      : undefined;

  const displayLabel = baseAmountMin === 0 ? "À définir" : formatRange(estimatedMin, estimatedMax);

  const includedItems: IncludedItem[] = FESTIF_INCLUDED_DOMAIN_ITEMS.map((item) => ({
    ...item,
    category: "included_domain" as const,
  }));

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
    guestCount: guest_count,
    festifDuration: festif_duration,
    cadeauEligible,
    cadeauChoiceLabel,
  };
}
