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
    { persons: 12, total: 1500 },
    { persons: 13, total: 1590 },
    { persons: 14, total: 1680 },
    { persons: 15, total: 1770 },
    { persons: 16, total: 1860 },
    { persons: 17, total: 1950 },
    { persons: 18, total: 2040 },
    { persons: 19, total: 2130 },
    { persons: 20, total: 2220 },
    { persons: 21, total: 2310 },
    { persons: 22, total: 2400 },
    { persons: 23, total: 2500, bivouacPlaces: 1 },
    { persons: 24, total: 2600, bivouacPlaces: 2 },
    { persons: 25, total: 2700, bivouacPlaces: 3 },
    { persons: 26, total: 2800, bivouacPlaces: 4 },
    { persons: 27, total: 2900, bivouacPlaces: 5 },
    { persons: 28, total: 3000, bivouacPlaces: 6 },
    { persons: 29, total: 3100, bivouacPlaces: 7 },
    { persons: 30, total: 3200, bivouacPlaces: 8 },
    { persons: 31, total: 3350, bivouacPlaces: 9 },
    { persons: 32, total: 3500, bivouacPlaces: 10 },
    { persons: 33, total: 3650, bivouacPlaces: 11 },
    { persons: 34, total: 3800, bivouacPlaces: 12 },
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

// ─── Phase 2 — Packs loisirs conditionnels, repas, intervenants, matériel ────

export type FestifLoisirsPackKey =
  | "evjf_chic_fun"
  | "evjf_pool_party"
  | "evg_challenge"
  | "evg_casino_apero"
  | "anniversaire_signature"
  | "loisirs_convivial"
  | "loisirs_domaine_only";

export type EventTypeFestif =
  | "evjf"
  | "evg"
  | "anniversaire"
  | "weekend_proches"
  | "other";

export function toEventTypeFestif(raw: string | undefined): EventTypeFestif {
  switch (raw) {
    case "EVJF": return "evjf";
    case "EVG": return "evg";
    case "Anniversaire & week-end entre proches": return "anniversaire";
    default: return "other";
  }
}

export type FestifLoisirsPack = {
  key: FestifLoisirsPackKey;
  label: string;
  /** 0 = inclus sans supplément. */
  pricePerPerson: number;
};

export const FESTIF_LOISIRS_PACKS_BY_EVENT: Record<EventTypeFestif, FestifLoisirsPack[]> = {
  evjf: [
    {
      key: "evjf_chic_fun",
      label: "Pack EVJF Chic & Fun",
      pricePerPerson: 12,
    },
    {
      key: "evjf_pool_party",
      label: "Pack Pool Party",
      pricePerPerson: 12,
    },
    {
      key: "loisirs_domaine_only",
      label: "Loisirs inclus uniquement",
      pricePerPerson: 0,
    },
  ],
  evg: [
    {
      key: "evg_challenge",
      label: "Pack EVG Challenge",
      pricePerPerson: 12,
    },
    {
      key: "evg_casino_apero",
      label: "Pack Casino & Apéro",
      pricePerPerson: 12,
    },
    {
      key: "loisirs_domaine_only",
      label: "Loisirs inclus uniquement",
      pricePerPerson: 0,
    },
  ],
  anniversaire: [
    {
      key: "anniversaire_signature",
      label: "Pack Anniversaire Signature",
      pricePerPerson: 12,
    },
    {
      key: "loisirs_convivial",
      label: "Pack Loisirs Convivial",
      pricePerPerson: 12,
    },
    {
      key: "loisirs_domaine_only",
      label: "Loisirs inclus uniquement",
      pricePerPerson: 0,
    },
  ],
  weekend_proches: [
    {
      key: "loisirs_convivial",
      label: "Pack Loisirs Convivial",
      pricePerPerson: 12,
    },
    {
      key: "loisirs_domaine_only",
      label: "Loisirs inclus uniquement",
      pricePerPerson: 0,
    },
  ],
  other: [
    {
      key: "loisirs_convivial",
      label: "Pack Loisirs Convivial",
      pricePerPerson: 12,
    },
    {
      key: "loisirs_domaine_only",
      label: "Loisirs inclus uniquement",
      pricePerPerson: 0,
    },
  ],
};

export function getFestifLoisirsPack(key: string): FestifLoisirsPack | undefined {
  const all = Object.values(FESTIF_LOISIRS_PACKS_BY_EVENT).flat();
  return all.find((p) => p.key === key);
}

