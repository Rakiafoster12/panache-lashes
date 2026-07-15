# Panache Lashes Validation Notes

## Full-page visual pass — July 15, 2026

All seven public routes were captured at **1440 × 900** and **390 × 844**: Home, Services, About, Contact, Policies, FAQ, and Privacy.

The desktop layouts preserve the Codex-built editorial hierarchy, page-specific active navigation, service pricing cards, Square booking calls to action, business details, policy content, FAQ controls, and privacy content. No horizontal overflow or overlapping primary content was visible.

The mobile layouts switch to the compact menu, stack cards and content into readable single-column flows, retain visible booking calls to action, and preserve footer links and business details. No horizontal overflow was visible at 390 pixels.

The full-page mobile Contact screenshot showed the map container before map tiles appeared. The map uses an intentionally lazy-loaded Google Maps iframe, and full-page capture does not scroll the iframe into the active viewport. Current network logs contain no failed requests. A focused in-viewport capture is still required before treating this as a visual defect.

Focused mobile validation at 390 × 2200 confirmed that the lazy Google Maps iframe renders normally once it is inside the viewport, including the correct Panache Lashes map pin. The earlier empty full-page capture was therefore a capture/lazy-loading interaction, not an application defect.

The final post-reverification Google response exposes the verified business name, Troy address, phone, hours, Maps link, a 5.0 rating, a 17-review count, and five genuine review objects with written text. A privacy-preserving aggregate check confirmed five review objects and five non-empty written-review fields without printing customer content. The website renders only this live Google data and does not seed, hardcode, rewrite, or fabricate testimonials.

The source audit confirmed that the homepage does contain one semantic `h1`; the first grep missed it because the opening tag spans multiple lines. All user-facing page components contain one primary heading. External links that open a new tab include safe `rel` attributes. Repeated Framer Motion target-position warnings were traced to generic parallax wrappers and fixed without changing already positioned callers.

The original black and white wordmark storage objects later returned 403 responses even though the storage proxy still issued redirects. Both original files were re-uploaded to new durable storage paths. Direct follow-through requests now return 200 image/png, and the mobile homepage confirms the black header and white footer wordmarks render correctly.

Final accessibility source validation found no click handlers attached to non-native `div`, `span`, `p`, or `img` elements. The contact and directions forms use programmatic labels, the mobile menu is a native button, and the menu now publishes `aria-expanded`, `aria-controls`, a descriptive open/close label, an identified navigation region, and `aria-current` on active links. A dedicated narrow-screen cream wash was added to the homepage hero after the 390-pixel capture identified insufficient body-copy contrast over the portrait.

The corrected 390 × 844 homepage capture confirms the mobile wash preserves the portrait while restoring readable contrast for the eyebrow, headline, body copy, and primary booking action. A final tablet-width capture also confirms that the live Google trust section, written-review cards, navigation, and footer remain readable without horizontal overflow.

The retained lash-treatment photograph was re-uploaded to durable project storage after the original hosted object failed in the FAQ capture. Focused FAQ verification confirms the replacement image now renders in the appointment-care section. Contact-page verification confirms the lazy map loads when scrolled into view, while the component also exposes an explicit loading state, embedded-map error state, and direct Google Maps fallback.

All external Square links now use the single `BOOKING_URL` constant in `shared/site.ts`. Regression coverage enumerates the shared layout, Home, About, Contact, Policies, Services, and the Square booking component, proving each call to action either uses the shared external destination or intentionally routes to `/services#booking`. A real browser reached Square’s security-verification interstitial at the expected appointment URL; this is consistent with Square protecting the booking flow from automated traffic, so a manual launch-day click remains part of owner acceptance.

## Final release gate — July 15, 2026

| Verification | Result |
|---|---|
| Vitest | 23 assertions passed across three test files |
| TypeScript | `tsc --noEmit` passed |
| Client production build | Passed |
| SSR production build | Passed |
| Server bundle | Passed |
| Public route crawl | Home, Services, About, Contact, Policies, FAQ, and Privacy returned HTTP 200 |
| Discovery files | `robots.txt` and `sitemap.xml` returned HTTP 200; the sitemap includes all seven canonical routes |
| Unknown route | Returned HTTP 404 with `noindex, nofollow` metadata |
| Current browser console | No errors found |
| Current network log | No HTTP 4xx or 5xx requests found |

The client build reports one non-blocking Vite chunk-size advisory for the main JavaScript bundle. This does not fail the build. The latest runtime-log audit found only historical startup and pre-reverification Google errors from earlier iterations; no current browser-console or network failures were present after the final route crawl.
