import { z } from "zod";

const optionalSelect = <T extends readonly [string, ...string[]]>(
  values: T,
) => z.enum(values).optional().or(z.literal(""));

export const requiredSelect = <T extends readonly [string, ...string[]]>(
  values: T,
  message: string,
) => z.enum(values, { message });

const optionalString = z.string().trim().max(2000).optional().or(z.literal(""));

const positiveInt = z
  .number({ message: "Veuillez saisir un nombre valide." })
  .int("Veuillez saisir un nombre entier.")
  .min(1, "Veuillez saisir un nombre supérieur à 0.")
  .max(2000, "Veuillez vérifier ce nombre.");

const baseLeadFields = {
  event_date: z.string().trim().min(1, "Veuillez indiquer une date de début."),
  date_flexibility: requiredSelect(
    ["oui", "non", "a_definir"] as const,
    "Veuillez préciser si la date est flexible.",
  ),
  budget_range: requiredSelect(
    [
      "À définir",
      "Moins de 3 000 €",
      "3 000 € – 5 000 €",
      "5 000 € – 8 000 €",
      "8 000 € – 12 000 €",
      "Plus de 12 000 €",
    ] as const,
    "Veuillez choisir un budget estimatif global.",
  ),
  message: optionalString,
} as const;

// ─── Festif ──────────────────────────────────────────────────────────────────

export const festifEventTypeOptions = [
  "EVJF",
  "EVG",
  "Anniversaire & week-end entre proches",
] as const;

export const dateFlexibilityOptions = ["oui", "non", "a_definir"] as const;

/** TYPE B & C — Activités & Extras. Jamais dans le total. Stockées séparément. */
export const festifActivitesInterestOptions = [
  "Combat de sumo",
  "Chasse au trésor",
  "Escape game apéro",
  "Parcours d'énigmes",
  "Parcours gages & défis",
  "Table de casino",
  "Cocooning love",
  "Magicien / mentaliste",
  "Échassiers / cracheurs de feu",
  "Activités extérieures",
] as const;

export const festifDurationOptions = [
  "semaine_1_nuit",
  "weekend_2_nuits",
  "weekend_long_3_nuits",
] as const;

// ─── Phase 2 — nouvelles options festif ──────────────────────────────────────

export const festifLoisirsPackOptions = [
  "evjf_chic_fun",
  "evjf_pool_party",
  "evg_challenge",
  "evg_casino_apero",
  "anniversaire_signature",
  "loisirs_convivial",
  "loisirs_domaine_only",
] as const;

export const festifRepasOptions = [
  "none",
  "petit_dejeuner_continental",
  "brunch_sucre_sale",
  "brunch_complet",
] as const;

export const festifBuffetOptions = [
  "none",
  "buffet_traiteur",
  "apero_dinatoire",
] as const;

export const festifServiceCoursesOptions = [
  "none",
  "service_courses",
  "plus_tard",
] as const;

export const festifIntervenantOptions = [
  "dj_son_lumiere",
  "bien_etre_energie",
  "cracheur_de_feu",
  "echassier_lumineux",
  "animation_adulte",
] as const;

export const festifMaterielOptions = [
  "tente_barnum",
  "tables_chaises",
] as const;

export const festifCadeauOptions = [
  "massage_bien_etre",
  "massage_temoin",
  "pack_celebration",
] as const;

export const festifAmbianceOptions = [
  "Chic & élégante",
  "Festive & animée",
  "Familiale & chaleureuse",
  "Pool party / Garden party",
  "Détente & cocooning",
  "Défis & activités",
] as const;

// ─── Cérémonie ───────────────────────────────────────────────────────────────

export const ceremonieEventTypeOptions = [
  "Mariage",
  "Cérémonie laïque",
  "Fiançailles",
  "Renouvellement de vœux",
  "Baptême",
  "Autre",
] as const;

export const dateFlexibilityLabels: Record<
  (typeof dateFlexibilityOptions)[number],
  string
> = {
  oui: "Oui",
  non: "Non",
  a_definir: "À définir",
};

