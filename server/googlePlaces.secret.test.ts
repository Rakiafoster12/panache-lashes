import { describe, expect, it } from "vitest";
import { getGoogleProfile } from "./googlePlaces";

describe("GOOGLE_PLACES_API_KEY", () => {
  it(
    "authenticates with Places API and returns the PANACHE LASHES business profile",
    async () => {
      const apiKey = process.env.GOOGLE_PLACES_API_KEY;
      expect(apiKey, "GOOGLE_PLACES_API_KEY must be configured server-side").toBeTruthy();

      const profile = await getGoogleProfile(apiKey!);

      expect(profile.displayName.text).toMatch(/panache lashes/i);
      expect(profile.formattedAddress).toMatch(/Troy, MI/i);
      expect(profile.googleMapsUri).toMatch(/^https:\/\//);
      expect(profile.rating).toBeGreaterThan(0);
      expect(profile.userRatingCount).toBeGreaterThan(0);
      if (profile.reviews !== undefined) {
        expect(profile.reviews).toEqual(expect.any(Array));
      }
    },
    20_000,
  );
});
