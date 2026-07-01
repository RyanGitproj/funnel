import type { FestifDuration } from "@/config/pricing/festif";

export const INCLUS_DOMAINE = [
  "Domaine privé de 5 hectares",
  "Ancienne propriété de prestige",
  "Piscine",
  "Sauna",
  "Tennis privé",
  "City stade privé",
  "Terrain de basket privé",
  "Pétanque",
  "Grands espaces extérieurs",
  "Chevaux à proximité",
  "Cadre isolé pensé pour profiter sans nuisance directe",
  "Petit-déjeuner essentiel inclus",
  "Nettoyage inclus",
  "Couchages selon configuration",
] as const;

/** L'offre "semaine_1_nuit" n'inclut pas le petit-déjeuner (voir src/config/pricing/festif.ts). */
export function getInclusDomaine(duration?: FestifDuration): readonly string[] {
  if (duration === "semaine_1_nuit") {
    return INCLUS_DOMAINE.filter((item) => item !== "Petit-déjeuner essentiel inclus");
  }
  return INCLUS_DOMAINE;
}
