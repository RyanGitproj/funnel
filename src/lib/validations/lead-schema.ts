import { z } from "zod";

/**
 * Schémas de validation des leads — source unique de vérité.
 *
 * Partagés entre :
 *   - la validation client (React Hook Form + zodResolver)
 *   - la re-validation serveur (Server Action)
 *
 * Règle : aucune règle de validation n'est dupliquée côté client ou
 * côté serveur. Tout vit ici.
 *
 * Convention de mapping avec la table `leads` :
 *   - `univers` : 'ceremonie' | 'festif' (CHECK constraint côté base)
 *   - `nb_invites` : renseigné uniquement si univers = 'ceremonie'
 *   - `type_activite` : renseigné uniquement si univers = 'festif'
 *
 * Note technique : on n'utilise pas `.transform()` ici pour normaliser
 * les chaînes vides en `undefined`. Cela casse l'inférence de type
 * côté React Hook Form (les champs `optional` deviennent `required`
 * mais avec valeur `undefined` autorisée — incohérent avec RHF).
 * La normalisation "chaîne vide → undefined" est faite côté Server
 * Action, au moment de l'envoi à Supabase.
 */

const telephoneRegex = /^[+()\d][\d\s().-]{5,19}$/;

export const festifTypeActiviteOptions = [
  "EVJF",
  "EVG",
  "Anniversaire",
  "Week-end",
  "Autre",
] as const;

export const festifDateFlexibleOptions = ["Oui", "Non"] as const;

export const festifDureeOptions = ["Soirée", "1 nuit", "Week-end"] as const;

export const festifBesoinOptions = [
  "Hébergement",
  "Activités",
  "Restauration",
  "Animation",
] as const;

export const festifAmbianceOptions = [
  "Chic",
  "Fun",
  "Relax",
  "Intense",
  "Surprise",
] as const;

export const festifMaturiteOptions = [
  "Découverte",
  "Comparaison",
  "Prêt à réserver",
] as const;

const baseLeadFields = {
  nom: z
    .string()
    .trim()
    .min(2, "Le nom doit comporter au moins 2 caractères.")
    .max(120, "Le nom ne peut pas dépasser 120 caractères."),
  email: z
    .string()
    .trim()
    .min(1, "L'adresse e-mail est obligatoire.")
    .email("L'adresse e-mail n'est pas valide."),
  telephone: z
    .string()
    .trim()
    .min(1, "Le numéro de téléphone est obligatoire.")
    .regex(telephoneRegex, "Le numéro de téléphone n'est pas valide."),
  date_evenement: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .max(2000, "Le message ne peut pas dépasser 2000 caractères.")
    .optional()
    .or(z.literal("")),
} as const;

/**
 * Schéma Cérémonie.
 * `nb_invites` est facultatif (l'utilisateur peut ne pas encore savoir)
 * mais s'il est renseigné il doit être un entier positif.
 *
 * La conversion "chaîne vide → undefined" est gérée côté formulaire via
 * `register("nb_invites", { setValueAs: ... })`, ce qui permet au
 * schéma de rester simple et bien typé (`number | undefined`).
 */
export const ceremonieLeadSchema = z
  .object({
    ...baseLeadFields,
    univers: z.literal("ceremonie"),
    nb_invites: z
      .number({ message: "Veuillez saisir un nombre d'invités valide." })
      .int("Le nombre d'invités doit être un entier.")
      .min(1, "Le nombre d'invités doit être au moins 1.")
      .max(2000, "Plus de 2000 invités ? Contactez-nous directement.")
      .optional(),
  })
  // Defense en profondeur : on rejette les clés non attendues.
  .strict();

/**
 * Schéma Festif.
 * `type_activite` est obligatoire (select).
 */
export const festifLeadSchema = z
  .object({
    ...baseLeadFields,
    univers: z.literal("festif"),
    date_evenement: z
      .string()
      .trim()
      .min(1, "Veuillez indiquer une date souhaitée."),
    type_activite: z.enum(festifTypeActiviteOptions, {
      message: "Veuillez choisir un type d'événement.",
    }),
    date_flexible: z.enum(festifDateFlexibleOptions, {
      message: "Veuillez préciser si la date est flexible.",
    }),
    nombre_participants: z
      .number({ message: "Veuillez saisir un nombre de participants valide." })
      .int("Le nombre de participants doit être un entier.")
      .min(1, "Le nombre de participants doit être au moins 1.")
      .max(200, "Au-delà de 200 participants, contactez-nous directement."),
    duree: z.enum(festifDureeOptions, {
      message: "Veuillez choisir une durée.",
    }),
    besoins: z
      .array(z.enum(festifBesoinOptions))
      .min(1, "Veuillez sélectionner au moins un besoin."),
    ambiance: z.enum(festifAmbianceOptions, {
      message: "Veuillez choisir l'ambiance recherchée.",
    }),
    budget_estime: z
      .string()
      .trim()
      .min(2, "Veuillez indiquer votre budget estimé.")
      .max(120, "Le budget estimé ne peut pas dépasser 120 caractères."),
    maturite: z.enum(festifMaturiteOptions, {
      message: "Veuillez préciser votre niveau de maturité.",
    }),
    message: z
      .string()
      .trim()
      .min(2, "Veuillez ajouter quelques mots sur votre projet.")
      .max(2000, "Le message ne peut pas dépasser 2000 caractères."),
  })
  .strict();

export type CeremonieLeadInput = z.infer<typeof ceremonieLeadSchema>;
export type FestifLeadInput = z.infer<typeof festifLeadSchema>;

export type LeadUnivers = "ceremonie" | "festif";

/**
 * Normalise une valeur post-validation : transforme les chaînes vides
 * en `undefined` (pour que Supabase reçoive NULL, pas une string vide).
 * Utilisée côté Server Action.
 */
export function normalizeEmptyToUndefined<T extends Record<string, unknown>>(
  values: T,
): T {
  const out: Record<string, unknown> = { ...values };
  for (const [key, value] of Object.entries(out)) {
    if (value === "") out[key] = undefined;
  }
  return out as T;
}
