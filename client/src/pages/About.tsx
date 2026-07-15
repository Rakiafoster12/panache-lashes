/**
 * PANACHE About — Ivory Atelier (v2 light theme)
 * Editorial story layout with scroll parallax hero, cinematic reveals,
 * drawn rose-gold rules, staggered commitment cards.
 */
import { useRef } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Layout from "@/components/Layout";
import { Reveal, DrawRule } from "@/components/motion";

const COMMITMENTS = [
  { t: "Lash health above all", d: "Every set is mapped to the strength of your natural lashes. We will never apply work that compromises them — and we'll always explain why." },
  { t: "One client at a time", d: "PANACHE is a private studio. Your appointment is unhurried, uninterrupted, and entirely yours." },
  { t: "Premium materials only", d: "Medical-grade adhesives, silk and cashmere fibers, and pigments chosen for longevity and comfort." },
  { t: "Honest guidance", d: "If a style won't suit your eye shape or lifestyle, we'll tell you — and design one that will." },
];

export default function About() {
  const heroRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(heroProgress, [0, 1], ["0%", "20%"]);
  const copyOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);
  const copyY = useTransform(heroProgress, [0, 1], ["0%", "-26%"]);

  return (
    <Layout>
      <div>
        {/* ── HERO — full-bleed image, cream gradient wash (matches Home hero) ── */}
        <section ref={heroRef} className="relative overflow-hidden" style={{ minHeight: "58vh" }}>
          <div className="absolute inset-0">
            <motion.img
              src="/manus-storage/panache-lash-detail_cffa67f3_45dae584.jpg"
              alt="PANACHE studio — lash artistry in detail"
              width="2176"
              height="1632"
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
              <p className="label-caps mb-6" style={{ marginLeft: "0.2em" }}>The Studio</p>
              <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(3.15rem, 7vw, 5.25rem)", lineHeight: 1.03, color: "var(--charcoal)", overflowWrap: "normal", wordBreak: "keep-all", textWrap: "balance", paddingBottom: "0.08em" }}>
                About <em style={{ color: "var(--rose-gold)" }}>PANACHE</em>
              </h1>
              <DrawRule className="my-7" />
              <p className="lede max-w-lg">
                Founded in 2020, PANACHE® is a private lash
                atelier built on a simple conviction: the eyes are the most
                expressive feature of the human face, and they deserve the full
                attention of a skilled artist.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── STORY ── */}
        {/* Hero-style blend: soft studio imagery bleeds off the right edge and
            feathers into the blush canvas behind the copy */}
        <section className="relative overflow-hidden" style={{ background: "var(--blush-cream)" }}>
          <div className="hidden lg:block absolute inset-y-0 right-0 overflow-hidden" style={{ width: "30%" }} aria-hidden>
            <img
              src="/manus-storage/panache-lash-lift_88756f0b_e9aa16f7.jpg"
              alt=""
              width="1632"
              height="2176"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              style={{ objectPosition: "right center", transform: "scale(1.06)" }}
              draggable={false}
            />
            {/* Feather: image dissolves into the blush canvas */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(270deg, oklch(0.955 0.018 80 / 0.12) 0%, oklch(0.955 0.018 80 / 0.3) 30%, oklch(0.955 0.018 80 / 0.7) 60%, var(--blush-cream) 88%, var(--blush-cream) 100%)",
              }}
            />
            <div
              className="absolute inset-x-0 top-0 h-24"
              style={{ background: "linear-gradient(180deg, var(--blush-cream), oklch(0.955 0.018 80 / 0))" }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-24"
              style={{ background: "linear-gradient(0deg, var(--blush-cream), oklch(0.955 0.018 80 / 0))" }}
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
            <Reveal className="lg:col-span-5">
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2rem, 3.5vw, 2.75rem)", lineHeight: 1.2, color: "var(--charcoal)" }}>
                Beauty is a discipline,<br /><em style={{ color: "var(--rose-gold)" }}>not an afterthought.</em>
              </h2>
              <DrawRule className="mt-6" />
            </Reveal>
            <Reveal className="lg:col-span-5 space-y-6" delay={0.12}>
              <p className="lede">
                We are a boutique lash studio offering custom eyelash application,
                fills, professional removal, consultations, and patch testing — each service performed with the precision and patience
                it demands.
              </p>
              <p className="lede">
                Every client who walks through our door receives a private, unhurried
                experience. We study your natural eye shape, bone structure, and
                lifestyle before a single lash is placed. The result is not a look —
                it is an enhancement of who you already are.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── COMMITMENTS ── */}
        <section style={{ background: "var(--ivory)" }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
            <Reveal className="mb-12">
              <p className="label-caps mb-5" style={{ marginLeft: "0.2em" }}>Our Commitments</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2rem, 3.5vw, 2.75rem)", color: "var(--charcoal)" }}>
                What every client <em style={{ color: "var(--rose-gold)" }}>can expect</em>
              </h2>
              <DrawRule className="mt-6" />
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {COMMITMENTS.map((c, i) => (
                <Reveal key={c.t} delay={i * 0.1} y={40}>
                <div
                  className="p-8 h-full transition-shadow duration-500 hover:shadow-[0_16px_48px_oklch(0.22_0.01_65/0.12)]"
                  style={{ background: "oklch(0.995 0.004 80)", border: "1px solid var(--border)" }}
                >
                  <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.625rem", color: "var(--rose-gold)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3" style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1.1875rem", color: "var(--charcoal)" }}>
                    {c.t}
                  </h3>
                  <p className="mt-2.5" style={{ color: "var(--warm-gray)", fontFamily: "var(--font-sans)", fontSize: "1.0625rem", lineHeight: 1.7 }}>
                    {c.d}
                  </p>
                </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── DARK QUOTE ANCHOR ── */}
        <section style={{ background: "oklch(0.14 0.01 300)" }}>
          <Reveal className="max-w-4xl mx-auto px-6 lg:px-12 py-16 lg:py-20 text-center">
            <blockquote style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(1.625rem, 3vw, 2.25rem)", lineHeight: 1.4, color: "oklch(0.94 0.008 70)" }}>
              "Panache isn't applied. It's revealed."
            </blockquote>
            <DrawRule className="mx-auto mt-8" center />
          </Reveal>
        </section>

        {/* ── CTA ── */}
        <section style={{ background: "var(--blush-cream)" }}>
          <Reveal className="max-w-4xl mx-auto px-6 lg:px-12 py-16 lg:py-20 text-center">
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--charcoal)" }}>
              Experience it <em style={{ color: "var(--rose-gold)" }}>yourself.</em>
            </h2>
            <p className="lede max-w-xl mx-auto mt-5">
              Reservations open Tuesday through Saturday. Your first appointment
              begins with a consultation — every set starts with your eye.
            </p>
            <Link
              href="/services#booking"
              className="inline-block mt-9 transition-all duration-300"
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
          </Reveal>
        </section>
      </div>
    </Layout>
  );
}
