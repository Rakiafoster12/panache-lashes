import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Reveal, DrawRule } from "@/components/motion";

const FAQS = [
  {
    question: "How long do lash extensions last?",
    answer: "A full set sheds gradually with your natural lash cycle. Most guests schedule a fill every two to three weeks to maintain the intended fullness. Retention varies with your natural shedding cycle, skincare, lifestyle, and aftercare.",
  },
  {
    question: "What is the difference between the three full sets?",
    answer: "The Refined Edit is soft, light, and natural. The Panache Full Set offers clean, uniform coverage in classic, hybrid, or volume styling. The Bespoke Set is the most design-led option, created with layered texture, wispy dimension, and customized movement.",
  },
  {
    question: "How should I prepare for my appointment?",
    answer: "Arrive with clean lashes and no mascara, eyeliner, eye cream, or oil around the eye area. Avoid curling your lashes beforehand. Please arrive on time and plan for the full service duration shown when booking.",
  },
  {
    question: "Can I wear contact lenses during my appointment?",
    answer: "Contact lenses should be removed before the service for comfort and eye safety. Bring a lens case and solution, or wear glasses to your appointment. If you have an active eye concern, contact your eye-care professional before booking.",
  },
  {
    question: "How often should I book a fill?",
    answer: "The Fill is intended for returning guests approximately two to three weeks after a full set. Please reserve before more than 50% of the extensions have shed; otherwise, additional time or a new full set may be required. The Express Fill is a brief touch-up for a set that is still mostly full.",
  },
  {
    question: "What if I have sensitive eyes or a previous reaction?",
    answer: "Please disclose sensitivities and previous reactions before your appointment. A patch test may be recommended. A patch test can help assess immediate comfort but cannot guarantee that a future reaction will not occur. Services should not be performed when the eye area is irritated or infected.",
  },
  {
    question: "Should I schedule a patch test?",
    answer: "A patch test is encouraged if you have sensitive eyes, allergies, or a previous reaction to lash adhesive. We apply a small number of extensions to each eye and allow time to observe your comfort before scheduling a full set.",
  },
  {
    question: "How do I care for my extensions afterward?",
    answer: "Keep lashes clean with an extension-safe cleanser, brush them gently with a clean spoolie, and avoid pulling, rubbing, or picking. Use oil-free products around the eye area and follow the personalized aftercare guidance provided at your appointment.",
  },
  {
    question: "Can I bring inspiration photos?",
    answer: "Absolutely. Inspiration photos help communicate the texture, fullness, and overall mood you prefer. Your artist will adapt the reference to your eye shape, natural lash health, and lifestyle rather than copying a look that may not suit your features.",
  },
  {
    question: "Can I bring a guest or child?",
    answer: "Appointments are private and reserved for the scheduled client. Please do not bring children or additional guests unless you have arranged an accommodation with the studio in advance.",
  },
  {
    question: "Is the studio accessible?",
    answer: "The studio is on Floor 4 and is accessible by elevator from the main lobby. If you need a mobility, communication, sensory, or other reasonable accommodation, contact the studio before your visit so we can discuss how best to support you.",
  },
];

