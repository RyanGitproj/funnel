import { z } from "zod";

const phoneRegex = /^[+()\d][\d\s().-]{5,19}$/;

const optionalSelect = <T extends readonly [string, ...string[]]>(
  values: T,
) => z.enum(values).optional().or(z.literal(""));

const requiredSelect = <T extends readonly [string, ...string[]]>(
  values: T,
  message: string,
) => z.enum(values, { message });

const optionalString = z.string().trim().max(2000).optional().or(z.literal(""));

const optionalPositiveInt = z
  .number({ message: "Veuillez saisir un nombre valide." })
  .int("Veuillez saisir un nombre entier.")
  .min(0, "Le nombre ne peut pas être négatif.")
  .max(2000, "Veuillez vérifier ce nombre.")
  .optional();

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
    .email("L'adresse e-mail n'est pas valide."),
  phone: z
    .string()
    .trim()
    .min(1, "Le numéro de téléphone est obligatoire.")
    .regex(phoneRegex, "Le numéro de téléphone n'est pas valide."),
  event_date: z.string().trim().min(1, "Veuillez indiquer une date souhaitée."),
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
} as const;

export const festifEventTypeOptions = [
  "EVJF",
  "EVG",
  "Anniversaire",
  "Week-end entre amis",
  "Fête privée",
  "Autre",
] as const;

export const dateFlexibilityOptions = ["oui", "non", "a_definir"] as const;

export const festifParticipantProfileOptions = [
  "Adultes uniquement",
  "Mixte adultes / enfants",
  "À définir",
] as const;

export const festifDurationOptions = [
  "Journée",
  "Soirée",
  "1 nuit",
  "Week-end",
  "À définir",
] as const;

export const festifSelectedOptions = [
  "Hébergement",
  "Restauration",
  "Brunch / petit-déjeuner",
  "Activités",
  "Animation",
  "Privatisation",
  "Aucun besoin spécifique",
  "Autre",
] as const;

export const festifAmbianceOptions = [
  "Chic",
  "Fun",
  "Relax",
  "Intense",
  "Surprise",
  "Élégante mais festive",
] as const;

export const ceremonieEventTypeOptions = [
  "Mariage",
  "Baptême",
  "Communion",
  "Bar Mitzvah",
  "Événement familial",
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

export const ceremonieFormatOptions = [
  "Journée",
  "Soirée",
  "Week-end",
  "Cérémonie + réception",
  "Cérémonie + hébergement",
  "À définir",
] as const;

export const ceremonieSelectedOptions = [
  "Réception",
  "Restauration",
  "Hébergement",
  "Brunch / lendemain",
  "Décoration",
  "Mobilier",
  "Animation",
  "Espaces extérieurs",
  "Autre",
] as const;

export const ceremonieProjectPriorityOptions = [
  "Le cadre du lieu",
  "L'élégance de la réception",
  "L'hébergement des proches essentiels",
  "La simplicité d'organisation",
  "La confidentialité du domaine",
  "La possibilité de privatiser le week-end",
] as const;

export const ceremonieConstraintOptions = [
  "Enfants",
  "Accessibilité",
  "Horaires spécifiques",
  "Restauration spécifique",
  "Besoins familiaux",
  "Aucune pour le moment",
] as const;

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
    participant_profile: optionalSelect(festifParticipantProfileOptions),
    duration: requiredSelect(
      festifDurationOptions,
      "Veuillez choisir une durée souhaitée.",
    ),
    selected_options: z.array(z.enum(festifSelectedOptions)).optional(),
    ambiance: optionalSelect(festifAmbianceOptions),
  })
  .strict();

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
    adult_count: optionalPositiveInt,
    children_count: optionalPositiveInt,
    ceremony_format: requiredSelect(
      ceremonieFormatOptions,
      "Veuillez choisir un format souhaité.",
    ),
    selected_options: z.array(z.enum(ceremonieSelectedOptions)).optional(),
    project_priority: optionalSelect(ceremonieProjectPriorityOptions),
    constraints: z.array(z.enum(ceremonieConstraintOptions)).optional(),
  })
  .strict();

export type CeremonieLeadInput = z.infer<typeof ceremonieLeadSchema>;
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
