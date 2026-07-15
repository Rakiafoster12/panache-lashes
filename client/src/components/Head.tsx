import { useEffect } from "react";
import { useLocation } from "wouter";
import { getRouteSeo, SITE_ORIGIN, SOCIAL_IMAGE } from "@shared/site";

function setMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element!.setAttribute(name, value));
}

export function Head() {
  const [location] = useLocation();

  useEffect(() => {
    const meta = getRouteSeo(location);
    const canonical = `${SITE_ORIGIN}${meta.path === "/" ? "" : meta.path}`;
    document.title = meta.title;
    setMeta('meta[name="description"]', { name: "description", content: meta.description });
    setMeta('meta[name="robots"]', {
      name: "robots",
      content: meta.noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    });
    setMeta('meta[property="og:title"]', { property: "og:title", content: meta.title });
    setMeta('meta[property="og:description"]', { property: "og:description", content: meta.description });
    setMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    setMeta('meta[property="og:image"]', { property: "og:image", content: SOCIAL_IMAGE });
    setMeta('meta[name="twitter:title"]', { name: "twitter:title", content: meta.title });
    setMeta('meta[name="twitter:description"]', { name: "twitter:description", content: meta.description });

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
  }, [location]);

  return null;
}
