/**
 * PANACHE Home — Ivory Atelier (v2 light theme)
 * Warm ivory canvas, charcoal ink, rose-gold accent. Asymmetric editorial layout.
 * Scroll story: parallax hero portrait, masked headline reveal, cinematic
 * section reveals, count-up atelier numbers, drawn rules. Motion is editorial
 * and restrained — cubic-bezier(0.23,1,0.32,1), never bouncy.
 */
import { useRef } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Layout from "@/components/Layout";
import { Reveal, LineReveal, ScaleImage, CountUp, DrawRule, Parallax, GhostNumeral, MarqueeBand } from "@/components/motion";
import ServiceCarousel from "@/components/ServiceCarousel";
import GoogleReviews from "@/components/GoogleReviews";
import { FEATURED_SERVICES, serviceHref } from "@/data/services";

const SIGNATURE_SERVICES = FEATURED_SERVICES.map((service, index) => ({
  ...service,
  num: String(index + 1).padStart(2, "0"),
  desc: service.homeDescription,
  href: serviceHref(service),
  img: service.image,
}));

const ATELIER_NUMBERS = [
  { value: 8, suffix: "", label: "Signature lash services", note: "From consultations to bespoke sets" },
  { value: 1, suffix: "", label: "Client at a time", note: "Private studio, undivided attention" },
  { value: 120, suffix: "+", label: "Minutes per volume set", note: "Never rushed, always mapped" },
  { value: 2020, suffix: "", label: "Established", note: "Troy, Michigan" },
];

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  // Parallax: portrait drifts slower than the page; copy drifts slightly faster and fades
  const imgY = useTransform(heroProgress, [0, 1], ["0%", "18%"]);
  const imgScale = useTransform(heroProgress, [0, 1], [1, 1.08]);
  const copyY = useTransform(heroProgress, [0, 1], ["0%", "-30%"]);
  const copyOpacity = useTransform(heroProgress, [0, 0.65], [1, 0]);

  return (
    <Layout>
      <div>
        {/* ── HERO — full-bleed portrait behind the entire section ── */}
        <section ref={heroRef} className="relative overflow-hidden" style={{ background: "var(--ivory)" }}>
          {/* Full-bleed background image */}
          <div className="absolute inset-0">
            <motion.img
              src="/images/panache/hero.png"
              alt="Close-up editorial portrait showcasing dimensional custom lash extensions by PANACHE LASHES"
              width="2560"
              height="1440"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-right"
              style={reduced ? undefined : { y: imgY, scale: imgScale }}
            />
            {/* Cream gradient overlay: strong on the left for headline legibility, clear on the right for the portrait */}
            <div
              className="absolute inset-0 hidden sm:block"
              style={{
                background:
                  "linear-gradient(to right, oklch(0.955 0.018 80 / 0.96) 0%, oklch(0.955 0.018 80 / 0.86) 34%, oklch(0.955 0.018 80 / 0.35) 58%, oklch(0.955 0.018 80 / 0) 78%)",
              }}
            />
            {/* Mobile copy spans more of the portrait, so use a stronger uniform wash for accessible contrast. */}
            <div
              className="absolute inset-0 sm:hidden"
              data-mobile-hero-contrast="true"
              style={{
                background:
                  "linear-gradient(to bottom, oklch(0.955 0.018 80 / 0.88) 0%, oklch(0.955 0.018 80 / 0.74) 58%, oklch(0.955 0.018 80 / 0.86) 100%)",
              }}
            />
            {/* Bottom fade into the next section */}
            <div
              className="absolute inset-x-0 bottom-0 h-24"
              style={{ background: "linear-gradient(to bottom, transparent, oklch(0.925 0.022 60 / 0.55))" }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-12 flex items-center" style={{ minHeight: "min(88vh, 820px)" }}>
            <motion.div
              className="max-w-xl py-20 lg:py-28"
              style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}
            >
              <motion.p
                className="label-caps mb-6"
                style={{ marginLeft: "0.2em" }}
                initial={reduced ? undefined : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
              >
                Troy, Michigan · Est. 2020
              </motion.p>
              <h1
                style={{
                  fontFamily: "var(--font-label)",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: "clamp(3.15rem, 7vw, 6.25rem)",
                  lineHeight: 0.98,
                  color: "var(--charcoal)",
                  overflowWrap: "normal",
                  wordBreak: "keep-all",
                  textWrap: "balance",
                  paddingBottom: "0.08em",
                }}
              >
                <LineReveal
                  delay={0.25}
                  onMount
                  lineStyle={{ paddingBottom: "0.12em", marginBottom: "-0.1em" }}
                  lines={[
                    <>Every lash,</>,
                    <em key="i" style={{ color: "var(--rose-gold)", display: "block", fontFamily: "var(--font-label)", fontStyle: "italic", fontWeight: 400, marginTop: "-0.02em" }}>intentional.</em>,
                  ]}
                />
              </h1>
              <DrawRule className="my-8" />
              <motion.p
                className="lede max-w-md"
                initial={reduced ? undefined : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
              >
                PANACHE® is a private lash atelier where precision meets artistry.
                Custom extensions, fills, and thoughtful aftercare — rendered one client at a time.
              </motion.p>
              <motion.div
                className="flex flex-wrap gap-4 mt-10"
                initial={reduced ? undefined : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.78, ease: [0.23, 1, 0.32, 1] }}
              >
                <Link
                  href="/services#booking"
                  className="px-9 py-4 transition-all duration-300"
                  style={{
                    background: "var(--rose-gold)",
                    color: "oklch(0.99 0.005 80)",
                    fontFamily: "var(--font-display)", fontStyle: "italic",
                    fontWeight: 500,
                    fontSize: "0.9375rem",
                    letterSpacing: "0.06em", border: "1px solid var(--rose-gold)",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--rose-gold)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--rose-gold)"; (e.currentTarget as HTMLElement).style.color = "oklch(0.99 0.005 80)"; }}
                >
                  Book Your Session
                </Link>
                <Link
                  href="/services"
                  className="px-9 py-4 transition-all duration-300"
                  style={{
                    border: "1px solid oklch(0.78 0.012 65)",
                    color: "var(--charcoal)",
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontWeight: 500,
                    fontSize: "1.0625rem",
                    letterSpacing: "0.06em",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--charcoal)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.78 0.012 65)"; }}
                >
                  View Services
                </Link>
              </motion.div>
            </motion.div>
            {/* Google reviews shortcut anchored bottom-right over the portrait */}
            <motion.div
              className="absolute bottom-8 right-6 lg:right-12 px-5 py-3 hidden sm:block"
              style={{ background: "oklch(0.99 0.005 80 / 0.88)", backdropFilter: "blur(8px)", boxShadow: "0 8px 32px oklch(0.22 0.01 65 / 0.12)" }}
              initial={reduced ? undefined : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.1, ease: [0.23, 1, 0.32, 1] }}
            >
             <a href="#google-reviews" className="flex items-center gap-3 transition-colors duration-300" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.125rem", color: "var(--charcoal)" }}>
               <span aria-hidden style={{ color: "#e9ad22", fontStyle: "normal", letterSpacing: "0.08em", fontSize: "0.9375rem" }}>★★★★★</span>
               See Our Google Reviews
             </a>
           </motion.div>
         </div>
       </section>

        {/* ── MARQUEE BAND — editorial print-magazine strip ── */}
        <MarqueeBand />

        {/* ── SIGNATURE SERVICES — center-focus swipe carousel ── */}
        <section className="relative overflow-hidden" style={{ background: "var(--blush-cream)" }}>
          <GhostNumeral style={{ top: "2rem", right: "-2rem" }}>06</GhostNumeral>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 lg:pt-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end mb-6 lg:mb-10">
              <Reveal className="lg:col-span-7">
                <p className="label-caps mb-5" style={{ marginLeft: "0.2em" }}>The Menu</p>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2.25rem, 4vw, 3.25rem)", lineHeight: 1.15, color: "var(--charcoal)" }}>
                  Signature<br /><em style={{ color: "var(--rose-gold)" }}>services</em>
                </h2>
                <DrawRule className="mt-7" />
              </Reveal>
              <Reveal className="lg:col-span-5" delay={0.12}>
                <p className="lede">
                  Ten treatments, one standard. Each service is rendered with medical-grade
                  adhesives, premium silk fibers, and an artist's eye.
                </p>
                <Link
                  href="/services"
                  className="inline-block mt-6 transition-colors duration-300"
                  style={{ color: "var(--rose-gold)", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1rem", textDecoration: "underline", textUnderlineOffset: "6px" }}
                >
                  Explore the full menu →
                </Link>
              </Reveal>
            </div>
          </div>
          {/* Full-bleed carousel: swipe/drag, center card scales up, arrows + dots */}
          <Reveal y={44} className="pb-16 lg:pb-20">
            <ServiceCarousel services={SIGNATURE_SERVICES} />
          </Reveal>
        </section>

        {/* ── ATELIER IN NUMBERS — scroll-driven counters ── */}
        <section className="relative overflow-hidden" style={{ background: "var(--ivory)", borderTop: "1px solid oklch(0.90 0.012 60)" }}>
          <GhostNumeral style={{ bottom: "-6rem", right: "-2rem" }}>®</GhostNumeral>
          <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {ATELIER_NUMBERS.map((n, i) => (
                <Reveal key={n.label} delay={i * 0.1} y={28} blur={false}>
                  <div style={{ borderLeft: "1px solid var(--rose-gold)", paddingLeft: "1.5rem" }}>
                    <p style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "clamp(2.5rem, 4vw, 3.375rem)", lineHeight: 1, color: "var(--charcoal)", fontVariantNumeric: "lining-nums" }}>
                      <CountUp to={n.value} suffix={n.suffix} />
                    </p>
                    <p className="mt-3" style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1.0625rem", color: "var(--charcoal)" }}>{n.label}</p>
                    <p className="mt-1" style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "var(--warm-gray)" }}>{n.note}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── DARK ANCHOR BAND — philosophy ── */}
        {/* Full-bleed cinematic band — the image IS the section, hero-style.
            Quote sits directly on the photograph over a gradient scrim. */}
        <section className="relative overflow-hidden" style={{ background: "oklch(0.14 0.01 300)" }}>
          <Parallax amount={40} className="absolute inset-0">
            <img
              src="/images/panache/lash-detail.png"
              alt=""
              aria-hidden
              width="2176"
              height="1632"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              style={{ objectPosition: "left center", transform: "scale(1.08)" }}
              draggable={false}
            />
          </Parallax>
          {/* Scrim: darkens leftward and rightward toward the copy for legibility */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.14 0.01 300 / 0.55) 0%, oklch(0.14 0.01 300 / 0.30) 35%, oklch(0.14 0.01 300 / 0.82) 68%, oklch(0.14 0.01 300 / 0.94) 100%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-24"
            style={{ background: "linear-gradient(180deg, oklch(0.14 0.01 300 / 0.6), transparent)" }}
          />
          <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-36 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="hidden lg:block lg:col-span-5" aria-hidden />
            <Reveal className="lg:col-span-7 lg:pl-8" delay={0.15}>
              <p className="label-caps mb-6" style={{ marginLeft: "0.2em" }}>The Philosophy</p>
              <blockquote
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)",
                  lineHeight: 1.35,
                  color: "oklch(0.94 0.008 70)",
                }}
              >
                "A lash set should never announce itself. It should simply make
                everyone wonder what changed."
              </blockquote>
              <DrawRule className="my-8" />
              <p style={{ color: "oklch(0.70 0.012 60)", fontFamily: "var(--font-sans)", fontSize: "1.0625rem", lineHeight: 1.75, maxWidth: "36rem" }}>
                Founded in 2020, PANACHE® serves clients across metro Detroit with
                an uncompromising standard: healthy natural lashes first, artistry
                always, and never a rushed appointment.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── CRAFT / EXPERIENCE — asymmetric two-image editorial ── */}
        {/* Hero-style blend: the image bleeds off the left viewport edge and
            feathers into the ivory canvas where the copy lives. */}
        <section className="relative overflow-hidden" style={{ background: "var(--ivory)" }}>
          {/* Full-height image anchored to the left edge, feathered into ivory */}
          <div className="hidden lg:block absolute inset-y-0 left-0 overflow-hidden" style={{ width: "52%" }} aria-hidden>
            <Parallax amount={40} className="h-full">
              <img
                src="/images/panache/services-application.png"
                alt=""
                width="2304"
                height="1536"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
                style={{ transform: "scale(1.1)", objectPosition: "left center" }}
                draggable={false}
              />
            </Parallax>
            {/* Feather: image dissolves into the ivory canvas */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.97 0.008 75 / 0) 0%, oklch(0.97 0.008 75 / 0) 38%, oklch(0.97 0.008 75 / 0.4) 58%, oklch(0.97 0.008 75 / 0.85) 76%, var(--ivory) 92%, var(--ivory) 100%)",
              }}
            />
            <div
              className="absolute inset-x-0 top-0 h-20"
              style={{ background: "linear-gradient(180deg, var(--ivory), oklch(0.97 0.008 75 / 0))" }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-20"
              style={{ background: "linear-gradient(0deg, var(--blush-cream), oklch(0.97 0.008 75 / 0))" }}
            />
          </div>
          {/* Mobile: soft-edged image above the copy, no hard box */}
          <div className="lg:hidden relative" aria-hidden>
            <img
              src="/images/panache/services-application.png"
              alt=""
              width="2304"
              height="1536"
              loading="lazy"
              decoding="async"
              className="w-full object-cover"
              style={{ aspectRatio: "16/10" }}
              draggable={false}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-24"
              style={{ background: "linear-gradient(0deg, var(--ivory), oklch(0.97 0.008 75 / 0))" }}
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-14 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="hidden lg:block lg:col-span-5" aria-hidden />
              <div className="lg:col-span-7 lg:pl-12">
                <Reveal>
                  <p className="label-caps mb-5" style={{ marginLeft: "0.2em" }}>The Experience</p>
                  <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2.25rem, 4vw, 3.25rem)", lineHeight: 1.15, color: "var(--charcoal)" }}>
                    Unhurried. Precise.<br /><em style={{ color: "var(--rose-gold)" }}>Entirely yours.</em>
                  </h2>
                </Reveal>
                <div className="space-y-8 mt-10">
                  {[
                    { t: "Private studio setting", d: "One client at a time — no rows of beds, no overheard conversations. Your appointment is yours alone." },
                    { t: "Lash-health first", d: "Every set is mapped to your natural lash strength. We decline work that would compromise them — and tell you why." },
                    { t: "By reservation only", d: "Tuesday through Saturday, 10 AM to 7 PM. A deposit secures your session; your artist's full attention comes with it." },
                  ].map((item, i) => (
                    <Reveal key={item.t} delay={i * 0.1} y={30} className="flex gap-6">
                      <span className="rule-gold mt-4 shrink-0" style={{ width: "2rem" }} />
                      <div>
                        <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1.1875rem", color: "var(--charcoal)" }}>{item.t}</h3>
                        <p className="mt-2" style={{ color: "var(--warm-gray)", fontFamily: "var(--font-sans)", fontSize: "1.0625rem", lineHeight: 1.7 }}>{item.d}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
                <Reveal className="mt-12">
                  <Link
                    href="/about"
                    className="inline-block transition-colors duration-300"
                    style={{ color: "var(--rose-gold)", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1rem", textDecoration: "underline", textUnderlineOffset: "6px" }}
                  >
                    Meet the studio →
                  </Link>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <GoogleReviews />

        {/* ── CTA BAND ── */}
        <section style={{ background: "var(--blush-cream)", borderTop: "1px solid oklch(0.90 0.012 60)" }}>
          <Reveal className="max-w-4xl mx-auto px-6 lg:px-12 py-20 lg:py-24 text-center">
            <p className="label-caps mb-6" style={{ marginLeft: "0.2em" }}>Reservations Open</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)", lineHeight: 1.15, color: "var(--charcoal)" }}>
              Your next set is <em style={{ color: "var(--rose-gold)" }}>waiting.</em>
            </h2>
            <p className="lede max-w-xl mx-auto mt-6">
              Appointments open Tuesday through Saturday. Choose your service,
              pick your time, and consider it handled.
            </p>
            <Link
              href="/services#booking"
              className="inline-block mt-10 px-12 py-4.5 transition-all duration-300"
              style={{
                background: "var(--rose-gold)",
                color: "oklch(0.99 0.005 80)",
                fontFamily: "var(--font-display)", fontStyle: "italic",
                fontWeight: 500,
                fontSize: "1rem",
                letterSpacing: "0.06em", padding: "1.125rem 3rem",
                border: "1px solid var(--rose-gold)",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--rose-gold)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--rose-gold)"; (e.currentTarget as HTMLElement).style.color = "oklch(0.99 0.005 80)"; }}
            >
              Book an Appointment
            </Link>
            <div>
              <Link
                href="/policies"
                className="inline-block mt-5"
                style={{ color: "var(--rose-gold)", fontFamily: "var(--font-label)", fontSize: "0.9375rem", textDecoration: "underline", textUnderlineOffset: "5px" }}
              >
                View Booking Policies →
              </Link>
            </div>
          </Reveal>
        </section>
      </div>
    </Layout>
  );
}
