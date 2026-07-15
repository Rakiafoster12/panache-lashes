/**
 * PANACHE — Center-focus service carousel (Ivory Atelier)
 * Swipe/drag horizontal scroller with scroll-snap; the card nearest the
 * viewport center scales up and brightens, neighbors sit smaller and dimmed.
 * No scroll hijack: vertical scrolling is never blocked. Arrow buttons on
 * desktop, free swipe on touch. Respects prefers-reduced-motion.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useReducedMotion } from "framer-motion";

export interface CarouselService {
  num: string;
  name: string;
  desc: string;
  price: string;
  href: string;
  img: string;
}

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

export default function ServiceCarousel({ services }: { services: CarouselService[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const raf = useRef<number>(0);

  /* Measure each card's distance from viewport center and set scale/opacity */
  const update = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const rect = scroller.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    let best = 0;
    let bestDist = Infinity;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const r = card.getBoundingClientRect();
      const cardCenter = r.left + r.width / 2;
      const dist = Math.abs(cardCenter - center);
      if (dist < bestDist) { bestDist = dist; best = i; }
      // Normalized distance: 0 at center → 1 at one card-width away
      const n = Math.min(1, dist / (r.width * 1.05));
      const scale = reduced ? 1 : 1 - n * 0.13;      // 1.0 center → 0.87 edges
      const dim = reduced ? 1 : 1 - n * 0.45;        // brightness falloff
      card.style.transform = `scale(${scale})`;
      card.style.opacity = String(1 - n * 0.25);
      const img = card.querySelector("img");
      if (img) (img as HTMLElement).style.filter = `brightness(${0.72 + dim * 0.28}) saturate(${0.85 + dim * 0.15})`;
    });
    setActive(best);
  }, [reduced]);

  const onScroll = useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(update);
  }, [update]);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    const t = setTimeout(update, 500); // after images size in
    return () => { window.removeEventListener("resize", update); clearTimeout(t); cancelAnimationFrame(raf.current); };
  }, [update]);

  const scrollToCard = (i: number) => {
    const card = cardRefs.current[i];
    const scroller = scrollerRef.current;
    if (!card || !scroller) return;
    const target = card.offsetLeft - (scroller.clientWidth - card.clientWidth) / 2;
    scroller.scrollTo({ left: target, behavior: reduced ? "auto" : "smooth" });
  };

  const arrowStyle: React.CSSProperties = {
    width: "3rem",
    height: "3rem",
    borderRadius: "50%",
    border: "1px solid oklch(0.78 0.012 65)",
    background: "oklch(0.99 0.005 80 / 0.9)",
    color: "var(--charcoal)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.125rem",
    cursor: "pointer",
    transition: `all 0.25s ${EASE}`,
  };

  return (
    <div className="relative">
      {/* Scroller — snap to center, free swipe/drag, never blocks vertical scroll */}
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="flex overflow-x-auto no-scrollbar"
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          gap: "clamp(1rem, 2.5vw, 2.5rem)",
          paddingTop: "1.5rem",
          paddingBottom: "2.5rem",
          // side padding so first/last cards can reach center
          paddingLeft: "max(1.5rem, calc(50vw - min(38vw, 26rem) / 2 - 0.75rem))",
          paddingRight: "max(1.5rem, calc(50vw - min(38vw, 26rem) / 2 - 0.75rem))",
        }}
      >
        {services.map((s, i) => (
          <div
            key={s.num}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="shrink-0"
            style={{
              scrollSnapAlign: "center",
              width: "min(38vw, 26rem)",
              minWidth: "17rem",
              transition: reduced ? undefined : `transform 0.15s linear, opacity 0.15s linear`,
              willChange: "transform, opacity",
            }}
          >
            <Link
              href={s.href}
              className="group relative block overflow-hidden"
              style={{ height: "clamp(24rem, 56vh, 32rem)" }}
              onClick={(e) => {
                // First tap on a non-centered card centers it instead of navigating
                if (i !== active) { e.preventDefault(); scrollToCard(i); }
              }}
            >
              <img
                src={s.img}
                alt={s.name}
                className="absolute inset-0 w-full h-full object-cover transition-[filter] duration-300"
                draggable={false}
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, oklch(0.14 0.01 300 / 0.74) 0%, oklch(0.14 0.01 300 / 0.18) 46%, transparent 70%)" }} />
              <span
                aria-hidden
                style={{
                  position: "absolute", top: "0.75rem", right: "1.25rem",
                  fontFamily: "var(--font-display)", fontStyle: "italic",
                  fontSize: "clamp(4rem, 6vw, 6rem)", lineHeight: 1,
                  color: "oklch(0.99 0.005 80)", opacity: 0.22, pointerEvents: "none",
                }}
              >
                {s.num}
              </span>
              <div className="absolute bottom-0 p-7">
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "1.625rem", color: "oklch(0.99 0.005 80)" }}>{s.name}</h3>
                <p className="mt-2" style={{ color: "oklch(0.90 0.010 70)", fontFamily: "var(--font-sans)", fontSize: "0.9375rem", lineHeight: 1.6 }}>{s.desc}</p>
                <p className="mt-3" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.125rem", color: "var(--rose-gold)" }}>
                  {s.price}
                  <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ fontFamily: "var(--font-sans)", fontStyle: "normal", fontWeight: 600, fontSize: "0.875rem" }}>Book →</span>
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Controls: arrows (desktop) + dots */}
      <div className="flex items-center justify-center gap-6 mt-2">
        <button
          aria-label="Previous service"
          className="hidden md:flex"
          style={arrowStyle}
          onClick={() => scrollToCard(Math.max(0, active - 1))}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--rose-gold)"; e.currentTarget.style.color = "var(--rose-gold)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "oklch(0.78 0.012 65)"; e.currentTarget.style.color = "var(--charcoal)"; }}
        >
          ←
        </button>
        <div className="flex items-center gap-2.5">
          {services.map((s, i) => (
            <button
              key={s.num}
              aria-label={`Go to ${s.name}`}
              onClick={() => scrollToCard(i)}
              style={{
                width: i === active ? "1.75rem" : "0.4rem",
                height: "0.4rem",
                borderRadius: "999px",
                background: i === active ? "var(--rose-gold)" : "oklch(0.80 0.02 55)",
                transition: `all 0.35s ${EASE}`,
                cursor: "pointer",
                border: "none",
                padding: 0,
              }}
            />
          ))}
        </div>
        <button
          aria-label="Next service"
          className="hidden md:flex"
          style={arrowStyle}
          onClick={() => scrollToCard(Math.min(services.length - 1, active + 1))}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--rose-gold)"; e.currentTarget.style.color = "var(--rose-gold)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "oklch(0.78 0.012 65)"; e.currentTarget.style.color = "var(--charcoal)"; }}
        >
          →
        </button>
      </div>
    </div>
  );
}
