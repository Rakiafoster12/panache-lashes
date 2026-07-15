import { BOOKING_URL } from "@shared/site";

const STEPS = [
  { number: "01", title: "Choose your service", detail: "Select the set, maintenance appointment, or consultation that feels right." },
  { number: "02", title: "Select your time", detail: "View Rakia’s live availability and reserve the time that works for you." },
  { number: "03", title: "Secure your visit", detail: "Complete Square’s protected checkout and receive your confirmation." },
];

export default function SquareBooking() {
  return (
    <div className="relative overflow-hidden" style={{ background: "oklch(0.985 0.010 80)", border: "1px solid oklch(0.78 0.06 40 / 0.55)", boxShadow: "0 24px 70px oklch(0.22 0.01 65 / 0.10)" }}>
      <div aria-hidden className="absolute -top-24 -right-10" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "18rem", lineHeight: 1, color: "oklch(0.62 0.13 35 / 0.055)" }}>
        P
      </div>

      <div className="relative px-7 py-10 sm:px-10 lg:px-14 lg:py-14">
        <div className="max-w-2xl">
          <p className="label-caps mb-5">Private Reservations</p>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2.25rem, 5vw, 3.5rem)", lineHeight: 1.08, color: "var(--charcoal)" }}>
            Your appointment,<br /><em style={{ color: "var(--rose-gold)" }}>beautifully handled.</em>
          </h3>
          <p className="mt-6" style={{ color: "var(--warm-gray)", fontFamily: "var(--font-sans)", fontSize: "1.0625rem", lineHeight: 1.75 }}>
            Continue to our secure Square booking page to browse live availability, choose your service, and reserve your visit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          {STEPS.map((step) => (
            <div key={step.number} className="p-6 lg:p-7" style={{ background: "var(--blush-cream)", border: "1px solid var(--border)" }}>
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.125rem", color: "var(--rose-gold)", border: "1px solid oklch(0.62 0.13 35 / 0.45)", background: "oklch(0.99 0.005 80 / 0.7)" }}>{step.number}</span>
              <h4 className="mt-4" style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1.0625rem", color: "var(--charcoal)" }}>{step.title}</h4>
              <p className="mt-2" style={{ color: "var(--warm-gray)", fontFamily: "var(--font-sans)", fontSize: "0.9375rem", lineHeight: 1.65 }}>{step.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7">
          <a
            href={BOOKING_URL}
            className="inline-flex justify-center items-center px-10 py-4 transition-all duration-300"
            style={{ background: "var(--rose-gold)", color: "white", border: "1px solid var(--rose-gold)", fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500, fontSize: "1.125rem", letterSpacing: "0.04em" }}
          >
            Reserve with Square →
          </a>
          <div>
            <p style={{ color: "var(--charcoal)", fontFamily: "var(--font-label)", fontSize: "0.875rem" }}>Secure checkout · Live availability</p>
            <p className="mt-1" style={{ color: "var(--warm-gray)", fontFamily: "var(--font-label)", fontSize: "0.75rem" }}>Tuesday–Saturday · 10:00 AM–7:00 PM</p>
          </div>
        </div>
        <p className="mt-6" style={{ color: "var(--warm-gray)", fontFamily: "var(--font-sans)", fontSize: "0.875rem" }}>
          By continuing, you acknowledge the studio’s <a href="/policies" style={{ color: "var(--rose-gold)", textDecoration: "underline", textUnderlineOffset: "4px" }}>booking policies</a>.
        </p>
        <p className="mt-3" style={{ color: "var(--warm-gray)", fontFamily: "var(--font-sans)", fontSize: "0.875rem" }}>
          Already booked? <a href="/faq#appointment-care" style={{ color: "var(--rose-gold)", textDecoration: "underline", textUnderlineOffset: "4px" }}>Prepare for your visit →</a>
        </p>
      </div>
    </div>
  );
}
