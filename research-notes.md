# External Source Notes

## Primary Sources

The migration source is the public GitHub repository [Rakiafoster12/Panache](https://github.com/Rakiafoster12/Panache), reviewed on July 13, 2026. The current public domain is [panachelashes.com](https://panachelashes.com/), which returned the document title “Home” but rendered a blank React root during the initial browser review.

## Repository Findings

The repository README describes Panache Lashes as a private lash studio in Troy, Michigan. It identifies the intended experience as a responsive React and TypeScript website with Square Appointments booking, Google business details and map information, service-selection guidance, preparation and aftercare instructions, FAQs, accessibility information, arrival guidance, policies, and privacy disclosures.

The repository uses React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Wouter, and an Express production server. Its route list is Home, Services, About, Contact, Policies, FAQ, Privacy, and Not Found. The code references a server-side `/api/google-profile` integration that caches Google Places data and keeps the API credential off the browser.

The tracked frontend includes the original business media under `client/public/images/panache/`: `hero.png`, `services-application.png`, `lash-detail.png`, `hybrid-closeup.png`, `lash-lift.png`, `brow-closeup.png`, `logo-black.png`, `logo-white.png`, and `lash-symbol.png`.

## Migration Constraints

The GitHub implementation is the design and content ground truth. Local media files must not remain inside the deployable Manus project; they need durable hosted URLs. The existing Square booking workflow should remain external rather than being replaced with a new commerce system. Google business facts and review content must come from the live Google integration or confirmed repository facts; no ratings, testimonials, or reviews may be fabricated.

## Security Observation

The public repository tracks a `.env.local` file even though the README warns not to commit production credentials. Its value must not be copied into the Manus project or repeated in documentation. The credential should be treated as potentially exposed and rotated in Google Cloud if it is a real key.

## Reverified Google Business Profile

Rakia provided the reverified Google share link [share.google/UY9kH0qs17fJcdjc7](https://share.google/UY9kH0qs17fJcdjc7) on July 15, 2026. The resulting Google knowledge panel and Places response confirm **Panache Lashes**, Place ID `ChIJ7w8KDxTHJIgRdU1oOgqCYSY`, CID `2765634626623393141`, status `OPERATIONAL`, address **901 Tower Dr Suite 420, Troy, MI 48098**, phone **(248) 494-8594**, rating **5.0**, and **17** Google ratings. Google lists Tuesday through Saturday from 10:00 AM to 7:00 PM, with Sunday and Monday closed. The Google Places API began returning the listing after reverification, so the existing server-side Place ID remains correct.
