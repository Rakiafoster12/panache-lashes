import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { render } from "../client/src/entry-server";
import { buildHeadTags } from "../client/src/ssr/head";
import {
  BOOKING_URL,
  LOCAL_BUSINESS_JSON_LD,
  ROUTE_SEO,
  SITE_ORIGIN,
  getRouteSeo,
  isKnownPublicRoute,
} from "../shared/site";

const indexableRoutes = Object.values(ROUTE_SEO).filter(
  route => !route.noindex && route.path !== "/404"
);

describe("Panache route SEO", () => {
  it("uses unique, descriptive titles and search snippets for every indexable page", () => {
    const titles = indexableRoutes.map(route => route.title);
    const descriptions = indexableRoutes.map(route => route.description);

    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
    indexableRoutes.forEach(route => {
      expect(route.title.length).toBeGreaterThanOrEqual(30);
      expect(route.title.length).toBeLessThanOrEqual(65);
      expect(route.description.length).toBeGreaterThanOrEqual(100);
      expect(route.description.length).toBeLessThanOrEqual(165);
    });
  });

  it("emits canonical, social, robots, and structured-data tags", () => {
    const head = buildHeadTags(getRouteSeo("/services"));

    expect(head).toContain(`<link rel="canonical" href="${SITE_ORIGIN}/services">`);
    expect(head).toContain('property="og:title"');
    expect(head).toContain('name="twitter:card" content="summary_large_image"');
    expect(head).toContain('name="robots" content="index, follow');
    expect(head).toContain('type="application/ld+json"');
  });

  it("indexes public pages and keeps missing pages out of search results", () => {
    expect(buildHeadTags(getRouteSeo("/privacy"))).toContain("index, follow");
    expect(buildHeadTags(getRouteSeo("/not-a-real-page"))).toContain("noindex, nofollow");
    expect(isKnownPublicRoute("/not-a-real-page")).toBe(false);
  });
});

describe("Panache local business structured data", () => {
  it("contains only confirmed contact, location, and booking facts", () => {
    expect(LOCAL_BUSINESS_JSON_LD["@type"]).toBe("BeautySalon");
    expect(LOCAL_BUSINESS_JSON_LD.telephone).toBe("+1-248-494-8594");
    expect(LOCAL_BUSINESS_JSON_LD.address).toMatchObject({
      streetAddress: "901 Tower Drive, Suite 420",
      addressLocality: "Troy",
      addressRegion: "MI",
      postalCode: "48098",
    });
    expect(LOCAL_BUSINESS_JSON_LD.potentialAction.target).toBe(BOOKING_URL);
    expect(LOCAL_BUSINESS_JSON_LD).not.toHaveProperty("review");
    expect(LOCAL_BUSINESS_JSON_LD).not.toHaveProperty("aggregateRating");
  });
});

describe("search-engine discovery files", () => {
  const publicDir = path.resolve(process.cwd(), "client/public");
  const robots = fs.readFileSync(path.join(publicDir, "robots.txt"), "utf8");
  const sitemap = fs.readFileSync(path.join(publicDir, "sitemap.xml"), "utf8");

  it("publishes an unrestricted robots file with the canonical sitemap", () => {
    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Allow: /");
    expect(robots).toContain(`${SITE_ORIGIN}/sitemap.xml`);
  });

  it("includes every indexable route and excludes utility routes", () => {
    indexableRoutes.forEach(route => {
      const canonical = `${SITE_ORIGIN}${route.path === "/" ? "/" : route.path}`;
      expect(sitemap).toContain(`<loc>${canonical}</loc>`);
    });
    expect(sitemap).not.toContain("/404");
  });
});

describe("Google business presentation", () => {
  const googleReviewsSource = fs.readFileSync(
    path.resolve(process.cwd(), "client/src/components/GoogleReviews.tsx"),
    "utf8"
  );

  it("uses factual editorial fallback copy without operational sync messaging", () => {
    expect(googleReviewsSource).toContain("Verified profile data, refreshed from Google.");
    expect(googleReviewsSource).toContain("Read every client note in its original context");
    expect(googleReviewsSource).not.toContain("Written reviews are syncing from Google");
  });
});

