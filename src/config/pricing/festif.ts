/**
 * Référence tarifaire Univers Festif — usage interne.
 * Source : validation_logique_tarifaire_domaine_elegances.pdf
 * Tous les prix sont indicatifs. Validation commerciale obligatoire avant toute proposition.
 */

export type FestifDuration =
  | "semaine_1_nuit"
  | "weekend_2_nuits"
  | "weekend_long_3_nuits";

export type FestifDurationRate = {
  persons: number;
  total: number;
  /** Nombre de places bivouac au-delà des 22 couchages intérieurs, si applicable. */
  bivouacPlaces?: number;
};

export const FESTIF_DURATION_LABELS: Record<FestifDuration, string> = {
  semaine_1_nuit: "Offre semaine — 1 nuit",
  weekend_2_nuits: "Week-end — 2 nuits",
  weekend_long_3_nuits: "Week-end long — 3 nuits",
};

/** null = barème non validé, ne jamais calculer automatiquement. */
export const FESTIF_DURATION_CAPACITY: Record<
  FestifDuration,
  { min: number; max: number } | null
> = {
  semaine_1_nuit: { min: 12, max: 34 },
  weekend_2_nuits: { min: 10, max: 34 },
  weekend_long_3_nuits: null,
};

/**
 * Grilles tarifaires — source : validation_logique_tarifaire (correctifs durée×personnes).
 * Chaque ligne = prix TOTAL exact pour ce nombre de personnes (pas une formule continue,
 * le tarif/personne dégressif n'est pas parfaitement linéaire). Couvre tous les entiers
 * de min à max : un lookup exact doit toujours trouver une ligne dans la plage.
 */
export const FESTIF_DURATION_RATES: Record<FestifDuration, FestifDurationRate[]> = {
  semaine_1_nuit: [
    { persons: 12, total: 1140 },
    { persons: 13, total: 1209 },
    { persons: 14, total: 1274 },
    { persons: 15, total: 1335 },
    { persons: 16, total: 1392 },
    { persons: 17, total: 1445 },
    { persons: 18, total: 1494 },
    { persons: 19, total: 1558 },
    { persons: 20, total: 1620 },
    { persons: 21, total: 1680 },
    { persons: 22, total: 1738 },
    { persons: 23, total: 1813, bivouacPlaces: 1 },
    { persons: 24, total: 1887, bivouacPlaces: 2 },
    { persons: 25, total: 1960, bivouacPlaces: 3 },
    { persons: 26, total: 2032, bivouacPlaces: 4 },
    { persons: 27, total: 2103, bivouacPlaces: 5 },
    { persons: 28, total: 2173, bivouacPlaces: 6 },
    { persons: 29, total: 2242, bivouacPlaces: 7 },
    { persons: 30, total: 2310, bivouacPlaces: 8 },
    { persons: 31, total: 2377, bivouacPlaces: 9 },
    { persons: 32, total: 2443, bivouacPlaces: 10 },
    { persons: 33, total: 2508, bivouacPlaces: 11 },
    { persons: 34, total: 2572, bivouacPlaces: 12 },
  ],
  weekend_2_nuits: [
    { persons: 10, total: 2800 },
    { persons: 11, total: 3025 },
    { persons: 12, total: 3240 },
    { persons: 13, total: 3445 },
    { persons: 14, total: 3640 },
    { persons: 15, total: 3825 },
    { persons: 16, total: 4000 },
    { persons: 17, total: 4165 },
    { persons: 18, total: 4320 },
    { persons: 19, total: 4465 },
    { persons: 20, total: 4600 },
    { persons: 21, total: 4725 },
    { persons: 22, total: 4840 },
    { persons: 23, total: 5045, bivouacPlaces: 1 },
    { persons: 24, total: 5245, bivouacPlaces: 2 },
    { persons: 25, total: 5440, bivouacPlaces: 3 },
    { persons: 26, total: 5630, bivouacPlaces: 4 },
    { persons: 27, total: 5815, bivouacPlaces: 5 },
    { persons: 28, total: 5995, bivouacPlaces: 6 },
    { persons: 29, total: 6170, bivouacPlaces: 7 },
    { persons: 30, total: 6340, bivouacPlaces: 8 },
    { persons: 31, total: 6505, bivouacPlaces: 9 },
    { persons: 32, total: 6665, bivouacPlaces: 10 },
    { persons: 33, total: 6820, bivouacPlaces: 11 },
    { persons: 34, total: 6970, bivouacPlaces: 12 },
  ],
  // Barème non validé pour le moment — ne jamais inventer de prix ici.
  weekend_long_3_nuits: [],
};

export function getFestifDurationRate(
  duration: FestifDuration,
  persons: number,
): FestifDurationRate | undefined {
  return FESTIF_DURATION_RATES[duration].find((r) => r.persons === persons);
}

export const FESTIF_INCLUDED_DOMAIN_ITEMS = [
  { id: "couchages", label: "22 couchages sur place selon configuration" },
  { id: "piscine", label: "Piscine couverte chauffée" },
  { id: "sauna", label: "Sauna" },
  { id: "tennis", label: "Tennis" },
  { id: "basket", label: "Basket" },
  { id: "petanque", label: "Pétanque" },
  { id: "karaoke_jeux", label: "Karaoké avec micro et jeux festifs" },
] as const;

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

