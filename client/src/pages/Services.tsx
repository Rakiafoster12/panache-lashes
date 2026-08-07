/**
 * PANACHE Services — Ivory Atelier (v2 light theme)
 * Editorial hero with scroll parallax, cinematic card reveals, drawn rules.
 * Service cards' Book buttons scroll to Square's live booking widget.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Layout from "@/components/Layout";
import SquareBooking from "@/components/SquareBooking";
import { Reveal, DrawRule, Parallax } from "@/components/motion";
import { SERVICES, SERVICE_SELECTION_GUIDE, type Service } from "@/data/services";

function ServiceCard({ s, onBook, delay, highlighted }: { s: Service; onBook: (id: string) => void; delay: number; highlighted?: boolean }) {
  return (
    <Reveal delay={delay / 1000} y={40} className="flex">
    <div
      id={`service-${s.id}`}
      className="p-8 flex flex-col flex-1 transition-shadow duration-500 hover:shadow-[0_16px_48px_oklch(0.22_0.01_65/0.12)]"
      style={{
        background: "oklch(0.995 0.004 80)",
        border: highlighted ? "1px solid var(--rose-gold)" : "1px solid var(--border)",
        boxShadow: highlighted ? "0 16px 48px oklch(0.62 0.09 40 / 0.22)" : undefined,
        scrollMarginTop: "8rem",
        transition: "border-color 0.6s, box-shadow 0.6s",
      }}
    >
      <div className="flex justify-between items-baseline gap-4 mb-3">
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "1.5rem", color: "var(--charcoal)" }}>
          {s.name}
        </h3>
        <span className="shrink-0" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.1875rem", color: "var(--rose-gold)" }}>
          {s.price}
        </span>
      </div>
      <p className="flex-1" style={{ color: "var(--warm-gray)", fontFamily: "var(--font-sans)", fontSize: "1rem", lineHeight: 1.7 }}>
        {s.description}
      </p>
      <div className="flex items-center justify-between mt-6 pt-5" style={{ borderTop: "1px solid oklch(0.92 0.008 65)" }}>
        <span style={{ color: "oklch(0.58 0.010 60)", fontFamily: "var(--font-sans)", fontSize: "0.9375rem" }}>{s.durationMinutes} min</span>
        <button
          type="button"
          onClick={() => onBook(s.id)}
          className="px-6 py-2.5 transition-all duration-300"
          style={{
            border: "1px solid var(--rose-gold)",
            color: "var(--rose-gold)",
            background: "transparent",
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontWeight: 500,
            fontSize: "1.0625rem",
            letterSpacing: "0.06em", }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--rose-gold)"; (e.currentTarget as HTMLElement).style.color = "oklch(0.99 0.005 80)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--rose-gold)"; }}
        >
          Book This Service →
        </button>
      </div>
    </div>
    </Reveal>
  );
}

export default function Services() {
  const heroRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(heroProgress, [0, 1], ["0%", "20%"]);
  const copyOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);
  const copyY = useTransform(heroProgress, [0, 1], ["0%", "-26%"]);

  const handleBook = (id: string) => {
    setHighlightId(id);
    setTimeout(() => {
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  const [highlightId, setHighlightId] = useState<string | undefined>(undefined);

  // Support deep links: /services#booking and /services#service-<id>
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#booking") {
      setTimeout(() => {
        document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } else if (hash.startsWith("#service-")) {
      const id = hash.slice("#service-".length);
      setHighlightId(id);
      setTimeout(() => {
        document.getElementById(`service-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 250);
      const t = setTimeout(() => setHighlightId(undefined), 3200);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <Layout>
      <div>
        {/* ── HERO — full-bleed image, cream gradient wash (matches Home hero) ── */}
        <section ref={heroRef} className="relative overflow-hidden" style={{ minHeight: "58vh" }}>
          <div className="absolute inset-0">
            <motion.img
              src="/images/panache/services-application.png"
              alt="PANACHE lash artist applying extensions with precision"
              width="2304"
              height="1536"
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover object-center"
              style={reduced ? undefined : { y: imgY, scale: 1.08 }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, oklch(0.955 0.018 80 / 0.97) 0%, oklch(0.955 0.018 80 / 0.9) 34%, oklch(0.955 0.018 80 / 0.45) 60%, oklch(0.955 0.018 80 / 0.05) 85%)",
              }}
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-6 lg:px-12 flex items-center" style={{ minHeight: "58vh" }}>
            <motion.div
              className="max-w-xl py-16"
              style={reduced ? undefined : { opacity: copyOpacity, y: copyY }}
              initial={reduced ? undefined : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
            >
              <p className="label-caps mb-6" style={{ marginLeft: "0.2em" }}>PANACHE® Studio · Service Menu</p>
              <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(3.15rem, 7vw, 5.25rem)", lineHeight: 1.03, color: "var(--charcoal)", overflowWrap: "normal", wordBreak: "keep-all", textWrap: "balance", paddingBottom: "0.08em" }}>
                Lash Extension <em style={{ color: "var(--rose-gold)" }}>Services in Troy</em>
              </h1>
              <DrawRule className="my-7" />
              <p className="lede max-w-lg">
                Explore classic lash extensions, hybrid lash extensions, volume lash extensions,
                wispy or bespoke lash extensions, lash fills, and professional lash extension
                removal below. Select a service to book directly—or continue to the live booking
                calendar to compare options. Every appointment is private, by reservation, and
                centered on one client at a time.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── LASH SERVICES ── */}
        {/* Hero-style blend: lash macro bleeds off the right edge and feathers
            into the blush canvas — mirrors Home's Experience treatment */}
        <section className="relative overflow-hidden" style={{ background: "var(--blush-cream)" }}>
          <div className="hidden lg:block absolute top-0 right-0 overflow-hidden" style={{ width: "34%", height: "24rem" }} aria-hidden>
            <img
              src="/images/panache/lash-detail.png"
              alt=""
              width="2176"
              height="1632"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 30%" }}
              draggable={false}
            />
            {/* Feather: image dissolves into the blush canvas */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(270deg, oklch(0.955 0.018 80 / 0.1) 0%, oklch(0.955 0.018 80 / 0.3) 32%, oklch(0.955 0.018 80 / 0.72) 62%, var(--blush-cream) 90%, var(--blush-cream) 100%)",
              }}
            />
            <div
              className="absolute inset-x-0 top-0 h-20"
              style={{ background: "linear-gradient(180deg, var(--blush-cream), oklch(0.955 0.018 80 / 0))" }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-28"
              style={{ background: "linear-gradient(0deg, var(--blush-cream), oklch(0.955 0.018 80 / 0))" }}
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
            <Reveal className="mb-10">
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2rem, 3.5vw, 2.75rem)", color: "var(--charcoal)" }}>
                Lash <em style={{ color: "var(--rose-gold)" }}>Services</em>
              </h2>
              <DrawRule className="mt-5" />
            </Reveal>

            <Reveal className="mb-10" y={28}>
              <div className="p-6 sm:p-8" style={{ background: "var(--ivory)", border: "1px solid var(--border)" }}>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6">
                  <div>
                    <p className="label-caps mb-2">A Simple Guide</p>
                    <h3 style={{ color: "var(--charcoal)", fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Which set is yours?</h3>
                  </div>
                  <p style={{ color: "var(--warm-gray)", fontFamily: "var(--font-sans)", fontSize: "0.9375rem" }}>Start with the finish you want.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "var(--border)" }}>
                  {SERVICE_SELECTION_GUIDE.map((service) => (
                    <a key={service.id} href={`#service-${service.id}`} className="group p-5 sm:p-6 transition-colors duration-300" style={{ background: "oklch(0.995 0.004 80)" }}>
                      <h4 style={{ color: "var(--charcoal)", fontSize: "1.125rem" }}>{service.name}</h4>
                      <p className="mt-2" style={{ color: "var(--rose-gold)", fontFamily: "var(--font-label)", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>{service.selectionFinish}</p>
                      <span className="inline-block mt-4 transition-transform duration-300 group-hover:translate-x-1" style={{ color: "var(--warm-gray)", fontFamily: "var(--font-sans)", fontSize: "0.875rem" }}>View service →</span>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SERVICES.map((s, i) => (
                <ServiceCard key={s.id} s={s} onBook={handleBook} delay={i * 60} highlighted={highlightId === s.id} />
              ))}
            </div>
          </div>
        </section>

        {/* ── EDITORIAL BRIDGE — dark anchor band ── */}
        <section style={{ background: "oklch(0.14 0.01 300)" }}>
          <Reveal className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-8">
            <blockquote style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(1.5rem, 2.8vw, 2.125rem)", lineHeight: 1.4, color: "oklch(0.94 0.008 70)", maxWidth: "42rem" }}>
              "Every session is crafted around you — never rushed, always intentional."
            </blockquote>
            <button
              type="button"
              onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
              className="shrink-0 px-10 py-4 transition-all duration-300"
              style={{
                background: "var(--rose-gold)",
                color: "oklch(0.99 0.005 80)",
                fontFamily: "var(--font-display)", fontStyle: "italic",
                fontWeight: 500,
                fontSize: "0.9375rem",
                letterSpacing: "0.06em", border: "1px solid var(--rose-gold)",
                cursor: "pointer",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--rose-gold)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--rose-gold)"; (e.currentTarget as HTMLElement).style.color = "oklch(0.99 0.005 80)"; }}
            >
              Book Your Session →
            </button>
          </Reveal>
        </section>

        {/* ── BOOKING ── */}
        <section id="booking" style={{ background: "var(--blush-cream)", scrollMarginTop: "7rem" }}>
          <div className="max-w-5xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
            <Reveal className="text-center mb-12">
              <p className="label-caps mb-5" style={{ marginLeft: "0.2em" }}>Reservations</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2.25rem, 4vw, 3.25rem)", color: "var(--charcoal)" }}>
                Book your <em style={{ color: "var(--rose-gold)" }}>appointment</em>
              </h2>
              <DrawRule className="mx-auto my-6" center />
              <p className="lede max-w-2xl mx-auto">
                Open Tuesday through Saturday, 10 AM – 7 PM · Troy, Michigan.
                A deposit may be required to secure your session.
              </p>
            </Reveal>
            <Reveal delay={0.1} y={44}>
            <SquareBooking />
            </Reveal>
          </div>
        </section>
      </div>
    </Layout>
  );
}
