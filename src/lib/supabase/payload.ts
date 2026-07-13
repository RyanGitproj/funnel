/**
 * Normalise un payload avant insert : Supabase/PostgREST ignore les
 * clés `undefined`, or on veut des colonnes explicitement `null`
 * (cohérence des exports et des filtres SQL).
 */
export function toNullablePayload(
  payload: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [
      key,
      value === undefined ? null : value,
    ]),
  );
}