describe("responsive editorial presentation", () => {
  const homeSource = fs.readFileSync(
    path.resolve(process.cwd(), "client/src/pages/Home.tsx"),
    "utf8"
  );
  const layoutSource = fs.readFileSync(
    path.resolve(process.cwd(), "client/src/components/Layout.tsx"),
    "utf8"
  );

  it("provides a dedicated mobile hero contrast layer", () => {
    expect(homeSource).toContain('data-mobile-hero-contrast="true"');
    expect(homeSource).toContain('className="absolute inset-0 sm:hidden"');
  });

  it("exposes responsive navigation state and current-page semantics", () => {
    expect(layoutSource).toContain('aria-expanded={menuOpen}');
    expect(layoutSource).toContain('aria-controls="mobile-navigation"');
    expect(layoutSource).toContain('aria-current={location === link.href ? "page" : undefined}');
    expect(layoutSource).toContain('aria-label="Mobile navigation"');
  });
});

describe("public experience safeguards", () => {
  const mapSource = fs.readFileSync(
    path.resolve(process.cwd(), "client/src/components/GoogleBusinessMap.tsx"),
    "utf8"
  );
  const faqSource = fs.readFileSync(
    path.resolve(process.cwd(), "client/src/pages/FAQ.tsx"),
    "utf8"
  );
  const squareBookingSource = fs.readFileSync(
    path.resolve(process.cwd(), "client/src/components/SquareBooking.tsx"),
    "utf8"
  );
  const homeSource = fs.readFileSync(
    path.resolve(process.cwd(), "client/src/pages/Home.tsx"),
    "utf8"
  );
  const layoutSource = fs.readFileSync(
    path.resolve(process.cwd(), "client/src/components/Layout.tsx"),
    "utf8"
  );
  const aboutSource = fs.readFileSync(
    path.resolve(process.cwd(), "client/src/pages/About.tsx"),
    "utf8"
  );
  const contactSource = fs.readFileSync(
    path.resolve(process.cwd(), "client/src/pages/Contact.tsx"),
    "utf8"
  );
  const policiesSource = fs.readFileSync(
    path.resolve(process.cwd(), "client/src/pages/Policies.tsx"),
    "utf8"
  );
  const servicesSource = fs.readFileSync(
    path.resolve(process.cwd(), "client/src/pages/Services.tsx"),
    "utf8"
  );

  it("provides map loading, error, and direct Google Maps fallback states", () => {
    expect(mapSource).toContain('role="status"');
    expect(mapSource).toContain('role="alert"');
    expect(mapSource).toContain("Open Google Maps");
  });

  it("uses the retained treatment visual for factual appointment-care guidance", () => {
    expect(faqSource).toContain("panache-lash-lift_88756f0b_b409fdc6.jpg");
    expect(faqSource).toContain("Thoughtful care—before, during, and after your visit.");
  });

  it("routes every public booking CTA through the shared Square destination or the intentional booking section", () => {
    const internalBookingCtas = [
      ["shared layout", layoutSource, 3],
      ["homepage", homeSource, 2],
      ["about page", aboutSource, 1],
      ["contact page", contactSource, 2],
    ] as const;

    internalBookingCtas.forEach(([, source, minimumCount]) => {
      expect(source.match(/href="\/services#booking"/g)?.length ?? 0).toBeGreaterThanOrEqual(minimumCount);
    });

    expect(servicesSource).toContain('document.getElementById("booking")?.scrollIntoView');
    expect(servicesSource).toContain('<section id="booking"');
    expect(squareBookingSource).toContain('href={BOOKING_URL}');
    expect(policiesSource).toContain('href={BOOKING_URL}');

    [layoutSource, homeSource, aboutSource, contactSource, policiesSource, servicesSource, squareBookingSource].forEach(source => {
      expect(source).not.toContain("app.squareup.com/appointments/book/");
    });

    expect(BOOKING_URL).toMatch(/^https:\/\/app\.squareup\.com\/appointments\/book\//);
  });

  it("gives the largest homepage image intrinsic dimensions and high fetch priority", () => {
    expect(homeSource).toContain('width="2560"');
    expect(homeSource).toContain('height="1440"');
    expect(homeSource).toContain('fetchPriority="high"');
  });
});

describe("crawler-visible server rendering", () => {
  it.each(indexableRoutes.map(route => [route.path]))(
    "renders meaningful HTML and one primary heading for %s",
    async route => {
      const result = await render(route);
      expect(result.notFound).toBe(false);
      expect(result.html.length).toBeGreaterThan(1_000);
      expect(result.html.match(/<h1\b/g)?.length).toBe(1);
      expect(result.headTags).toContain(getRouteSeo(route).title.replaceAll("&", "&amp;"));
    }
  );

  it("returns a noindex 404 payload for unknown paths", async () => {
    const result = await render("/missing-route");
    expect(result.notFound).toBe(true);
    expect(result.html).toContain("Page Not Found · 404");
    expect(result.headTags).toContain("noindex, nofollow");
  });
});
