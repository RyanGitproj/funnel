import { describe, test, expect } from "vitest";
import { isValidContactId } from "../contactCookie";

describe("isValidContactId", () => {
  test("accepte un UUID v4 valide", () => {
    expect(isValidContactId("3f2504e0-4f89-41d3-9a0c-0305e82c3301")).toBe(true);
  });

  test("accepte un UUID en majuscules", () => {
    expect(isValidContactId("3F2504E0-4F89-41D3-9A0C-0305E82C3301")).toBe(true);
  });

  test("rejette undefined", () => {
    expect(isValidContactId(undefined)).toBe(false);
  });

  test("rejette une chaîne vide", () => {
    expect(isValidContactId("")).toBe(false);
  });

  test("rejette un UUID tronqué", () => {
    expect(isValidContactId("3f2504e0-4f89-41d3-9a0c")).toBe(false);
  });

  test("rejette un UUID avec suffixe (tentative d'injection)", () => {
    expect(
      isValidContactId("3f2504e0-4f89-41d3-9a0c-0305e82c3301'; drop table--"),
    ).toBe(false);
  });

  test("rejette des caractères non hexadécimaux", () => {
    expect(isValidContactId("3f2504e0-4f89-41d3-9a0c-0305e82c330g")).toBe(false);
  });
});
