/**
 * Référence tarifaire Univers Cérémonie — usage interne.
 * Source : validation_logique_tarifaire_domaine_elegances.pdf
 * Tous les prix sont indicatifs. Validation commerciale obligatoire avant toute proposition.
 */

export const CEREMONIE_BASE = {
  min: 4200,
  max: 4200,
} as const;

export const CEREMONIE_INCLUDED_DOMAIN_ITEMS = [
  { id: "domaine_prive", label: "Domaine privé et cadre de 5 hectares" },
  { id: "espaces_reception", label: "Espaces de réception selon configuration" },
  { id: "capacite_reception", label: "Capacité visible jusqu'à 80 invités" },
  { id: "couchages", label: "Couchages sur place selon disponibilité" },
  { id: "piscine_sauna", label: "Piscine couverte chauffée et sauna" },
  { id: "exterieurs", label: "Jardin, terrasse et espaces extérieurs" },
] as const;

export type CeremoniePricedOption = {
  id: string;
  /** Valeur exacte dans ceremonieSelectedOptions */
  formLabel: string;
  priceMin: number;
  priceMax: number;
  /** Si true, le prix est multiplié par une quantité (ex: appareils de chauffage) */
  perUnit?: boolean;
  unitLabel?: string;
};

export type CeremonieManualOption = {
  id: string;
  formLabel: string;
};

/** Options pour lesquelles un prix fourchette est disponible dans le document de référence. */
export const CEREMONIE_PRICED_OPTIONS: CeremoniePricedOption[] = [
  {
    id: "tente",
    formLabel: "Tente / Barnum professionnel haut standing",
    priceMin: 2500,
    priceMax: 6000,
  },
  {
    id: "plancher",
    formLabel: "Plancher bois",
    priceMin: 700,
    priceMax: 1500,
  },
  {
    id: "chauffage",
    formLabel: "Chauffage",
    priceMin: 50,
    priceMax: 300,
    perUnit: true,
    unitLabel: "appareil",
  },
  {
    id: "eclairage",
    formLabel: "Éclairage / ambiance",
    priceMin: 100,
    priceMax: 500,
  },
];

/** Options sans prix connu — nécessitent un devis partenaire ou une validation humaine. */
export const CEREMONIE_MANUAL_OPTIONS: CeremonieManualOption[] = [
  { id: "traiteur", formLabel: "Traiteur" },
  { id: "dj", formLabel: "DJ / musique" },
  { id: "decoration", formLabel: "Décoration" },
  { id: "photo_video", formLabel: "Photo / vidéo" },
  { id: "mobilier", formLabel: "Mobilier / art de table" },
  { id: "securite", formLabel: "Sécurité / accueil" },
  { id: "navette", formLabel: "Navette / transport" },
  { id: "coordination", formLabel: "Coordination" },
];

export const CEREMONIE_CAPACITY = {
  maxGuests: 80,
  maxVehicles: 30,
} as const;
