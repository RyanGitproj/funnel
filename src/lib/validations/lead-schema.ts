import { z } from "zod";

const phoneRegex = /^\+[1-9]\d{6,14}$/;

const optionalSelect = <T extends readonly [string, ...string[]]>(
  values: T,
) => z.enum(values).optional().or(z.literal(""));

const requiredSelect = <T extends readonly [string, ...string[]]>(
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
  first_name: z
    .string()
    .trim()
    .min(2, "Le prénom doit comporter au moins 2 caractères.")
    .max(80, "Le prénom ne peut pas dépasser 80 caractères."),
  last_name: z
    .string()
    .trim()
    .min(2, "Le nom doit comporter au moins 2 caractères.")
    .max(100, "Le nom ne peut pas dépasser 100 caractères."),
  email: z
    .string()
    .trim()
    .min(1, "L'adresse e-mail est obligatoire.")
    .email({ message: "L'adresse e-mail n'est pas valide." }),
  phone: z
    .string()
    .trim()
    .min(1, "Le numéro de téléphone est obligatoire.")
    .regex(phoneRegex, { message: "Le numéro de téléphone n'est pas valide." }),
  event_date: z.string().trim().min(1, "Veuillez indiquer une date de début."),
  event_end_date: z.string().trim().min(1, "Veuillez indiquer une date de fin."),
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
  project_stage: requiredSelect(
    [
      "Je découvre",
      "Je compare plusieurs lieux",
      "Mon projet est déjà assez défini",
      "Je souhaite réserver rapidement",
    ] as const,
    "Veuillez préciser où vous en êtes dans votre projet.",
  ),
  message: optionalString,
  rgpd_consent: z.boolean().refine((v) => v === true, {
    message: "Vous devez accepter la politique de confidentialité.",
  }),
  marketing_optin: z.boolean().optional(),
} as const;

// ─── Festif ──────────────────────────────────────────────────────────────────

export const festifEventTypeOptions = [
  "EVJF",
  "EVG",
  "Anniversaire",
  "Fête entre amis",
  "Pool party / Garden party",
  "Autre",
] as const;

export const dateFlexibilityOptions = ["oui", "non", "a_definir"] as const;

/** TYPE A + options sur devis — incluses dans selected_options et dans le calcul ou le devis. */
export const festifSelectedOptions = [
  "Tente / Barnum professionnel haut standing",
  "DJ / musique",
  "Petit-déjeuner",
  "Brunch",
  "Barbecue",
  "Traiteur / chef",
  "Navette",
  "Sécurité",
  "Décoration",
] as const;

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

export const festifPackOptions = [
  "weekend_proches",
  "evg_fun_chill",
  "evjf_chic",
  "anniversaire_signature",
] as const;

export const festifPackLabels: Record<
  (typeof festifPackOptions)[number],
  string
> = {
  weekend_proches: "Week-end entre proches — 4 640 €",
  evg_fun_chill: "EVG Fun & Chill — 4 860 €",
  evjf_chic: "EVJF Chic — 5 190 €",
  anniversaire_signature: "Anniversaire Signature — 5 410 €",
};

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

export const projectStageOptions = [
  "Je découvre",
  "Je compare plusieurs lieux",
  "Mon projet est déjà assez défini",
  "Je souhaite réserver rapidement",
] as const;

function dateRangeIsValid(values: { event_date: string; event_end_date: string }) {
  if (!values.event_date || !values.event_end_date) return true;
  return values.event_end_date >= values.event_date;
}

// ─── Schemas ─────────────────────────────────────────────────────────────────

export const festifLeadSchema = z
  .object({
    ...baseLeadFields,
    funnel_type: z.literal("festif"),
    source_page: z.literal("/festif"),
    event_type: requiredSelect(
      festifEventTypeOptions,
      "Veuillez choisir un type d'événement.",
    ),
    guest_count: positiveInt,
    selected_options: z.array(z.enum(festifSelectedOptions)).optional(),
    activites_interest: z.array(z.enum(festifActivitesInterestOptions)).optional(),
    ambiance: optionalSelect(festifAmbianceOptions),
    festif_pack: optionalSelect(festifPackOptions),
  })
  .strict()
  .refine(dateRangeIsValid, {
    path: ["event_end_date"],
    message: "La date de fin doit être égale ou postérieure à la date de début.",
  });

export const ceremonieLeadSchema = z
  .object({
    ...baseLeadFields,
    funnel_type: z.literal("ceremonie"),
    source_page: z.literal("/ceremonie"),
    event_type: requiredSelect(
      ceremonieEventTypeOptions,
      "Veuillez choisir un type de cérémonie.",
    ),
    guest_count: positiveInt,
    selected_options: z.array(z.enum(ceremonieSelectedOptions)).optional(),
    ambiance: optionalSelect(ceremonieAmbianceOptions),
    heater_count: z.number().int().min(1).max(20).optional(),
  })
  .strict()
  .refine(dateRangeIsValid, {
    path: ["event_end_date"],
    message: "La date de fin doit être égale ou postérieure à la date de début.",
  });

export type CeremonieLeadInput = z.infer<typeof ceremonieLeadSchema>;
export type FestifLeadInput = z.infer<typeof festifLeadSchema>;
export type FunnelType = "ceremonie" | "festif";

export function normalizeEmptyToUndefined<T extends Record<string, unknown>>(
  values: T,
): T {
  const out: Record<string, unknown> = { ...values };
  for (const [key, value] of Object.entries(out)) {
    if (value === "" || (Array.isArray(value) && value.length === 0))
      out[key] = undefined;
  }
  return out as T;
}
