import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Reveal, DrawRule } from "@/components/motion";

const SECTIONS = [
  {
    title: "Website Inquiry Form",
    text: "The current website inquiry form keeps the details you type only in temporary browser memory. It does not transmit them to PANACHE, a database, or an email service, and they are discarded when you leave or reload the page. To reach the studio now, please call, text, or email directly. An inquiry never creates or confirms an appointment.",
  },
  {
    title: "Direct Communications",
    text: "When you choose to call, text, or email PANACHE, the studio receives the contact details and message you provide through your phone or email provider. PANACHE uses that information to understand and respond to your request, provide client service, and maintain appropriate business records.",
  },
  {
    title: "Booking & Payment Through Square",
    text: "Appointments, deposits, payment details, and booking-account information are handled through Square when you continue to its booking service. Square processes that information under its own privacy policy and terms. PANACHE does not collect payment-card numbers through this website’s inquiry form.",
  },
  {
    title: "Google Services",
    text: "The website uses Google services to load the Amiri web font and display business information, reviews, maps, and directions. Google may receive technical information such as your IP address, browser details, and interactions with Google content under Google’s own privacy policy.",
  },
  {
    title: "Panache Concierge",
    text: "If you use the optional AI concierge, the questions you enter and a limited portion of the conversation are sent through PANACHE’s server to OpenAI to generate a response. Do not share payment-card details, passwords, detailed health information, or other sensitive personal information in chat. Chat guidance may be incomplete or inaccurate and does not create, change, or confirm an appointment.",
  },
  {
    title: "Analytics & Tracking",
    text: "PANACHE does not currently run a website analytics service, advertising pixel, or behavioral tracking tool on this site. The site does not sell personal information. Third-party services you choose to open, including Google, Square, and Instagram, operate under their own privacy policies.",
  },
  {
    title: "Retention & Your Choices",
    text: "PANACHE keeps direct communications and client records only as long as reasonably needed for client service, business records, dispute resolution, or legal requirements. The website inquiry form creates no record for PANACHE to retain. You may ask to review, correct, or delete information held directly by PANACHE, subject to records the studio must keep.",
  },
  {
    title: "Photography Consent",
    text: "Client photographs are not required for a standard appointment. When photography is requested, consent is optional and handled separately. You may decline without affecting your service and may contact PANACHE about future use of an image.",
  },
];

export default function Privacy() {
  return (
    <Layout>
      <section
        style={{
          background: "var(--ivory)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <Reveal className="max-w-3xl">
            <p className="label-caps mb-6">Your Information</p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3.15rem, 7vw, 5.25rem)",
                lineHeight: 1.03,
                color: "var(--charcoal)",
                textWrap: "balance",
                paddingBottom: "0.08em",
              }}
            >
              Privacy <em style={{ color: "var(--rose-gold)" }}>Policy</em>
            </h1>
            <DrawRule className="my-7" />
            <p className="lede max-w-2xl">
              A clear overview of what this website does—and does not—collect
              when you contact PANACHE or continue to third-party services.
            </p>
            <p className="mt-4 label-caps">Effective July 15, 2026</p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--blush-cream)" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <div className="space-y-5">
            {SECTIONS.map((section, index) => (
              <Reveal key={section.title} delay={index * 0.05} y={24}>
                <article
                  className="p-7 sm:p-9"
                  style={{
                    background: "oklch(0.995 0.004 80)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <h2
                    style={{
                      color: "var(--charcoal)",
                      fontSize: "clamp(1.35rem, 2.5vw, 1.75rem)",
                      lineHeight: 1.2,
                    }}
                  >
                    {section.title}
                  </h2>
                  <p
                    className="mt-3"
                    style={{
                      color: "var(--warm-gray)",
                      fontFamily: "var(--font-sans)",
                      fontSize: "1.0625rem",
                      lineHeight: 1.8,
                    }}
                  >
                    {section.text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center" y={20}>
            <p
              style={{
                color: "var(--warm-gray)",
                fontFamily: "var(--font-sans)",
                fontSize: "1rem",
                lineHeight: 1.7,
              }}
            >
              Privacy questions or requests may be sent to{" "}
              <a
                href="mailto:info@panachelashes.com"
                style={{
                  color: "var(--rose-gold)",
                  textDecoration: "underline",
                }}
              >
                info@panachelashes.com
              </a>
              . For appointment terms, read the{" "}
              <Link
                href="/policies"
                style={{
                  color: "var(--rose-gold)",
                  textDecoration: "underline",
                }}
              >
                Booking Policies
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
