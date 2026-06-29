import { describe, test, expect } from "vitest";
import { computeFestifQuote } from "../quoteCalculator";
import {
  toEventTypeFestif,
  isCadeauEligible,
} from "@/config/pricing/festif";

describe("computeFestifQuote", () => {
  describe("grille semaine_1_nuit", () => {
    test("12 pers (min) → 1 140 €, mode grid", () => {
      const q = computeFestifQuote({ festif_duration: "semaine_1_nuit", guest_count: 12, selected_options: [] });
      expect(q.baseAmountMin).toBe(1140);
      expect(q.baseAmountMax).toBe(1140);
      expect(q.pricingMode).toBe("grid");
    });

    test("22 pers → 1 738 €", () => {
      const q = computeFestifQuote({ festif_duration: "semaine_1_nuit", guest_count: 22, selected_options: [] });
      expect(q.baseAmountMin).toBe(1738);
    });

    test("23 pers (premier bivouac) → 1 813 €", () => {
      const q = computeFestifQuote({ festif_duration: "semaine_1_nuit", guest_count: 23, selected_options: [] });
      expect(q.baseAmountMin).toBe(1813);
    });

    test("34 pers (max) → 2 572 €", () => {
      const q = computeFestifQuote({ festif_duration: "semaine_1_nuit", guest_count: 34, selected_options: [] });
      expect(q.baseAmountMin).toBe(2572);
    });

    test("11 pers (< min=12) → baseAmountMin=0 + capacity_check", () => {
      const q = computeFestifQuote({ festif_duration: "semaine_1_nuit", guest_count: 11, selected_options: [] });
      expect(q.baseAmountMin).toBe(0);
      expect(q.warnings).toHaveLength(1);
      expect(q.manualReviewItems.some((m) => m.reason === "capacity_check")).toBe(true);
    });

    test("35 pers (> max=34) → baseAmountMin=0 + capacity_check", () => {
      const q = computeFestifQuote({ festif_duration: "semaine_1_nuit", guest_count: 35, selected_options: [] });
      expect(q.baseAmountMin).toBe(0);
      expect(q.manualReviewItems.some((m) => m.reason === "capacity_check")).toBe(true);
    });
  });

  describe("grille weekend_2_nuits", () => {
    test("10 pers (min) → 2 800 €", () => {
      const q = computeFestifQuote({ festif_duration: "weekend_2_nuits", guest_count: 10, selected_options: [] });
      expect(q.baseAmountMin).toBe(2800);
    });

    test("22 pers → 4 840 €", () => {
      const q = computeFestifQuote({ festif_duration: "weekend_2_nuits", guest_count: 22, selected_options: [] });
      expect(q.baseAmountMin).toBe(4840);
    });

    test("34 pers (max) → 6 970 €", () => {
      const q = computeFestifQuote({ festif_duration: "weekend_2_nuits", guest_count: 34, selected_options: [] });
      expect(q.baseAmountMin).toBe(6970);
    });

    test("9 pers (< min=10) → baseAmountMin=0 + capacity_check", () => {
      const q = computeFestifQuote({ festif_duration: "weekend_2_nuits", guest_count: 9, selected_options: [] });
      expect(q.baseAmountMin).toBe(0);
      expect(q.manualReviewItems.some((m) => m.reason === "capacity_check")).toBe(true);
    });
  });

  describe("weekend_long_3_nuits (barème non validé)", () => {
    test("peu importe le nombre de pers → pricingMode=pending, base=0, duration_pending", () => {
      const q = computeFestifQuote({ festif_duration: "weekend_long_3_nuits", guest_count: 20, selected_options: [] });
      expect(q.pricingMode).toBe("pending");
      expect(q.baseAmountMin).toBe(0);
      expect(q.manualReviewItems.some((m) => m.reason === "duration_pending")).toBe(true);
    });

    test("sans guest_count → pricingMode=pending, base=0", () => {
      const q = computeFestifQuote({ festif_duration: "weekend_long_3_nuits", selected_options: [] });
      expect(q.pricingMode).toBe("pending");
      expect(q.baseAmountMin).toBe(0);
    });
  });

  describe("options per_person sur grille", () => {
    test("weekend_2_nuits + 22 pers + Brunch → 4 840 + 440", () => {
      const q = computeFestifQuote({
        festif_duration: "weekend_2_nuits",
        guest_count: 22,
        selected_options: ["Brunch"],
      });
      expect(q.estimatedMin).toBe(4840 + 20 * 22);
      const opt = q.calculatedOptions.find((o) => o.id === "brunch");
      expect(opt?.quantity).toBe(22);
      expect(opt?.totalMin).toBe(20 * 22);
    });

    test("semaine_1_nuit + 14 pers + Petit-déjeuner → 1 274 + 140", () => {
      const q = computeFestifQuote({
        festif_duration: "semaine_1_nuit",
        guest_count: 14,
        selected_options: ["Petit-déjeuner"],
      });
      expect(q.estimatedMin).toBe(1274 + 10 * 14);
    });
  });

  describe("activités (interestItems)", () => {
    test("activités → interestItems uniquement, pas ajoutées au total", () => {
      const q = computeFestifQuote({
        festif_duration: "weekend_2_nuits",
        guest_count: 22,
        activites_interest: ["Combat de sumo", "Escape game apéro"],
        selected_options: [],
      });
      expect(q.interestItems).toHaveLength(2);
      expect(q.estimatedMin).toBe(4840);
    });

    test("interestItem sumo contient le prix indicatif", () => {
      const q = computeFestifQuote({
        festif_duration: "semaine_1_nuit",
        guest_count: 12,
        activites_interest: ["Combat de sumo"],
        selected_options: [],
      });
      expect(q.interestItems[0]?.indicativePrice).toBe("150 € / jour");
    });

    test("interestItem escape game contient le prix indicatif", () => {
      const q = computeFestifQuote({
        festif_duration: "semaine_1_nuit",
        guest_count: 12,
        activites_interest: ["Escape game apéro"],
        selected_options: [],
      });
      expect(q.interestItems[0]?.indicativePrice).toBe("25 € / pers.");
    });

    test("activité sans prix → indicativePrice undefined", () => {
      const q = computeFestifQuote({
        festif_duration: "semaine_1_nuit",
        guest_count: 12,
        activites_interest: ["Table de casino"],
        selected_options: [],
      });
      expect(q.interestItems[0]?.indicativePrice).toBeUndefined();
    });
  });

  describe("options sur devis (manual)", () => {
    test("DJ → manualReviewItems, total inchangé", () => {
      const q = computeFestifQuote({
        festif_duration: "weekend_2_nuits",
        guest_count: 22,
        selected_options: ["DJ / musique"],
      });
      expect(q.estimatedMin).toBe(4840);
      expect(q.manualReviewItems.some((m) => m.id === "dj")).toBe(true);
    });
  });

  // ── Phase 2 ─────────────────────────────────────────────────────────────────

  describe("toEventTypeFestif", () => {
    test("'EVJF' → 'evjf'", () => {
      expect(toEventTypeFestif("EVJF")).toBe("evjf");
    });
    test("'EVG' → 'evg'", () => {
      expect(toEventTypeFestif("EVG")).toBe("evg");
    });
    test("'Anniversaire' → 'anniversaire'", () => {
      expect(toEventTypeFestif("Anniversaire")).toBe("anniversaire");
    });
    test("'Week-end entre amis' → 'weekend_proches'", () => {
      expect(toEventTypeFestif("Week-end entre amis")).toBe("weekend_proches");
    });
    test("'Fête privée' → 'weekend_proches'", () => {
      expect(toEventTypeFestif("Fête privée")).toBe("weekend_proches");
    });
    test("undefined → 'other'", () => {
      expect(toEventTypeFestif(undefined)).toBe("other");
    });
    test("unknown string → 'other'", () => {
      expect(toEventTypeFestif("Inconnu")).toBe("other");
    });
  });

  describe("isCadeauEligible", () => {
    test("weekend_2_nuits + 20 pers → éligible", () => {
      expect(isCadeauEligible("weekend_2_nuits", 20, 0)).toBe(true);
    });
    test("weekend_2_nuits + 25 pers → éligible", () => {
      expect(isCadeauEligible("weekend_2_nuits", 25, 0)).toBe(true);
    });
    test("weekend_2_nuits + 19 pers + 4500€ total → éligible", () => {
      expect(isCadeauEligible("weekend_2_nuits", 19, 4500)).toBe(true);
    });
    test("weekend_2_nuits + 10 pers + 3000€ total → non éligible", () => {
      expect(isCadeauEligible("weekend_2_nuits", 10, 3000)).toBe(false);
    });
    test("semaine_1_nuit + 25 pers → non éligible (durée incorrecte)", () => {
      expect(isCadeauEligible("semaine_1_nuit", 25, 5000)).toBe(false);
    });
    test("weekend_long_3_nuits + 25 pers → non éligible (durée incorrecte)", () => {
      expect(isCadeauEligible("weekend_long_3_nuits", 25, 6000)).toBe(false);
    });
    test("durée undefined → non éligible", () => {
      expect(isCadeauEligible(undefined, 25, 5000)).toBe(false);
    });
  });

  describe("cadeauEligible via computeFestifQuote", () => {
    test("weekend_2_nuits + 22 pers (≥20) → cadeauEligible = true", () => {
      const q = computeFestifQuote({ festif_duration: "weekend_2_nuits", guest_count: 22, selected_options: [] });
      expect(q.cadeauEligible).toBe(true);
    });
    test("weekend_2_nuits + 10 pers, total < 4500 → cadeauEligible = false", () => {
      const q = computeFestifQuote({ festif_duration: "weekend_2_nuits", guest_count: 10, selected_options: [] });
      expect(q.cadeauEligible).toBe(false);
    });
    test("semaine_1_nuit + 34 pers → cadeauEligible = false (mauvaise durée)", () => {
      const q = computeFestifQuote({ festif_duration: "semaine_1_nuit", guest_count: 34, selected_options: [] });
      expect(q.cadeauEligible).toBe(false);
    });
  });

  describe("loisirs_pack (per person)", () => {
    test("evjf_chic_fun + 20 pers → +240€ (20×12)", () => {
      const q = computeFestifQuote({
        festif_duration: "weekend_2_nuits",
        guest_count: 20,
        selected_options: [],
        loisirs_pack: "evjf_chic_fun",
      });
      const opt = q.calculatedOptions.find((o) => o.id === "evjf_chic_fun");
      expect(opt?.totalMin).toBe(240);
      expect(opt?.quantity).toBe(20);
    });

    test("loisirs_domaine_only → aucun CalculatedOption ajouté", () => {
      const q = computeFestifQuote({
        festif_duration: "weekend_2_nuits",
        guest_count: 20,
        selected_options: [],
        loisirs_pack: "loisirs_domaine_only",
      });
      expect(q.calculatedOptions.find((o) => o.id === "loisirs_domaine_only")).toBeUndefined();
    });
  });

  describe("repas_upgrade (per person)", () => {
    test("brunch_sucre_sale + 15 pers → +300€ (15×20)", () => {
      const q = computeFestifQuote({
        festif_duration: "semaine_1_nuit",
        guest_count: 15,
        selected_options: [],
        repas_upgrade: "brunch_sucre_sale",
      });
      const opt = q.calculatedOptions.find((o) => o.id === "brunch_sucre_sale");
      expect(opt?.totalMin).toBe(300);
    });

    test("repas_upgrade 'none' → aucun CalculatedOption ajouté", () => {
      const q = computeFestifQuote({
        festif_duration: "weekend_2_nuits",
        guest_count: 20,
        selected_options: [],
        repas_upgrade: "none",
      });
      expect(q.calculatedOptions.find((o) => o.id === "brunch_sucre_sale" || o.id === "brunch_complet")).toBeUndefined();
    });
  });

  describe("buffet_traiteur (per person)", () => {
    test("buffet_traiteur + 10 pers → +350€ (10×35)", () => {
      const q = computeFestifQuote({
        festif_duration: "weekend_2_nuits",
        guest_count: 10,
        selected_options: [],
        buffet_choice: "buffet_traiteur",
      });
      const opt = q.calculatedOptions.find((o) => o.id === "buffet_traiteur");
      expect(opt?.totalMin).toBe(350);
      expect(opt?.quantity).toBe(10);
    });

    test("apero_dinatoire + 22 pers → +770€ (22×35)", () => {
      const q = computeFestifQuote({
        festif_duration: "weekend_2_nuits",
        guest_count: 22,
        selected_options: [],
        buffet_choice: "apero_dinatoire",
      });
      const opt = q.calculatedOptions.find((o) => o.id === "apero_dinatoire");
      expect(opt?.totalMin).toBe(770);
    });
  });

  describe("service_courses (forfait fixe)", () => {
    test("service_courses: true → +25€ fixe", () => {
      const q = computeFestifQuote({
        festif_duration: "weekend_2_nuits",
        guest_count: 22,
        selected_options: [],
        service_courses: true,
      });
      const opt = q.calculatedOptions.find((o) => o.id === "service_courses");
      expect(opt?.totalMin).toBe(25);
      expect(opt?.quantity).toBe(1);
    });

    test("service_courses: false → aucun CalculatedOption ajouté", () => {
      const q = computeFestifQuote({
        festif_duration: "weekend_2_nuits",
        guest_count: 22,
        selected_options: [],
        service_courses: false,
      });
      expect(q.calculatedOptions.find((o) => o.id === "service_courses")).toBeUndefined();
    });
  });

  describe("intervenants", () => {
    test("dj_son_lumiere → CalculatedOption +250€", () => {
      const q = computeFestifQuote({
        festif_duration: "weekend_2_nuits",
        guest_count: 22,
        selected_options: [],
        intervenants: ["dj_son_lumiere"],
      });
      const opt = q.calculatedOptions.find((o) => o.id === "dj_son_lumiere");
      expect(opt?.totalMin).toBe(250);
    });

    test("cracheur_de_feu → CalculatedOption +300€", () => {
      const q = computeFestifQuote({
        festif_duration: "weekend_2_nuits",
        guest_count: 22,
        selected_options: [],
        intervenants: ["cracheur_de_feu"],
      });
      const opt = q.calculatedOptions.find((o) => o.id === "cracheur_de_feu");
      expect(opt?.totalMin).toBe(300);
    });

    test("animation_adulte → manualReviewItem (reason='intervenant_on_demand'), total inchangé", () => {
      const baseQ = computeFestifQuote({ festif_duration: "weekend_2_nuits", guest_count: 22, selected_options: [] });
      const q = computeFestifQuote({
        festif_duration: "weekend_2_nuits",
        guest_count: 22,
        selected_options: [],
        intervenants: ["animation_adulte"],
      });
      expect(q.estimatedMin).toBe(baseQ.estimatedMin);
      expect(q.manualReviewItems.some((m) => m.id === "animation_adulte" && m.reason === "intervenant_on_demand")).toBe(true);
      expect(q.calculatedOptions.find((o) => o.id === "animation_adulte")).toBeUndefined();
    });

    test("dj + bien_etre + animation_adulte → 2 calculatedOptions + 1 manualReviewItem", () => {
      const q = computeFestifQuote({
        festif_duration: "weekend_2_nuits",
        guest_count: 22,
        selected_options: [],
        intervenants: ["dj_son_lumiere", "bien_etre_energie", "animation_adulte"],
      });
      expect(q.calculatedOptions.filter((o) => ["dj_son_lumiere", "bien_etre_energie"].includes(o.id))).toHaveLength(2);
      expect(q.manualReviewItems.some((m) => m.id === "animation_adulte")).toBe(true);
    });
  });

  describe("materiel (forfait fixe)", () => {
    test("tente_barnum → +350€", () => {
      const q = computeFestifQuote({
        festif_duration: "weekend_2_nuits",
        guest_count: 22,
        selected_options: [],
        materiel: ["tente_barnum"],
      });
      const opt = q.calculatedOptions.find((o) => o.id === "tente_barnum");
      expect(opt?.totalMin).toBe(350);
    });

    test("tables_chaises → +200€", () => {
      const q = computeFestifQuote({
        festif_duration: "weekend_2_nuits",
        guest_count: 22,
        selected_options: [],
        materiel: ["tables_chaises"],
      });
      const opt = q.calculatedOptions.find((o) => o.id === "tables_chaises");
      expect(opt?.totalMin).toBe(200);
    });

    test("tente + tables → total +550€", () => {
      const q = computeFestifQuote({
        festif_duration: "weekend_2_nuits",
        guest_count: 22,
        selected_options: [],
        materiel: ["tente_barnum", "tables_chaises"],
      });
      const materielTotal = q.calculatedOptions
        .filter((o) => ["tente_barnum", "tables_chaises"].includes(o.id))
        .reduce((s, o) => s + o.totalMin, 0);
      expect(materielTotal).toBe(550);
    });
  });

  describe("guestCount dans QuoteResult", () => {
    test("guestCount propagé dans le résultat", () => {
      const q = computeFestifQuote({ festif_duration: "weekend_2_nuits", guest_count: 22, selected_options: [] });
      expect(q.guestCount).toBe(22);
    });
    test("sans guest_count → guestCount undefined", () => {
      const q = computeFestifQuote({ festif_duration: "weekend_2_nuits", selected_options: [] });
      expect(q.guestCount).toBeUndefined();
    });
  });

  describe("displayLabel", () => {
    test("sans durée ni guest_count → 'À définir'", () => {
      const q = computeFestifQuote({ selected_options: [] });
      expect(q.displayLabel).toBe("À définir");
    });

    test("durée sans guest_count → 'À définir'", () => {
      const q = computeFestifQuote({ festif_duration: "semaine_1_nuit", selected_options: [] });
      expect(q.displayLabel).toBe("À définir");
    });

    test("durée + guest_count valide → displayLabel contient €", () => {
      const q = computeFestifQuote({ festif_duration: "weekend_2_nuits", guest_count: 22, selected_options: [] });
      expect(q.displayLabel).toContain("€");
    });

    test("weekend_long_3_nuits → 'À définir'", () => {
      const q = computeFestifQuote({ festif_duration: "weekend_long_3_nuits", guest_count: 20, selected_options: [] });
      expect(q.displayLabel).toBe("À définir");
    });
  });
});
