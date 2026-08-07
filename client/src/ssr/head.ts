import {
  LOCAL_BUSINESS_JSON_LD,
  SITE_NAME,
  SITE_ORIGIN,
  SOCIAL_IMAGE,
  type RouteSeo,
} from "@shared/site";

const escapeText = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const escapeAttr = (value: string) =>
  escapeText(value).replaceAll('"', "&quot;").replaceAll("'", "&#39;");

export function safeJson(value: unknown) {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
}

export function buildHeadTags(meta: RouteSeo) {
  const canonical = `${SITE_ORIGIN}${meta.path === "/" ? "" : meta.path}`;
  const robots = meta.noindex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": meta.path === "/" ? "WebSite" : "WebPage",
    name: meta.path === "/" ? SITE_NAME : meta.title,
    description: meta.description,
    url: canonical,
    isPartOf: meta.path === "/" ? undefined : { "@type": "WebSite", name: SITE_NAME, url: SITE_ORIGIN },
  };
  const schemas = meta.path === "/" ? [pageSchema, LOCAL_BUSINESS_JSON_LD] : [pageSchema];

  return [
    `<title>${escapeText(meta.title)}</title>`,
    `<meta name="description" content="${escapeAttr(meta.description)}">`,
    `<meta name="robots" content="${robots}">`,
    `<link rel="canonical" href="${escapeAttr(canonical)}">`,
    `<meta property="og:site_name" content="${escapeAttr(SITE_NAME)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${escapeAttr(meta.title)}">`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}">`,
    `<meta property="og:url" content="${escapeAttr(canonical)}">`,
    `<meta property="og:image" content="${escapeAttr(SOCIAL_IMAGE)}">`,
    `<meta property="og:image:alt" content="Panache Lashes private lash studio in Troy, Michigan">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}">`,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}">`,
    `<meta name="twitter:image" content="${escapeAttr(SOCIAL_IMAGE)}">`,
    `<script type="application/ld+json">${safeJson(schemas)}</script>`,
  ].join("\n");
}
