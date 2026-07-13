import type { ContactInput } from "@/lib/validations/contact-schema";

export type { ContactInput } from "@/lib/validations/contact-schema";

/**
 * Payload envoyé à la couche d'accès aux données (lib/supabase/contacts.ts).
 * L'`id` est généré côté serveur (crypto.randomUUID) et inséré explicitement :
 * la table n'a pas de policy SELECT anon, on ne peut donc pas relire l'id
 * généré en base après insert.
 */
export type ContactInsertPayload = ContactInput & { id: string };

export type ContactInsertResult =
  | { success: true }
  | { success: false; error: string };
