import { describe, test, expect } from "vitest";
import { computeCeremonieQuote, computeFestifQuote } from "../quoteCalculator";
import { toStoragePayload } from "../formatQuote";

describe("Integration : pipeline quote → storage payload", () => {
  describe("Cérémonie", () => {
    test("base seule → payload correct", () => {
      const quote = computeCeremonieQuote({ guest_count: 50, selected_options: [] });
      const payload = toStoragePayload(quote);

      expect(payload.estimated_amount_min).toBe(4200);
      expect(payload.estimated_amount_max).toBe(4200);
      expect(payload.quote_status).toBe("indicative");
      expect(payload.manual_review_required).toBe(true);
      expect(payload.pricing_breakdown).not.toBeNull();
    });

    test("tente → payload reflète les montants corrects", () => {
      const quote = computeCeremonieQuote({
        guest_count: 50,
        selected_options: ["Tente / Barnum professionnel haut standing"],
      });
      const payload = toStoragePayload(quote);

      expect(payload.estimated_amount_min).toBe(6700);
      expect(payload.estimated_amount_max).toBe(10200);
    });

    test("pricing_breakdown contient l'univers et le mode", () => {
      const quote = computeCeremonieQuote({ guest_count: 50, selected_options: [] });
      const payload = toStoragePayload(quote);
      const breakdown = payload.pricing_breakdown as Record<string, unknown>;

      expect(breakdown.universe).toBe("ceremonie");
      expect(breakdown.pricingMode).toBe("base");
    });

    test("option sur devis → manual_review_required=true, estimatedMin inchangé", () => {
      const quote = computeCeremonieQuote({
        guest_count: 50,
        selected_options: ["Traiteur"],
      });
      const payload = toStoragePayload(quote);

      expect(payload.estimated_amount_min).toBe(4200);
      expect(payload.manual_review_required).toBe(true);
      const breakdown = payload.pricing_breakdown as Record<string, unknown>;
      const manual = breakdown.manualReviewItems as unknown[];
      expect(manual.length).toBeGreaterThan(0);
    });

    test("hors capacité → warning présent dans le breakdown", () => {
      const quote = computeCeremonieQuote({ guest_count: 100, selected_options: [] });
      const payload = toStoragePayload(quote);
      const breakdown = payload.pricing_breakdown as Record<string, unknown>;
      const warnings = breakdown.warnings as string[];

      expect(warnings.length).toBeGreaterThan(0);
    });
  });

  describe("Festif", () => {
    test("pack → payload avec prix du pack", () => {
      const quote = computeFestifQuote({
        festif_pack: "evjf_chic",
        guest_count: 22,
        selected_options: [],
      });
      const payload = toStoragePayload(quote);

      expect(payload.estimated_amount_min).toBe(5190);
      expect(payload.estimated_amount_max).toBe(5190);
      const breakdown = payload.pricing_breakdown as Record<string, unknown>;
      expect(breakdown.pricingMode).toBe("pack");
    });

    test("hors barème → estimated_amount null (base=0)", () => {
      const quote = computeFestifQuote({ guest_count: 5, selected_options: [] });
      const payload = toStoragePayload(quote);

      expect(payload.estimated_amount_min).toBeNull();
      expect(payload.estimated_amount_max).toBeNull();
    });

    test("anti-double-billing préservé jusqu'au storage", () => {
      const quote = computeFestifQuote({
        festif_pack: "weekend_proches",
        guest_count: 22,
        selected_options: ["Petit-déjeuner"],
      });
      const payload = toStoragePayload(quote);
      const breakdown = payload.pricing_breakdown as Record<string, unknown>;
      const options = breakdown.calculatedOptions as unknown[];

      expect(options).toHaveLength(0);
      expect(payload.estimated_amount_min).toBe(4640);
    });

    test("bug fix pack+guest_count différent préservé jusqu'au storage", () => {
      const quote = computeFestifQuote({
        festif_pack: "evjf_chic",
        guest_count: 16,
        selected_options: ["Petit-déjeuner"],
      });
      const payload = toStoragePayload(quote);
      const breakdown = payload.pricing_breakdown as Record<string, unknown>;
      const options = breakdown.calculatedOptions as Array<Record<string, number>>;

      expect(options[0]?.quantity).toBe(22);
      expect(payload.estimated_amount_min).toBe(5190 + 10 * 22);
    });

    test("activités → interestItems dans le breakdown, total non affecté", () => {
      const quote = computeFestifQuote({
        guest_count: 22,
        activites_interest: ["Combat de sumo", "Chasse au trésor"],
        selected_options: [],
      });
      const payload = toStoragePayload(quote);
      const breakdown = payload.pricing_breakdown as Record<string, unknown>;
      const interests = breakdown.interestItems as unknown[];

      expect(interests).toHaveLength(2);
      expect(payload.estimated_amount_min).toBe(22 * 159);
    });

    test("standard 22 pers + brunch → payload correct", () => {
      const quote = computeFestifQuote({
        guest_count: 22,
        selected_options: ["Brunch"],
      });
      const payload = toStoragePayload(quote);

      expect(payload.estimated_amount_min).toBe(22 * 159 + 20 * 22);
    });
  });

  describe("Cohérence cross-univers", () => {
    test("quote_status toujours 'indicative'", () => {
      const qc = computeCeremonieQuote({ guest_count: 50, selected_options: [] });
      const qf = computeFestifQuote({ festif_pack: "evjf_chic", selected_options: [] });

      expect(toStoragePayload(qc).quote_status).toBe("indicative");
      expect(toStoragePayload(qf).quote_status).toBe("indicative");
    });

    test("manual_review_required toujours true (validation humaine obligatoire)", () => {
      const qc = computeCeremonieQuote({ guest_count: 50, selected_options: [] });
      const qf = computeFestifQuote({ festif_pack: "anniversaire_signature", selected_options: [] });

      expect(toStoragePayload(qc).manual_review_required).toBe(true);
      expect(toStoragePayload(qf).manual_review_required).toBe(true);
    });
  });
});
