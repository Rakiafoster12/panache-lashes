export type Service = {
  id: string;
  name: string;
  description: string;
  homeDescription: string;
  durationMinutes: number;
  price: string;
  image: string;
  featured: boolean;
  showInStudioSummary: boolean;
  selectionFinish?: string;
};

// Update this date whenever the website catalog is checked against the public
// Square Appointments menu using docs/SQUARE_SERVICE_ALIGNMENT.md.
export const SERVICE_CATALOG_LAST_VERIFIED = "2026-07-12";

export const SERVICES = [
  {
    id: "refined-edit",
    name: "The Refined Edit",
    description: "Fine classic lashes for soft, weightless definition—a natural, polished finish for the guest who wants to look like herself, refined.",
    homeDescription: "Fine classic lashes for soft, weightless definition and a natural, polished finish.",
    durationMinutes: 120,
    price: "$115",
    image: "/manus-storage/panache-services_4d32fa4e.jpg",
    featured: true,
    showInStudioSummary: true,
    selectionFinish: "Soft · Natural · Defined",
  },
  {
    id: "panache-full-set",
    name: "The Panache Full Set",
    description: "A traditional full set in classic, hybrid, or volume, customized to your eye shape for a neat, clean, uniform finish.",
    homeDescription: "Classic, hybrid, or volume customized to your eye shape with a clean, uniform finish.",
    durationMinutes: 135,
    price: "$175",
    image: "/manus-storage/panache-hybrid-closeup_71943c7a.jpg",
    featured: true,
    showInStudioSummary: true,
    selectionFinish: "Clean · Classic · Full Coverage",
  },
  {
    id: "bespoke-set",
    name: "The Bespoke Set",
    description: "A fully customized, design-led set with texture, dimension, layered spikes, and movement.",
    homeDescription: "A design-led set with texture, dimension, layered spikes, and movement.",
    durationMinutes: 180,
    price: "$225",
    image: "/manus-storage/panache-lash-detail_cffa67f3.jpg",
    featured: true,
    showInStudioSummary: true,
    selectionFinish: "Textured · Wispy · Fully Customized",
  },
  {
    id: "fill",
    name: "The Fill",
    description: "For returning guests every two to three weeks. Gaps are filled and the fullness of your original set is restored.",
    homeDescription: "A two-to-three-week refresh that restores the fullness of your original set.",
    durationMinutes: 90,
    price: "$85",
    image: "/manus-storage/panache-lash-lift_88756f0b.jpg",
    featured: true,
    showInStudioSummary: true,
    selectionFinish: undefined,
  },
  {
    id: "express-fill",
    name: "The Express Fill",
    description: "A quick touch-up for a set that is still mostly full—ideal before an event, trip, or whenever timing calls for a refresh.",
    homeDescription: "A quick touch-up for a set that is still mostly full.",
    durationMinutes: 45,
    price: "$55",
    image: "/manus-storage/panache-hero-v4_2a1c96eb.jpg",
    featured: true,
    showInStudioSummary: true,
    selectionFinish: undefined,
  },
  {
    id: "consultation",
    name: "The Consultation",
    description: "New to Panache or unsure which set is yours? We will identify the look and style that suit your eye shape and lifestyle.",
    homeDescription: "Find the set and style that suit your eye shape and lifestyle.",
    durationMinutes: 20,
    price: "Complimentary",
    image: "/manus-storage/panache-services_4d32fa4e.jpg",
    featured: true,
    showInStudioSummary: false,
    selectionFinish: undefined,
  },
  {
    id: "patch-test",
    name: "Patch Test",
    description: "A precautionary application of 10–20 extensions per eye to confirm your comfort with the adhesive before a full set.",
    homeDescription: "A precautionary adhesive-comfort check before a full set.",
    durationMinutes: 40,
    price: "$40",
    image: "/manus-storage/panache-lash-detail_cffa67f3.jpg",
    featured: false,
    showInStudioSummary: false,
    selectionFinish: undefined,
  },
  {
    id: "lash-extension-removal",
    name: "Lash Extension Removal",
    description: "Gentle, professional removal that protects your natural lashes and eyes.",
    homeDescription: "Gentle professional removal designed to protect natural lashes.",
    durationMinutes: 15,
    price: "$25",
    image: "/manus-storage/panache-lash-detail_cffa67f3.jpg",
    featured: false,
    showInStudioSummary: true,
    selectionFinish: undefined,
  },
] as const satisfies readonly Service[];

export type ServiceId = (typeof SERVICES)[number]["id"];

export const FEATURED_SERVICES = SERVICES.filter(service => service.featured);
export const SERVICE_SELECTION_GUIDE = SERVICES.filter(service => service.selectionFinish);
export const STUDIO_SUMMARY_SERVICES = SERVICES.filter(service => service.showInStudioSummary);

export function serviceHref(service: Pick<Service, "id">) {
  return `/services#service-${service.id}`;
}