export default function FAQ() {
  useEffect(() => {
    if (window.location.hash === "#appointment-care") {
      const timer = window.setTimeout(() => document.getElementById("appointment-care")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      return () => window.clearTimeout(timer);
    }
  }, []);

  return (
    <Layout>
      <section style={{ background: "var(--ivory)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <Reveal className="max-w-3xl">
            <p className="label-caps mb-6">Before Your Visit</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3.15rem, 7vw, 5.25rem)", lineHeight: 1.03, color: "var(--charcoal)", textWrap: "balance", paddingBottom: "0.08em" }}>
              Frequently Asked <em style={{ color: "var(--rose-gold)" }}>Questions</em>
            </h1>
            <DrawRule className="my-7" />
            <p className="lede max-w-2xl">
              Everything you need to feel prepared, comfortable, and confident before reserving your appointment.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--blush-cream)" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <Reveal>
            <div style={{ borderTop: "1px solid var(--border)" }}>
              {FAQS.map((item, index) => (
                <details key={item.question} className="group" style={{ background: index % 2 === 0 ? "oklch(0.995 0.004 80)" : "var(--ivory)", borderBottom: "1px solid var(--border)" }}>
                  <summary className="flex items-center justify-between gap-6 px-6 sm:px-8 py-6 cursor-pointer list-none">
                    <span style={{ fontFamily: "var(--font-label)", fontSize: "clamp(1.15rem, 2.5vw, 1.4rem)", color: "var(--charcoal)" }}>{item.question}</span>
                    <span aria-hidden className="shrink-0 text-2xl font-light transition-transform duration-300 group-open:rotate-45" style={{ color: "var(--rose-gold)" }}>+</span>
                  </summary>
                  <div className="px-6 sm:px-8 pb-7 pr-14 sm:pr-20">
                    <p style={{ color: "var(--warm-gray)", fontFamily: "var(--font-sans)", fontSize: "1.0625rem", lineHeight: 1.8 }}>{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </Reveal>

          <Reveal className="mt-14" y={28}>
            <div id="appointment-care" style={{ scrollMarginTop: "8rem" }}>
              <div className="text-center mb-7">
                <p className="label-caps mb-3">Appointment Care</p>
                <h2 style={{ color: "var(--charcoal)", fontSize: "clamp(1.75rem, 3vw, 2.35rem)" }}>A little preparation goes a long way.</h2>
                <p className="mt-3" style={{ color: "var(--warm-gray)", fontFamily: "var(--font-sans)", fontSize: "0.9375rem" }}>Open only what you need.</p>
              </div>

              <figure className="relative mb-7 overflow-hidden" style={{ background: "var(--blush-cream)" }}>
                <img
                  src="/manus-storage/panache-lash-lift_88756f0b_e9aa16f7.jpg"
                  alt="Lash treatment in progress in a calm private-studio setting"
                  width="1632"
                  height="2176"
                  loading="lazy"
                  decoding="async"
                  className="h-64 w-full object-cover sm:h-80"
                  style={{ objectPosition: "center 42%" }}
                />
                <figcaption className="absolute inset-x-0 bottom-0 px-6 py-5" style={{ background: "linear-gradient(to top, oklch(0.14 0.01 300 / 0.82), transparent)", color: "white", fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.125rem" }}>
                  Thoughtful care—before, during, and after your visit.
                </figcaption>
              </figure>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    number: "01",
                    title: "Before Your Visit",
                    items: [
                      "Arrive with clean lashes and no eye makeup.",
                      "Avoid caffeine if it makes it difficult to remain still.",
                      "Remove contact lenses before the service.",
                      "Bring inspiration photos.",
                      "Plan for the full appointment duration.",
                    ],
                  },
                  {
                    number: "02",
                    title: "Protect Your Set",
                    items: [
                      "Clean lashes regularly with an extension-safe cleanser.",
                      "Brush gently with a clean spoolie.",
                      "Avoid pulling, rubbing, or picking.",
                      "Use oil-free products around the eye area.",
                      "Schedule your fill before excessive shedding.",
                    ],
                  },
                ].map((guide) => (
                  <details key={guide.title} className="group" style={{ background: "oklch(0.995 0.004 80)", border: "1px solid var(--border)" }}>
                    <summary className="flex items-center justify-between gap-5 p-6 sm:p-7 cursor-pointer list-none">
                      <span className="flex items-center gap-4">
                        <span style={{ color: "var(--rose-gold)", fontFamily: "var(--font-label)", fontSize: "0.875rem" }}>{guide.number}</span>
                        <strong style={{ color: "var(--charcoal)", fontFamily: "var(--font-label)", fontWeight: 400, fontSize: "1.2rem" }}>{guide.title}</strong>
                      </span>
                      <span aria-hidden className="text-2xl transition-transform duration-300 group-open:rotate-45" style={{ color: "var(--rose-gold)" }}>+</span>
                    </summary>
                    <ul className="px-7 pb-7 space-y-3">
                      {guide.items.map((item) => (
                        <li key={item} className="flex gap-3" style={{ color: "var(--warm-gray)", fontFamily: "var(--font-sans)", fontSize: "1rem", lineHeight: 1.65 }}>
                          <span aria-hidden style={{ color: "var(--rose-gold)" }}>—</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal className="text-center mt-12" y={24}>
            <p style={{ color: "var(--warm-gray)", fontFamily: "var(--font-sans)", fontSize: "1rem" }}>Still have a question specific to your lashes?</p>
            <a href="/contact" className="inline-block mt-5" style={{ color: "var(--rose-gold)", fontFamily: "var(--font-label)", textDecoration: "underline", textUnderlineOffset: "5px" }}>Contact the studio →</a>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
