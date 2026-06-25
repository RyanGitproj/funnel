import { describe, test, expect } from "vitest";
import { computeFestifQuote } from "../quoteCalculator";

describe("computeFestifQuote", () => {
  describe("mode pack", () => {
    test("Week-end entre proches → 4 640 €", () => {
      const q = computeFestifQuote({ festif_pack: "weekend_proches", selected_options: [] });
      expect(q.baseAmountMin).toBe(4640);
      expect(q.baseAmountMax).toBe(4640);
      expect(q.pricingMode).toBe("pack");
    });

    test("EVG Fun & Chill → 4 860 €", () => {
      const q = computeFestifQuote({ festif_pack: "evg_fun_chill", selected_options: [] });
      expect(q.baseAmountMin).toBe(4860);
    });

    test("EVJF Chic → 5 190 €", () => {
      const q = computeFestifQuote({ festif_pack: "evjf_chic", selected_options: [] });
      expect(q.baseAmountMin).toBe(5190);
    });

    test("Anniversaire Signature → 5 410 €", () => {
      const q = computeFestifQuote({ festif_pack: "anniversaire_signature", selected_options: [] });
      expect(q.baseAmountMin).toBe(5410);
    });

    test("festif_pack='standard' → mode standard, pas pack", () => {
      const q = computeFestifQuote({ festif_pack: "standard", guest_count: 22, selected_options: [] });
      expect(q.pricingMode).toBe("standard");
      expect(q.baseAmountMin).toBe(3498);
    });
  });

  describe("anti-double-facturation des packs", () => {
    test("weekend_proches inclut petit-déjeuner → Petit-déjeuner non refacturé", () => {
      const q = computeFestifQuote({
        festif_pack: "weekend_proches",
        guest_count: 22,
        selected_options: ["Petit-déjeuner"],
      });
      expect(q.estimatedMin).toBe(4640);
      expect(q.calculatedOptions).toHaveLength(0);
    });

    test("evg_fun_chill inclut petit-déjeuner → Petit-déjeuner non refacturé", () => {
      const q = computeFestifQuote({
        festif_pack: "evg_fun_chill",
        guest_count: 22,
        selected_options: ["Petit-déjeuner"],
      });
      expect(q.estimatedMin).toBe(4860);
      expect(q.calculatedOptions).toHaveLength(0);
    });

    test("evjf_chic inclut brunch → Brunch non refacturé", () => {
      const q = computeFestifQuote({
        festif_pack: "evjf_chic",
        guest_count: 22,
        selected_options: ["Brunch"],
      });
      expect(q.estimatedMin).toBe(5190);
      expect(q.calculatedOptions).toHaveLength(0);
    });

    test("anniversaire_signature inclut brunch → Brunch non refacturé", () => {
      const q = computeFestifQuote({
        festif_pack: "anniversaire_signature",
        guest_count: 22,
        selected_options: ["Brunch"],
      });
      expect(q.estimatedMin).toBe(5410);
      expect(q.calculatedOptions).toHaveLength(0);
    });

    test("evjf_chic + Petit-déjeuner (pas inclus dans ce pack) → ajouté au total", () => {
      const q = computeFestifQuote({
        festif_pack: "evjf_chic",
        guest_count: 22,
        selected_options: ["Petit-déjeuner"],
      });
      expect(q.estimatedMin).toBe(5190 + 10 * 22);
      expect(q.calculatedOptions).toHaveLength(1);
    });

    test("weekend_proches + Brunch (pas inclus dans ce pack) → ajouté au total", () => {
      const q = computeFestifQuote({
        festif_pack: "weekend_proches",
        guest_count: 22,
        selected_options: ["Brunch"],
      });
      expect(q.estimatedMin).toBe(4640 + 20 * 22);
    });
  });

  describe("bug fix : pack + guest_count différent du pack", () => {
    test("evjf_chic (22 pers) + guest_count=18 + Petit-déjeuner → qty=22, pas 18", () => {
      const q = computeFestifQuote({
        festif_pack: "evjf_chic",
        guest_count: 18,
        selected_options: ["Petit-déjeuner"],
      });
      const opt = q.calculatedOptions.find((o) => o.id === "petit_dejeuner");
      expect(opt?.quantity).toBe(22);
      expect(opt?.totalMin).toBe(10 * 22);
    });

    test("evjf_chic + guest_count=15 + Petit-déjeuner → qty=22, pas 15", () => {
      const q = computeFestifQuote({
        festif_pack: "evjf_chic",
        guest_count: 15,
        selected_options: ["Petit-déjeuner"],
      });
      const opt = q.calculatedOptions.find((o) => o.id === "petit_dejeuner");
      expect(opt?.quantity).toBe(22);
    });

    test("mode standard + guest_count=20 + Brunch → qty=20, pas 22", () => {
      const q = computeFestifQuote({
        guest_count: 20,
        selected_options: ["Brunch"],
      });
      const opt = q.calculatedOptions.find((o) => o.id === "brunch");
      expect(opt?.quantity).toBe(20);
      expect(opt?.totalMin).toBe(20 * 20);
    });
  });

  describe("barème standard", () => {
    test("22 pers → 3 498 €", () => {
      const q = computeFestifQuote({ guest_count: 22, selected_options: [] });
      expect(q.baseAmountMin).toBe(22 * 159);
      expect(q.pricingMode).toBe("standard");
    });

    test("20 pers → 3 500 €", () => {
      const q = computeFestifQuote({ guest_count: 20, selected_options: [] });
      expect(q.baseAmountMin).toBe(20 * 175);
    });

    test("18 pers → 3 492 €", () => {
      const q = computeFestifQuote({ guest_count: 18, selected_options: [] });
      expect(q.baseAmountMin).toBe(18 * 194);
    });

    test("16 pers → 3 504 €", () => {
      const q = computeFestifQuote({ guest_count: 16, selected_options: [] });
      expect(q.baseAmountMin).toBe(16 * 219);
    });

    test("14 pers → 3 500 €", () => {
      const q = computeFestifQuote({ guest_count: 14, selected_options: [] });
      expect(q.baseAmountMin).toBe(14 * 250);
    });

    test("12 pers → 3 504 €", () => {
      const q = computeFestifQuote({ guest_count: 12, selected_options: [] });
      expect(q.baseAmountMin).toBe(12 * 292);
    });

    test("standard + brunch 22 pers → 3 498 + 440 = 3 938 €", () => {
      const q = computeFestifQuote({
        guest_count: 22,
        selected_options: ["Brunch"],
      });
      expect(q.estimatedMin).toBe(22 * 159 + 20 * 22);
    });

    test("standard + petit-déjeuner 14 pers → 3 500 + 140", () => {
      const q = computeFestifQuote({
        guest_count: 14,
        selected_options: ["Petit-déjeuner"],
      });
      expect(q.estimatedMin).toBe(14 * 250 + 10 * 14);
    });
  });

  describe("hors barème", () => {
    test("11 pers (< 12) → warning + manualReviewItem", () => {
      const q = computeFestifQuote({ guest_count: 11, selected_options: [] });
      expect(q.warnings).toHaveLength(1);
      expect(q.manualReviewItems.some((m) => m.id === "capacity_persons")).toBe(true);
      expect(q.baseAmountMin).toBe(0);
    });

    test("23 pers (> 22) → warning + manualReviewItem", () => {
      const q = computeFestifQuote({ guest_count: 23, selected_options: [] });
      expect(q.warnings).toHaveLength(1);
      expect(q.manualReviewItems.some((m) => m.id === "capacity_persons")).toBe(true);
    });

    test("15 pers (dans plage, hors barème exact) → warning + base > 0", () => {
      const q = computeFestifQuote({ guest_count: 15, selected_options: [] });
      expect(q.warnings).toHaveLength(1);
      expect(q.baseAmountMin).toBeGreaterThan(0);
    });

    test("13 pers (dans plage, hors barème exact) → warning + base > 0", () => {
      const q = computeFestifQuote({ guest_count: 13, selected_options: [] });
      expect(q.warnings).toHaveLength(1);
      expect(q.baseAmountMin).toBeGreaterThan(0);
    });
  });

  describe("activités (interestItems)", () => {
    test("activités → interestItems uniquement, pas ajoutées au total", () => {
      const q = computeFestifQuote({
        guest_count: 22,
        activites_interest: ["Combat de sumo", "Escape game apéro"],
        selected_options: [],
      });
      expect(q.interestItems).toHaveLength(2);
      expect(q.estimatedMin).toBe(22 * 159);
    });

    test("interestItem sumo contient le prix indicatif", () => {
      const q = computeFestifQuote({
        guest_count: 22,
        activites_interest: ["Combat de sumo"],
        selected_options: [],
      });
      expect(q.interestItems[0]?.indicativePrice).toBe("150 € / jour");
    });

    test("interestItem escape game contient le prix indicatif", () => {
      const q = computeFestifQuote({
        guest_count: 22,
        activites_interest: ["Escape game apéro"],
        selected_options: [],
      });
      expect(q.interestItems[0]?.indicativePrice).toBe("25 € / pers.");
    });

    test("activité sans prix → indicativePrice undefined", () => {
      const q = computeFestifQuote({
        guest_count: 22,
        activites_interest: ["Table de casino"],
        selected_options: [],
      });
      expect(q.interestItems[0]?.indicativePrice).toBeUndefined();
    });
  });

  describe("options sur devis (manual)", () => {
    test("DJ → manualReviewItems, total inchangé", () => {
      const q = computeFestifQuote({
        guest_count: 22,
        selected_options: ["DJ / musique"],
      });
      expect(q.estimatedMin).toBe(22 * 159);
      expect(q.manualReviewItems.some((m) => m.id === "dj")).toBe(true);
    });
  });

  describe("displayLabel", () => {
    test("guest_count undefined, pas de pack → 'À définir'", () => {
      const q = computeFestifQuote({ selected_options: [] });
      expect(q.displayLabel).toBe("À définir");
    });

    test("pack sélectionné → displayLabel contient €", () => {
      const q = computeFestifQuote({ festif_pack: "evjf_chic", selected_options: [] });
      expect(q.displayLabel).toContain("€");
    });
  });
});
