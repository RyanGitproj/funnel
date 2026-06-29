import { describe, test, expect } from "vitest";
import { computeFestifQuote } from "../quoteCalculator";

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
