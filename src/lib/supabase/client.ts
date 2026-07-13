import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase public (rôle anon).
 *
 * RLS est activé sur les tables `funnel_elegance_contacts` et `funnel_elegance_requests`
 * avec une policy d'insertion publique uniquement (anon, insert only).
 * On utilise donc le client public côté serveur (Server Actions) comme
 * côté client — jamais de service_role key dans l'app.
 *
 * Les variables d'env sont préfixées NEXT_PUBLIC_ pour rester
 * disponibles aussi bien côté serveur que côté client.
 */

let cached: SupabaseClient | null = null;

/**
 * Retourne le client Supabase configuré, ou `null` si les variables
 * d'environnement ne sont pas renseignées. Renvoyer `null` plutôt que
 * lever permet aux appelants (Server Action) de renvoyer un état
 * d'erreur typé et user-friendly au lieu de planter la requête.
 */
export function supabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  if (cached) return cached;

  cached = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}

/**
 * Indique si Supabase est configuré. Sert à afficher un avertissement
 * côté UI en développement si l'env est manquante — sans fuiter la
 * configuration.
 */
export function isSupabaseConfigured(): boolean {
  return supabaseClient() !== null;
}
