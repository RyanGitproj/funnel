import { supabaseClient } from "./client";
import type { LeadInsertPayload, LeadInsertResult } from "@/types/lead";

/**
 * Couche d'accès aux données — isolée des composants et des Server
 * Actions. C'est le SEUL endroit du code qui parle à Supabase.
 *
 * Règle d'architecture : aucun composant ou Server Action n'écrit
 * de requête Supabase directement. Tout passe par ici.
 */

/**
 * Insère un lead dans la table `leads`.
 *
 * @returns un état typé — jamais d'exception remontée à l'appelant,
 *          pour permettre à la Server Action de renvoyer une réponse
 *          structurée ({ success: false, error }) au lieu de planter.
 */
export async function insertLead(
  payload: LeadInsertPayload,
): Promise<LeadInsertResult> {
  const supabase = supabaseClient();

  if (!supabase) {
    return {
      success: false,
      error:
        "Le service de réservation n'est pas configuré. Veuillez réessayer ultérieurement ou nous contacter directement.",
    };
  }

  const { error } = await supabase.from("leads").insert({
    univers: payload.univers,
    nom: payload.nom,
    email: payload.email,
    telephone: payload.telephone,
    date_evenement: payload.date_evenement ?? null,
    nb_invites: payload.nb_invites ?? null,
    type_activite: payload.type_activite ?? null,
    message: payload.message ?? null,
    // statut a une valeur par défaut 'nouveau' côté base, on n'impose rien.
  });

  if (error) {
    // En production on ne remonte jamais le message brut de Supabase
    // (risque de fuite d'information sur le schéma).
    return {
      success: false,
      error:
        "Une erreur est survenue lors de l'enregistrement de votre demande. Veuillez réessayer ou nous contacter par téléphone.",
    };
  }

  return { success: true };
}
