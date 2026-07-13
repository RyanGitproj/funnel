import { describe, test, expect } from "vitest";
import { parseUtmParams } from "../utm";

describe("parseUtmParams", () => {
  test("extrait les cinq paramètres UTM standard", () => {
    expect(
      parseUtmParams(
        "?utm_source=facebook&utm_medium=cpc&utm_campaign=lancement&utm_term=mariage&utm_content=carrousel",
      ),
    ).toEqual({
      utm_source: "facebook",
      utm_medium: "cpc",
      utm_campaign: "lancement",
      utm_term: "mariage",
      utm_content: "carrousel",
    });
  });

  test("ignore les paramètres non UTM", () => {
    expect(parseUtmParams("?utm_source=google&fbclid=abc&page=2")).toEqual({
      utm_source: "google",
    });
  });

  test("retourne un objet vide sans query string", () => {
    expect(parseUtmParams("")).toEqual({});
  });

  test("ignore les valeurs vides ou blanches", () => {
    expect(parseUtmParams("?utm_source=&utm_medium=%20")).toEqual({});
  });

  test("décode les valeurs encodées", () => {
    expect(parseUtmParams("?utm_campaign=t%C3%A9moignage%20mari%C3%A9s")).toEqual({
      utm_campaign: "témoignage mariés",
    });
  });

  test("tronque les valeurs anormalement longues", () => {
    const long = "x".repeat(400);
    const parsed = parseUtmParams(`?utm_content=${long}`);
    expect(parsed.utm_content).toHaveLength(255);
  });
});