export const ceremonieSelectedOptions = [
  "Tente / Barnum professionnel haut standing",
  "Plancher bois",
  "Éclairage / ambiance",
  "Chauffage",
  "Traiteur",
  "DJ / musique",
  "Décoration",
  "Photo / vidéo",
  "Mobilier / art de table",
  "Sécurité / accueil",
  "Navette / transport",
  "Coordination",
] as const;

export const ceremonieAmbianceOptions = [
  "Élégante & classique",
  "Romantique & intime",
  "Champêtre & naturelle",
  "Moderne & épurée",
  "Festive & chaleureuse",
] as const;

// ─── Partagé ─────────────────────────────────────────────────────────────────

export const budgetRangeOptions = [
  "À définir",
  "Moins de 3 000 €",
  "3 000 € – 5 000 €",
  "5 000 € – 8 000 €",
  "8 000 € – 12 000 €",
  "Plus de 12 000 €",
] as const;

// ─── Schemas ─────────────────────────────────────────────────────────────────

export const festifLeadSchema = z
  .object({
    ...baseLeadFields,
    // event_date stocke une ou plusieurs dates (CSV ISO)
    event_date: z.string().trim().min(1, "Veuillez sélectionner au moins une date."),
    funnel_type: z.literal("festif"),
    source_page: z.literal("/festif"),
    event_type: requiredSelect(
      festifEventTypeOptions,
      "Veuillez choisir un type d'événement.",
    ),
    festif_duration: requiredSelect(
      festifDurationOptions,
      "Veuillez choisir une durée de séjour.",
    ),
    guest_count: positiveInt,
    activites_interest: z.array(z.enum(festifActivitesInterestOptions)).optional(),
    ambiance: optionalSelect(festifAmbianceOptions),
    // Phase 2
    loisirs_pack: optionalSelect(festifLoisirsPackOptions),
    repas_upgrade: optionalSelect(festifRepasOptions),
    buffet_choice: optionalSelect(festifBuffetOptions),
    service_courses: optionalSelect(festifServiceCoursesOptions).default("none"),
    intervenants: z.array(z.enum(festifIntervenantOptions)).optional().default([]),
    materiel: z.array(z.enum(festifMaterielOptions)).optional().default([]),
    dietary_notes: z.string().trim().max(500).optional().or(z.literal("")),
    autre_intervenant_notes: z.string().trim().max(500).optional().or(z.literal("")),
    autre_materiel_notes: z.string().trim().max(500).optional().or(z.literal("")),
    cadeau_choice: optionalSelect(festifCadeauOptions),
  })
  .strict()
  .superRefine((values, ctx) => {
    if (
      values.buffet_choice &&
      values.buffet_choice !== "none" &&
      !values.dietary_notes?.trim()
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["dietary_notes"],
        message: "Veuillez préciser vos préférences alimentaires.",
      });
    }
  });

export const ceremonieLeadSchema = z
  .object({
    ...baseLeadFields,
    // event_date stocke une ou plusieurs dates (CSV ISO)
    event_date: z.string().trim().min(1, "Veuillez sélectionner au moins une date."),
    funnel_type: z.literal("ceremonie"),
    source_page: z.literal("/ceremonie"),
    event_type: requiredSelect(
      ceremonieEventTypeOptions,
      "Veuillez choisir un type de cérémonie.",
    ),
    guest_count: positiveInt.max(80, "Le domaine accueille jusqu'à 80 invités."),
    selected_options: z.array(z.enum(ceremonieSelectedOptions)).optional(),
    ambiance: optionalSelect(ceremonieAmbianceOptions),
    heater_count: z
      .number()
      .int()
      .min(1)
      .max(10, "Veuillez indiquer 10 appareils maximum.")
      .optional(),
  })
  .strict();

export type CeremonieLeadInput = z.infer<typeof ceremonieLeadSchema>;
export type FestifLeadFormValues = z.input<typeof festifLeadSchema>;
export type FestifLeadInput = z.infer<typeof festifLeadSchema>;
export type FunnelType = "ceremonie" | "festif";

export function normalizeEmptyToUndefined<T extends Record<string, unknown>>(
  values: T,
): T {
  const out: Record<string, unknown> = { ...values };
  for (const [key, value] of Object.entries(out)) {
    if (value === "") out[key] = undefined;
  }
  return out as T;
}
