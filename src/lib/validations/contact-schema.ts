import { z } from "zod";
import { requiredSelect } from "./lead-schema";

/**
 * Schéma du popup de capture de contact (gate d'entrée du site).
 * Les validateurs d'identité vivaient dans lead-schema.ts : ils ont
 * déménagé ici — les formulaires Cérémonie/Festif ne collectent plus
 * aucune donnée personnelle.
 */

const phoneRegex = /^\+[1-9]\d{6,14}$/;

const utmValue = z.string().trim().max(255).optional();

export const contactPreparationStageOptions = [
  "J'explore encore",
  "J'ai déjà une idée précise",
  "Je veux des conseils",
] as const;

export const contactSchema = z
  .object({
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
    preparation_stage: requiredSelect(
      contactPreparationStageOptions,
      "Veuillez indiquer où vous en êtes dans votre préparation.",
    ),
    rgpd_consent: z.boolean().refine((v) => v === true, {
      message: "Vous devez accepter la politique de confidentialité.",
    }),
    marketing_optin: z.boolean().optional(),
    source_page: z.string().trim().max(200).optional(),
    // Attribution publicitaire (Meta/Google Ads), capturée à l'atterrissage.
    utm_source: utmValue,
    utm_medium: utmValue,
    utm_campaign: utmValue,
    utm_term: utmValue,
    utm_content: utmValue,
  })
  .strict();

export type ContactInput = z.infer<typeof contactSchema>;
