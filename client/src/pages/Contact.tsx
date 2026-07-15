/**
 * PANACHE Contact — Ivory Atelier (v2 light theme)
 * General inquiry page with scroll parallax hero and cinematic reveals.
 * Split layout: studio info left, inquiry form right.
 * USPTO specimen note: shows the mark in connection with the registered services.
 */
import { useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Layout from "@/components/Layout";
import { Reveal, DrawRule } from "@/components/motion";
import GoogleBusinessMap from "@/components/GoogleBusinessMap";
import { SERVICES, STUDIO_SUMMARY_SERVICES } from "@/data/services";

const inputStyle: React.CSSProperties = {
  background: "oklch(0.995 0.004 80)",
  border: "1px solid oklch(0.86 0.012 65)",
  color: "var(--charcoal)",
  fontFamily: "var(--font-sans)",
  fontSize: "1.0625rem",
  padding: "0.875rem 1.125rem",
  width: "100%",
  outline: "none",
  transition: "border-color 300ms",
};

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(heroProgress, [0, 1], ["0%", "20%"]);
  const copyOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);
  const copyY = useTransform(heroProgress, [0, 1], ["0%", "-26%"]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const focusIn = (e: React.FocusEvent<HTMLElement>) => { e.currentTarget.style.borderColor = "var(--rose-gold)"; };
  const focusOut = (e: React.FocusEvent<HTMLElement>) => { e.currentTarget.style.borderColor = "oklch(0.86 0.012 65)"; };

  return (
    <Layout>
      <div>
        {/* ── HERO — full-bleed image, cream gradient wash (matches Home hero) ── */}
        <section ref={heroRef} className="relative overflow-hidden" style={{ minHeight: "52vh" }}>
          <div className="absolute inset-0">
            <motion.img
              src="/manus-storage/panache-lash-detail_cffa67f3.jpg"
              alt="PANACHE studio — custom lash artistry"
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
          <div className="relative max-w-7xl mx-auto px-6 lg:px-12 flex items-center" style={{ minHeight: "52vh" }}>
            <motion.div
              className="max-w-xl py-16"
              style={reduced ? undefined : { opacity: copyOpacity, y: copyY }}
              initial={reduced ? undefined : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
            >
              <p className="label-caps mb-6" style={{ marginLeft: "0.2em" }}>PANACHE® Studio</p>
              <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(3.15rem, 7vw, 5.25rem)", lineHeight: 1.03, color: "var(--charcoal)", overflowWrap: "normal", wordBreak: "keep-all", textWrap: "balance", paddingBottom: "0.08em" }}>
                Get in <em style={{ color: "var(--rose-gold)" }}>Touch</em>
              </h1>
              <DrawRule className="my-7" />
              <p className="lede max-w-xl">
                Questions, consultations, special requests — call, text, or email the
                studio and we'll be in touch within one business day. Ready to book?
                Head straight to{" "}
                <Link href="/services#booking" style={{ color: "var(--rose-gold)", textDecoration: "underline", textUnderlineOffset: "4px" }}>
                  the appointment scheduler
                </Link>
                .
              </p>
            </motion.div>
          </div>
        </section>

        <GoogleBusinessMap />

        {/* ── INFO + FORM ── */}
        <section style={{ background: "var(--blush-cream)" }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Studio info */}
            <Reveal className="lg:col-span-5">
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "1.875rem", color: "var(--charcoal)" }}>
                Studio <em style={{ color: "var(--rose-gold)" }}>Information</em>
              </h2>
              <DrawRule className="my-6" />
              <div className="space-y-7">
                <div>
                  <p className="label-caps mb-2">Location</p>
                  <p className="lede">901 Tower Drive, Suite 420<br />Troy, Michigan 48098</p>
                </div>
                <div>
                  <p className="label-caps mb-2">Contact</p>
                  <p className="lede"><a href="tel:+12484948594" style={{ color: "var(--charcoal)", textDecoration: "underline", textUnderlineOffset: "4px" }}>(248) 494-8594</a></p>
                  <p className="lede"><a href="mailto:info@panachelashes.com" style={{ color: "var(--charcoal)", textDecoration: "underline", textUnderlineOffset: "4px" }}>info@panachelashes.com</a></p>
                  <p className="lede"><a href="https://www.instagram.com/panachelashes" target="_blank" rel="noreferrer" style={{ color: "var(--charcoal)", textDecoration: "underline", textUnderlineOffset: "4px" }}>@panachelashes</a></p>
                </div>
                <div>
                  <p className="label-caps mb-2">First Visit</p>
                  <ol className="space-y-3">
                    {[
                      ["Park", "Enter the lot from Tower Drive. Free surface parking surrounds the building."],
                      ["Enter", "Use the main building entrance at 901 Tower Drive."],
                      ["Floor 4", "Take the elevator directly ahead in the lobby and press 4."],
                      ["Suite 420", "Turn left off the elevator and look for Panache Lashes on the door."],
                    ].map(([title, detail], index) => (
                      <li key={title} className="lede flex items-start gap-3">
                        <span className="shrink-0 flex items-center justify-center rounded-full" style={{ width: "1.75rem", height: "1.75rem", border: "1px solid var(--rose-gold)", color: "var(--rose-gold)", fontFamily: "var(--font-label)", fontSize: "0.78rem" }}>
                          {index + 1}
                        </span>
                        <span><strong style={{ fontFamily: "var(--font-label)", fontWeight: 400, color: "var(--charcoal)" }}>{title}.</strong> {detail}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="lede mt-4">Can’t find us? Call or text <a href="tel:+12484948594" style={{ color: "var(--charcoal)", textDecoration: "underline", textUnderlineOffset: "4px" }}>(248) 494-8594</a>.</p>
                  <p className="lede mt-3">The fourth floor is accessible by elevator. For accessibility accommodations, please <a href="tel:+12484948594" style={{ color: "var(--charcoal)", textDecoration: "underline", textUnderlineOffset: "4px" }}>contact the studio</a> before your visit.</p>
                </div>
                <div>
                  <p className="label-caps mb-2">Hours</p>
                  <p className="lede">Tuesday – Saturday · 10:00 AM – 7:00 PM</p>
                  <p className="lede">Sunday – Monday · Closed</p>
                </div>
                <div>
                  <p className="label-caps mb-2">Booking Policy</p>
                  <p className="lede">
                    All appointments are by reservation only. A deposit is required
                    to secure your booking.
                  </p>
                </div>
                <div>
                  <p className="label-caps mb-2">Services Offered</p>
                  <ul className="space-y-1.5">
                    {STUDIO_SUMMARY_SERVICES.map(service => (
                      <li key={service.id} className="lede flex items-baseline gap-3">
                        <span className="rule-gold shrink-0" style={{ width: "1.25rem" }} />
                        {service.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* Blended treatment: image dissolves into the blush canvas —
                  no box, no border */}
              <div className="mt-10 hidden lg:block relative" aria-hidden>
                <img
                  src="/manus-storage/panache-lash-detail_cffa67f3.jpg"
                  alt=""
                  width="2176"
                  height="1632"
                  loading="lazy"
                  decoding="async"
                  className="w-full object-cover"
                  style={{
                    aspectRatio: "16/10",
                    maskImage:
                      "radial-gradient(95% 95% at 50% 45%, black 35%, transparent 88%)",
                    WebkitMaskImage:
                      "radial-gradient(95% 95% at 50% 45%, black 35%, transparent 88%)",
                  }}
                  draggable={false}
                />
              </div>
            </Reveal>

            {/* Inquiry form */}
            <Reveal className="lg:col-span-7" delay={0.12} y={40}>
              <div className="p-8 lg:p-10" style={{ background: "oklch(0.995 0.004 80)", border: "1px solid oklch(0.88 0.012 60)", boxShadow: "0 20px 60px oklch(0.22 0.01 65 / 0.08)" }}>
                {submitted ? (
                  <div className="text-center py-16">
                    <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "2rem", color: "var(--charcoal)" }}>
                      Thank you.
                    </p>
                    <div className="rule-gold mx-auto my-6" />
                    <p className="lede max-w-md mx-auto">
                      This website form is not connected yet, so your details were not
                      sent. Please email or call the studio to reach us directly.
                    </p>
                    <a
                      href="mailto:info@panachelashes.com"
                      className="inline-block mt-7"
                      style={{ color: "var(--rose-gold)", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1.0625rem", textDecoration: "underline", textUnderlineOffset: "6px" }}
                    >
                      Email info@panachelashes.com →
                    </a>
                    <Link
                      href="/services#booking"
                      className="block mt-5"
                      style={{ color: "var(--rose-gold)", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1.0625rem", textDecoration: "underline", textUnderlineOffset: "6px" }}
                    >
                      Ready to book? Go to the scheduler →
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="label-caps block mb-2" htmlFor="name">Full Name *</label>
                        <input id="name" type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Your name" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                      </div>
                      <div>
                        <label className="label-caps block mb-2" htmlFor="email">Email Address *</label>
                        <input id="email" type="email" name="email" required value={form.email} onChange={handleChange} placeholder="your@email.com" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="label-caps block mb-2" htmlFor="phone">Phone Number</label>
                        <input id="phone" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="(000) 000-0000" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                      </div>
                      <div>
                        <label className="label-caps block mb-2" htmlFor="service">Service Requested *</label>
                        <select id="service" name="service" required value={form.service} onChange={handleChange} style={{ ...inputStyle, appearance: "auto" }} onFocus={focusIn} onBlur={focusOut}>
                          <option value="" disabled>Select a service</option>
                          <optgroup label="Lash Services">
                            {SERVICES.map(service => (
                              <option key={service.id} value={service.id}>{service.name}</option>
                            ))}
                          </optgroup>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="label-caps block mb-2" htmlFor="message">Message / Preferred Dates</label>
                      <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange} placeholder="Tell us about your preferred dates, times, or any questions you have..." style={{ ...inputStyle, resize: "vertical" }} onFocus={focusIn} onBlur={focusOut} />
                    </div>
                    <label className="flex items-start gap-3" style={{ color: "var(--warm-gray)", fontFamily: "var(--font-sans)", fontSize: "0.9375rem", lineHeight: 1.55 }}>
                      <input type="checkbox" required className="mt-1 shrink-0" />
                      <span>I understand this is an inquiry only and does not reserve or confirm an appointment. See the <Link href="/privacy" style={{ color: "var(--rose-gold)", textDecoration: "underline", textUnderlineOffset: "3px" }}>Privacy Policy</Link> for how this form currently works.</span>
                    </label>
                    <button
                      type="submit"
                      className="w-full sm:w-auto transition-all duration-300"
                      style={{
                        background: "var(--rose-gold)",
                        color: "oklch(0.99 0.005 80)",
                        fontFamily: "var(--font-display)", fontStyle: "italic",
                        fontWeight: 500,
                        fontSize: "1rem",
                        letterSpacing: "0.06em", padding: "1rem 2.75rem",
                        border: "1px solid var(--rose-gold)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--rose-gold)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--rose-gold)"; (e.currentTarget as HTMLElement).style.color = "oklch(0.99 0.005 80)"; }}
                    >
                      Send Inquiry
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </Layout>
  );
}
