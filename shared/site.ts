export const SITE_NAME = "Panache Lashes";
export const SITE_ORIGIN = "https://panachelashes.com";
export const SITE_DESCRIPTION =
  "Private lash studio in Troy, Michigan specializing in custom lash extensions, lash lifts, and brow services in a calm one-on-one setting.";
export const BOOKING_URL =
  "https://app.squareup.com/appointments/book/p6qbb24g2jl9v7/SMVH39DTRX7YB/start";
export const GOOGLE_PROFILE_URL = "https://share.google/UY9kH0qs17fJcdjc7";
export const INSTAGRAM_URL = "https://www.instagram.com/panachelashes";
export const SOCIAL_IMAGE =
  `${SITE_ORIGIN}/manus-storage/panache-hero-v4_2a1c96eb_ff31dd1d.jpg`;
export const LOGO_IMAGE =
  `${SITE_ORIGIN}/manus-storage/panache-logo-black-trimmed_b79f88ee.png`;

export type RouteSeo = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
};

export const ROUTE_SEO: Record<string, RouteSeo> = {
  "/": {
    title: "Luxury Lash Extensions in Troy, MI | Panache Lashes",
    description:
      "Visit Panache Lashes, a private Troy, MI lash studio for custom classic, hybrid, and volume extensions, lash lifts, and brow services.",
    path: "/",
  },
  "/services": {
    title: "Lash Services & Pricing in Troy, MI | Panache Lashes",
    description:
      "Explore custom lash extensions, fills, lash lifts, brow services, timing, pricing, and appointment guidance at Panache Lashes in Troy, Michigan.",
    path: "/services",
  },
  "/about": {
    title: "About Our Private Troy Lash Studio | Panache Lashes",
    description:
      "Learn about the one-on-one artistry, thoughtful consultations, and calm private-studio experience behind Panache Lashes in Troy, Michigan.",
    path: "/about",
  },
  "/contact": {
    title: "Contact & Visit Panache Lashes in Troy, MI",
    description:
      "Find Panache Lashes at 901 Tower Drive, Suite 420 in Troy, MI. View hours, parking and arrival guidance, accessibility details, and booking links.",
    path: "/contact",
  },
  "/policies": {
    title: "Appointment & Booking Policies | Panache Lashes",
    description:
      "Review Panache Lashes appointment, rescheduling, late-arrival, guest, preparation, and aftercare policies before booking your Troy studio visit.",
    path: "/policies",
  },
  "/faq": {
    title: "Lash Extension FAQ & Aftercare | Panache Lashes",
    description:
      "Get answers about lash extensions, fills, retention, preparation, aftercare, lash lifts, and choosing a service at Panache Lashes in Troy, MI.",
    path: "/faq",
  },
  "/privacy": {
    title: "Privacy Notice | Panache Lashes",
    description:
      "Read how Panache Lashes handles website analytics, appointment links, contact-form details, and other information shared through this site.",
    path: "/privacy",
  },
  "/404": {
    title: "Page Not Found | Panache Lashes",
    description: "The requested Panache Lashes page could not be found.",
    path: "/404",
    noindex: true,
  },
};

export function normalizePath(input: string) {
  const pathname = input.split(/[?#]/, 1)[0] || "/";
  return pathname === "/" ? "/" : pathname.replace(/\/+$/, "") || "/";
}

export function getRouteSeo(input: string): RouteSeo {
  const path = normalizePath(input);
  return ROUTE_SEO[path] ?? {
    ...ROUTE_SEO["/404"],
    path,
  };
}

export function isKnownPublicRoute(input: string) {
  return Object.prototype.hasOwnProperty.call(ROUTE_SEO, normalizePath(input));
}

export const LOCAL_BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  "@id": `${SITE_ORIGIN}/#business`,
  name: SITE_NAME,
  url: SITE_ORIGIN,
  image: SOCIAL_IMAGE,
  logo: LOGO_IMAGE,
  telephone: "+1-248-494-8594",
  email: "info@panachelashes.com",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "901 Tower Drive, Suite 420",
    addressLocality: "Troy",
    addressRegion: "MI",
    postalCode: "48098",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "City",
    name: "Troy, Michigan",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "19:00",
    },
  ],
  sameAs: [GOOGLE_PROFILE_URL, INSTAGRAM_URL],
  potentialAction: {
    "@type": "ReserveAction",
    target: BOOKING_URL,
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Lash and brow services",
    itemListElement: [
      "Classic lash extensions",
      "Hybrid lash extensions",
      "Volume lash extensions",
      "Lash fills",
      "Lash lifts",
      "Brow services",
    ].map(name => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name },
    })),
  },
};
