import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Reveal, DrawRule } from "@/components/motion";
import { BOOKING_URL } from "@shared/site";

const POLICIES = [
  {
    number: "01",
    title: "Arrival",
    text: "Please arrive on time, or a few minutes early. Guests arriving more than 10 minutes late may be asked to reschedule. This protects the full quality of your appointment and respects the guest scheduled after you.",
  },
  {
    number: "02",
    title: "Securing Your Appointment",
    text: "Your appointment reserves a block of time exclusively for you. A 25% deposit is collected when booking. It is not an added cost—it is applied toward your service total. A payment card is securely kept on file through Square.",
  },
  {
    number: "03",
    title: "Cancellations & Rescheduling",
    text: "Plans change, and we understand. Please provide at least 24 hours’ notice to cancel or reschedule. Cancellations and no-shows within 24 hours are subject to a 50% service fee, and deposits are non-refundable. Early notice allows us to offer your appointment to another guest.",
  },
  {
    number: "04",
    title: "Payment",
    text: "All major payment cards are accepted securely through Square. Gratuity may be added during online booking or given in cash at your appointment.",
  },
  {
    number: "05",
    title: "New Guests",
    text: "A brief personalized consultation is included with every full set—simply reserve the look you are drawn to. A patch test is recommended if you have sensitivities or have experienced a previous reaction to lash adhesive.",
  },
  {
    number: "06",
    title: "Private Appointments & Guests",
    text: "Appointments are private and reserved for the scheduled client. To preserve a calm, focused environment and allow your artist to work safely, please do not bring children or additional guests unless an accommodation has been arranged with the studio in advance.",
  },
  {
    number: "07",
    title: "Photography & Model Appointments",
    text: "Photography is optional and requires your permission. If images are requested during a regular or model appointment, you may decline or withdraw consent before publication without affecting your service. Any specific model terms will be explained separately before you agree.",
  },
];

export default function Policies() {
  return (
    <Layout>
      <section style={{ background: "var(--ivory)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <Reveal className="max-w-3xl">
            <p className="label-caps mb-6">The Studio Standard</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3.15rem, 7vw, 5.25rem)", lineHeight: 1.03, color: "var(--charcoal)", textWrap: "balance", paddingBottom: "0.08em" }}>
              Booking <em style={{ color: "var(--rose-gold)" }}>Policies</em>
            </h1>
            <DrawRule className="my-7" />
            <p className="lede max-w-2xl">
              Our policies protect the quality of your experience, the time reserved for you, and the guest scheduled beside you.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--blush-cream)" }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <div className="space-y-5">
            {POLICIES.map((policy, index) => (
              <Reveal key={policy.title} delay={index * 0.07} y={28}>
                <article className="grid grid-cols-1 sm:grid-cols-[5rem_1fr] gap-4 sm:gap-7 p-7 sm:p-8 lg:p-10" style={{ background: "oklch(0.995 0.004 80)", border: "1px solid var(--border)" }}>
                  <span style={{ fontFamily: "var(--font-label)", color: "var(--rose-gold)", fontSize: "1.125rem" }}>{policy.number}</span>
                  <div>
                    <h2 style={{ color: "var(--charcoal)", fontSize: "clamp(1.4rem, 2.5vw, 1.85rem)", lineHeight: 1.2 }}>{policy.title}</h2>
                    <p className="mt-3" style={{ color: "var(--warm-gray)", fontFamily: "var(--font-sans)", fontSize: "1.0625rem", lineHeight: 1.8 }}>{policy.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 text-center" y={24}>
            <p style={{ color: "var(--warm-gray)", fontFamily: "var(--font-sans)", fontSize: "0.9375rem" }}>
              Questions about a policy? <Link href="/contact" style={{ color: "var(--rose-gold)", textDecoration: "underline" }}>Contact the studio</Link> before reserving.
            </p>
            <a href={BOOKING_URL} className="inline-block mt-7 px-11 py-4" style={{ background: "var(--rose-gold)", color: "white", fontFamily: "var(--font-label)", fontSize: "1rem" }}>
              I Understand · Continue to Booking →
            </a>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
