const PLACE_ID = "ChIJ7w8KDxTHJIgRdU1oOgqCYSY";
const GOOGLE_PLACES_URL = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
const FRESH_CACHE_MS = 6 * 60 * 60 * 1000;
const REVIEWS_PENDING_CACHE_MS = 10 * 60 * 1000;
const STALE_CACHE_MS = 7 * 24 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 5_000;
const MAX_ATTEMPTS = 3;

const FIELD_MASK = [
  "displayName",
  "formattedAddress",
  "rating",
  "userRatingCount",
  "googleMapsUri",
  "nationalPhoneNumber",
  "regularOpeningHours",
  "reviews",
].join(",");

type GoogleText = {
  text: string;
  languageCode?: string;
};

type GoogleReview = {
  rating: number;
  text?: GoogleText;
  relativePublishTimeDescription: string;
  googleMapsUri: string;
  authorAttribution: {
    displayName: string;
    uri: string;
    photoUri?: string;
  };
};

export type GoogleProfile = {
  displayName: GoogleText;
  formattedAddress: string;
  nationalPhoneNumber: string;
  rating: number;
  userRatingCount: number;
  googleMapsUri: string;
  regularOpeningHours?: unknown;
  reviews?: GoogleReview[];
};

type CacheEntry = {
  freshUntil: number;
  staleUntil: number;
  value: GoogleProfile;
};

let cache: CacheEntry | undefined;
let inFlightRequest: Promise<GoogleProfile> | undefined;

class PermanentGoogleError extends Error {}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

function isText(value: unknown): value is GoogleText {
  return isRecord(value) && typeof value.text === "string" && value.text.length > 0;
}

function isAuthor(value: unknown): value is GoogleReview["authorAttribution"] {
  return (
    isRecord(value) &&
    typeof value.displayName === "string" &&
    typeof value.uri === "string" &&
    (value.photoUri === undefined || typeof value.photoUri === "string")
  );
}

function isReview(value: unknown): value is GoogleReview {
  return (
    isRecord(value) &&
    typeof value.rating === "number" &&
    Number.isFinite(value.rating) &&
    (value.text === undefined || isText(value.text)) &&
    typeof value.relativePublishTimeDescription === "string" &&
    typeof value.googleMapsUri === "string" &&
    isAuthor(value.authorAttribution)
  );
}

function validateProfile(value: unknown): GoogleProfile {
  if (
    !isRecord(value) ||
    !isText(value.displayName) ||
    typeof value.formattedAddress !== "string" ||
    typeof value.nationalPhoneNumber !== "string" ||
    typeof value.rating !== "number" ||
    !Number.isFinite(value.rating) ||
    typeof value.userRatingCount !== "number" ||
    !Number.isInteger(value.userRatingCount) ||
    typeof value.googleMapsUri !== "string" ||
    (value.reviews !== undefined && (!Array.isArray(value.reviews) || !value.reviews.every(isReview)))
  ) {
    throw new Error("Google Places returned an invalid business profile");
  }

  return value as GoogleProfile;
}

function isRetryableStatus(status: number) {
  return status === 408 || status === 429 || status >= 500;
}

function retryDelay(attempt: number, retryAfter: string | null) {
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds)) return Math.min(seconds * 1000, 2_000);
  }
  return 250 * 2 ** attempt;
}

function wait(milliseconds: number) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function requestGoogleProfile(apiKey: string): Promise<GoogleProfile> {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(GOOGLE_PLACES_URL, {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": FIELD_MASK,
        },
        signal: controller.signal,
      });

      if (response.ok) {
        try {
          return validateProfile(await response.json());
        } catch (error) {
          throw new PermanentGoogleError(
            error instanceof Error ? error.message : "Google Places returned an invalid response",
          );
        }
      }

      const error = new Error(`Google Places request failed (${response.status})`);
      if (!isRetryableStatus(response.status)) throw new PermanentGoogleError(error.message);
      if (attempt === MAX_ATTEMPTS - 1) throw error;

      lastError = error;
      await wait(retryDelay(attempt, response.headers.get("retry-after")));
    } catch (error) {
      lastError = error;
      if (error instanceof PermanentGoogleError) throw error;
      if (attempt === MAX_ATTEMPTS - 1) break;
      await wait(retryDelay(attempt, null));
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Google Places request failed");
}

export async function getGoogleProfile(apiKey: string): Promise<GoogleProfile> {
  const now = Date.now();
  if (cache && cache.freshUntil > now) return cache.value;
  if (!apiKey) {
    if (cache && cache.staleUntil > now) return cache.value;
    throw new Error("Google Places API key is not configured");
  }

  if (!inFlightRequest) {
    inFlightRequest = requestGoogleProfile(apiKey)
      .then(value => {
        const cachedAt = Date.now();
        cache = {
          freshUntil:
            cachedAt + (value.reviews?.length ? FRESH_CACHE_MS : REVIEWS_PENDING_CACHE_MS),
          staleUntil: cachedAt + STALE_CACHE_MS,
          value,
        };
        return value;
      })
      .finally(() => {
        inFlightRequest = undefined;
      });
  }

  try {
    return await inFlightRequest;
  } catch (error) {
    if (cache && cache.staleUntil > Date.now()) {
      console.warn("Serving stale Google business profile after refresh failure");
      return cache.value;
    }
    throw error;
  }
}