// ─── Options repas ────────────────────────────────────────────────────────────

/**
 * Le "petit-déjeuner essentiel" (baguette, beurre, confiture, café, chocolat chaud,
 * jus d'orange) est DÉJÀ INCLUS dans le tarif de base — SAUF pour l'offre
 * "semaine_1_nuit", qui n'inclut aucun petit-déjeuner (uniquement disponible en
 * option payante). Ces options sont des AMÉLIORATIONS facultatives — ne jamais
 * appeler l'inclus "basique".
 */
export const FESTIF_REPAS_OPTIONS = {
  petit_dejeuner_continental: {
    id: "petit_dejeuner_continental",
    label: "Petit-déjeuner continental",
    pricePerPerson: 5,
  },
  brunch_sucre_sale: {
    id: "brunch_sucre_sale",
    label: "Brunch sucré ou salé",
    pricePerPerson: 20,
  },
  brunch_complet: {
    id: "brunch_complet",
    label: "Brunch complet",
    pricePerPerson: 22,
  },
} as const;

export const FESTIF_BUFFET_OPTIONS = {
  buffet_traiteur: {
    id: "buffet_traiteur",
    label: "Buffet traiteur",
    pricePerPerson: 35,
  },
  apero_dinatoire: {
    id: "apero_dinatoire",
    label: "Apéro dînatoire",
    pricePerPerson: 35,
  },
} as const;

// ─── Service courses ──────────────────────────────────────────────────────────

export const FESTIF_SERVICE_COURSES = {
  id: "service_courses",
  label: "Service courses installé (courses en sus)",
  priceFlatRate: 25,
} as const;

// ─── Intervenants ─────────────────────────────────────────────────────────────

export type FestifIntervenantKey =
  | "dj_son_lumiere"
  | "bien_etre_energie"
  | "cracheur_de_feu"
  | "echassier_lumineux"
  | "animation_adulte";

export const FESTIF_INTERVENANTS: Record<
  FestifIntervenantKey,
  {
    id: FestifIntervenantKey;
    label: string;
    priceFlat: number;
    requiresManualReview?: boolean;
  }
> = {
  dj_son_lumiere: {
    id: "dj_son_lumiere",
    label: "DJ son & lumière",
    priceFlat: 250,
  },
  bien_etre_energie: {
    id: "bien_etre_energie",
    label: "Bien-être / énergie",
    priceFlat: 150,
  },
  cracheur_de_feu: {
    id: "cracheur_de_feu",
    label: "Cracheur de feu",
    priceFlat: 300,
  },
  echassier_lumineux: {
    id: "echassier_lumineux",
    label: "Échassier lumineux",
    priceFlat: 250,
  },
  animation_adulte: {
    id: "animation_adulte",
    label: "Animation privée adulte (groupe majeur)",
    priceFlat: 0,
    requiresManualReview: true,
  },
};

// ─── Matériel complémentaire ─────────────────────────────────────────────────

export type FestifMaterielKey = "tente_barnum" | "tables_chaises";

export const FESTIF_MATERIEL: Record<
  FestifMaterielKey,
  { id: FestifMaterielKey; label: string; priceFlat: number }
> = {
  tente_barnum: {
    id: "tente_barnum",
    label: "Tente / barnum",
    priceFlat: 350,
  },
  tables_chaises: {
    id: "tables_chaises",
    label: "Tables & chaises supplémentaires",
    priceFlat: 200,
  },
};

// ─── Cadeau offert ────────────────────────────────────────────────────────────

export const FESTIF_CADEAU_OPTIONS = [
  { key: "massage_bien_etre", label: "Massage bien-être offert" },
  { key: "massage_temoin", label: "Massage témoin / meilleure amie / ami proche offert" },
  { key: "pack_celebration", label: "Pack célébration offert" },
] as const;

export type FestifCadeauKey = (typeof FESTIF_CADEAU_OPTIONS)[number]["key"];

/**
 * Détermine si le cadeau offert peut être proposé.
 * Conditions : durée = weekend_2_nuits ET (guestCount >= 20 OU estimatedTotal >= 4500).
 */
export function isCadeauEligible(
  duration: FestifDuration | undefined,
  guestCount: number | undefined,
  estimatedTotal: number | undefined,
): boolean {
  if (duration !== "weekend_2_nuits") return false;
  if (guestCount !== undefined && guestCount >= 20) return true;
  if (estimatedTotal !== undefined && estimatedTotal >= 4500) return true;
  return false;
}

