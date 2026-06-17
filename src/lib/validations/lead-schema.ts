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
    type_activite: z.enum(
      ["EVJF", "EVG", "Anniversaire", "Autre événement festif"],
      { message: "Veuillez choisir un type d'événement." },
    ),
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
