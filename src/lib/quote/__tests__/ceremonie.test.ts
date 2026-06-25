import { describe, test, expect } from "vitest";
import { computeCeremonieQuote } from "../quoteCalculator";

describe("computeCeremonieQuote", () => {
  describe("base seule", () => {
    test("sans options → 4 200 €", () => {
      const q = computeCeremonieQuote({ guest_count: 50, selected_options: [] });
      expect(q.estimatedMin).toBe(4200);
      expect(q.estimatedMax).toBe(4200);
      expect(q.pricingMode).toBe("base");
      expect(q.universe).toBe("ceremonie");
    });

    test("aucune option sélectionnée → calculatedOptions vide", () => {
      const q = computeCeremonieQuote({ guest_count: 50, selected_options: [] });
      expect(q.calculatedOptions).toHaveLength(0);
      expect(q.manualReviewItems).toHaveLength(0);
      expect(q.warnings).toHaveLength(0);
    });
  });

  describe("options chiffrées", () => {
    test("tente → base + 2 500–6 000 €", () => {
      const q = computeCeremonieQuote({
        guest_count: 50,
        selected_options: ["Tente / Barnum professionnel haut standing"],
      });
      expect(q.estimatedMin).toBe(6700);
      expect(q.estimatedMax).toBe(10200);
      expect(q.calculatedOptions[0]?.id).toBe("tente");
      expect(q.calculatedOptions[0]?.quantity).toBe(1);
    });

    test("plancher bois → base + 700–1 500 €", () => {
      const q = computeCeremonieQuote({
        guest_count: 50,
        selected_options: ["Plancher bois"],
      });
      expect(q.estimatedMin).toBe(4900);
      expect(q.estimatedMax).toBe(5700);
    });

    test("éclairage → base + 100–500 €", () => {
      const q = computeCeremonieQuote({
        guest_count: 50,
        selected_options: ["Éclairage / ambiance"],
      });
      expect(q.estimatedMin).toBe(4300);
      expect(q.estimatedMax).toBe(4700);
    });

    test("chauffage 1 appareil → base + 50–300 €", () => {
      const q = computeCeremonieQuote({
        guest_count: 50,
        selected_options: ["Chauffage"],
        heater_count: 1,
      });
      expect(q.estimatedMin).toBe(4250);
      expect(q.estimatedMax).toBe(4500);
      expect(q.calculatedOptions[0]?.quantity).toBe(1);
    });

    test("chauffage 2 appareils → base + 100–600 €", () => {
      const q = computeCeremonieQuote({
        guest_count: 50,
        selected_options: ["Chauffage"],
        heater_count: 2,
      });
      expect(q.estimatedMin).toBe(4300);
      expect(q.estimatedMax).toBe(4800);
      expect(q.calculatedOptions[0]?.quantity).toBe(2);
    });

    test("chauffage heater_count undefined → qty=1 par défaut", () => {
      const q = computeCeremonieQuote({
        guest_count: 50,
        selected_options: ["Chauffage"],
        heater_count: undefined,
      });
      expect(q.calculatedOptions[0]?.quantity).toBe(1);
      expect(q.estimatedMin).toBe(4250);
    });

    test("exemple PDF — tente + plancher + 2 chauffages + éclairage → 7 600–12 800 €", () => {
      const q = computeCeremonieQuote({
        guest_count: 60,
        selected_options: [
          "Tente / Barnum professionnel haut standing",
          "Plancher bois",
          "Chauffage",
          "Éclairage / ambiance",
        ],
        heater_count: 2,
      });
      expect(q.estimatedMin).toBe(7600);
      expect(q.estimatedMax).toBe(12800);
    });

    test("plusieurs options chiffrées → somme correcte", () => {
      const q = computeCeremonieQuote({
        guest_count: 50,
        selected_options: [
          "Tente / Barnum professionnel haut standing",
          "Plancher bois",
        ],
      });
      expect(q.estimatedMin).toBe(4200 + 2500 + 700);
      expect(q.estimatedMax).toBe(4200 + 6000 + 1500);
    });
  });

  describe("options sur devis (manual)", () => {
    test("traiteur → manualReviewItems, total inchangé", () => {
      const q = computeCeremonieQuote({
        guest_count: 50,
        selected_options: ["Traiteur"],
      });
      expect(q.estimatedMin).toBe(4200);
      expect(q.estimatedMax).toBe(4200);
      expect(q.manualReviewItems.some((m) => m.id === "traiteur")).toBe(true);
      expect(q.manualReviewItems[0]?.reason).toBe("sur_devis");
    });

    test("DJ → manualReviewItems, total inchangé", () => {
      const q = computeCeremonieQuote({
        guest_count: 50,
        selected_options: ["DJ / musique"],
      });
      expect(q.estimatedMin).toBe(4200);
      expect(q.manualReviewItems.some((m) => m.id === "dj")).toBe(true);
    });

    test("option chiffrée + option sur devis → total = base + chiffrée uniquement", () => {
      const q = computeCeremonieQuote({
        guest_count: 50,
        selected_options: ["Plancher bois", "Traiteur"],
      });
      expect(q.estimatedMin).toBe(4200 + 700);
      expect(q.estimatedMax).toBe(4200 + 1500);
      expect(q.calculatedOptions).toHaveLength(1);
      expect(q.manualReviewItems).toHaveLength(1);
    });
  });

  describe("capacité invités", () => {
    test("exactement 80 invités → aucun warning", () => {
      const q = computeCeremonieQuote({ guest_count: 80, selected_options: [] });
      expect(q.warnings).toHaveLength(0);
    });

    test("81 invités → warning + manualReviewItem capacity_guests", () => {
      const q = computeCeremonieQuote({ guest_count: 81, selected_options: [] });
      expect(q.warnings).toHaveLength(1);
      expect(q.manualReviewItems.some((m) => m.id === "capacity_guests")).toBe(true);
    });

    test("200 invités → warning + manualReviewItem", () => {
      const q = computeCeremonieQuote({ guest_count: 200, selected_options: [] });
      expect(q.warnings).toHaveLength(1);
      expect(q.manualReviewItems.some((m) => m.id === "capacity_guests")).toBe(true);
    });
  });

  describe("structure du résultat", () => {
    test("includedItems contient les éléments du domaine", () => {
      const q = computeCeremonieQuote({ guest_count: 50, selected_options: [] });
      expect(q.includedItems.length).toBeGreaterThan(0);
      expect(q.includedItems.every((i) => i.category === "included_domain")).toBe(true);
    });

    test("disclaimer présent", () => {
      const q = computeCeremonieQuote({ guest_count: 50, selected_options: [] });
      expect(q.disclaimer.length).toBeGreaterThan(0);
    });

    test("displayLabel formaté en euros", () => {
      const q = computeCeremonieQuote({ guest_count: 50, selected_options: [] });
      expect(q.displayLabel).toContain("€");
    });
  });
});
