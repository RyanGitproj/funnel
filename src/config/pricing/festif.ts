/**
 * Référence tarifaire Univers Festif — usage interne.
 * Source : validation_logique_tarifaire_domaine_elegances.pdf
 * Tous les prix sont indicatifs. Validation commerciale obligatoire avant toute proposition.
 */

export type FestifPack = {
  id: string;
  label: string;
  price: number;
  persons: number;
  /** IDs des options déjà incluses — ne pas les facturer une seconde fois. */
  includedOptionIds: string[];
};

export const FESTIF_PACKS: FestifPack[] = [
  {
    id: "weekend_proches",
    label: "Week-end entre proches",
    price: 4640,
    persons: 22,
    includedOptionIds: [],
  },
  {
    id: "evg_fun_chill",
    label: "EVG Fun & Chill",
    price: 4860,
    persons: 22,
    includedOptionIds: ["karaoke"],
  },
  {
    id: "evjf_chic",
    label: "EVJF Chic",
    price: 5190,
    persons: 22,
    includedOptionIds: ["karaoke"],
  },
  {
    id: "anniversaire_signature",
    label: "Anniversaire Signature",
    price: 5410,
    persons: 22,
    includedOptionIds: [],
  },
];

export type FestifStandardRate = {
  persons: number;
  ratePerPerson: number;
};

/** Barème privatisation standard. Hors barème → validation humaine obligatoire. */
export const FESTIF_STANDARD_RATES: FestifStandardRate[] = [
  { persons: 22, ratePerPerson: 159 },
  { persons: 20, ratePerPerson: 175 },
  { persons: 18, ratePerPerson: 194 },
  { persons: 16, ratePerPerson: 219 },
  { persons: 14, ratePerPerson: 250 },
  { persons: 12, ratePerPerson: 292 },
];

export type FestifPricedOption = {
  id: string;
  formLabel: string;
  priceMode: "per_person" | "per_unit" | "flat_range";
  unitPrice?: number;   // per_person / per_unit
  unitLabel?: string;
  priceMin?: number;    // flat_range
  priceMax?: number;    // flat_range
};

/**
 * TYPE A — Options incluses dans le total estimatif automatique.
 * Conditions : prix connu + s'applique à TOUS les participants sans exception,
 * ou forfait fixe (flat_range) avec fourchette connue.
 */
export const FESTIF_PRICED_OPTIONS: FestifPricedOption[] = [
  {
    id: "tente",
    formLabel: "Tente / Barnum professionnel haut standing",
    priceMode: "flat_range",
    priceMin: 2500,
    priceMax: 6000,
  },
  {
    id: "petit_dejeuner",
    formLabel: "Petit-déjeuner",
    priceMode: "per_person",
    unitPrice: 10,
  },
  {
    id: "brunch",
    formLabel: "Brunch",
    priceMode: "per_person",
    unitPrice: 20,
  },
];

export type FestifManualOption = {
  id: string;
  formLabel: string;
};

/** Options festives sans prix connu — sur devis partenaire. Présentes dans selected_options. */
export const FESTIF_MANUAL_OPTIONS: FestifManualOption[] = [
  { id: "dj", formLabel: "DJ / musique" },
  { id: "barbecue", formLabel: "Barbecue" },
  { id: "traiteur", formLabel: "Traiteur / chef" },
  { id: "karaoke", formLabel: "Karaoké" },
  { id: "navette", formLabel: "Navette" },
  { id: "securite", formLabel: "Sécurité" },
  { id: "decoration", formLabel: "Décoration" },
];

/**
 * TYPE B & C — Activités & Extras.
 * Jamais additionnées au total estimatif (nombre de participants réels inconnu
 * ou prix indisponible). Stockées dans activites_interest[].
 * formLabel doit correspondre exactement à festifActivitesInterestOptions.
 */
export type FestifActivityOption = {
  id: string;
  formLabel: string;
  indicativePrice?: string;
};

export const FESTIF_ACTIVITY_OPTIONS: FestifActivityOption[] = [
  { id: "sumo",            formLabel: "Combat de sumo",            indicativePrice: "150 € / jour" },
  { id: "chasse_tresor",   formLabel: "Chasse au trésor",          indicativePrice: "15 € / pers." },
  { id: "escape_game",     formLabel: "Escape game apéro",         indicativePrice: "25 € / pers." },
  { id: "enigmes",         formLabel: "Parcours d'énigmes",        indicativePrice: "25 € / pers." },
  { id: "parcours_gages",  formLabel: "Parcours gages & défis" },
  { id: "table_casino",    formLabel: "Table de casino" },
  { id: "cocooning",       formLabel: "Cocooning love" },
  { id: "magicien",        formLabel: "Magicien / mentaliste" },
  { id: "echassiers",      formLabel: "Échassiers / cracheurs de feu" },
  { id: "activites_ext",   formLabel: "Activités extérieures" },
];

export const FESTIF_CAPACITY = {
  minPersons: 12,
  maxPersons: 22,
} as const;

export function getFestifOptionLabelById(id: string): string | undefined {
  return (
    FESTIF_PRICED_OPTIONS.find((option) => option.id === id)?.formLabel ??
    FESTIF_MANUAL_OPTIONS.find((option) => option.id === id)?.formLabel ??
    FESTIF_ACTIVITY_OPTIONS.find((option) => option.id === id)?.formLabel
  );
}

export function getFestifOptionIdByLabel(label: string): string | undefined {
  return (
    FESTIF_PRICED_OPTIONS.find((option) => option.formLabel === label)?.id ??
    FESTIF_MANUAL_OPTIONS.find((option) => option.formLabel === label)?.id ??
    FESTIF_ACTIVITY_OPTIONS.find((option) => option.formLabel === label)?.id
  );
}

export function getFestifPackIncludedLabels(packId?: string): string[] {
  if (!packId) return [];

  const pack = FESTIF_PACKS.find((item) => item.id === packId);
  if (!pack) return [];

  return pack.includedOptionIds
    .map((id) => getFestifOptionLabelById(id))
    .filter((label): label is string => Boolean(label));
}
