import { Link } from "wouter";
import Layout from "@/components/Layout";
import { DrawRule, Reveal } from "@/components/motion";

export default function NotFound() {
  return (
    <Layout>
      <main className="min-h-[68vh] flex items-center" style={{ background: "var(--ivory)" }}>
        <Reveal className="max-w-4xl mx-auto px-6 lg:px-12 py-20 text-center">
          <p className="label-caps mb-5">Page Not Found · 404</p>
          <h1 style={{ color: "var(--charcoal)", fontFamily: "var(--font-display)", fontSize: "clamp(3.15rem, 8vw, 6rem)", fontWeight: 400, lineHeight: 1.03 }}>
            Let’s return to something <em style={{ color: "var(--rose-gold)" }}>beautiful.</em>
          </h1>
          <DrawRule className="mx-auto my-8" center />
          <p className="lede max-w-xl mx-auto">The page may have moved, or the address may be incomplete.</p>
          <div className="mt-9 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/" className="px-10 py-4" style={{ background: "var(--rose-gold)", border: "1px solid var(--rose-gold)", color: "white", fontFamily: "var(--font-label)" }}>
              Return Home
            </Link>
            <Link href="/services" className="px-10 py-4" style={{ border: "1px solid var(--border)", color: "var(--charcoal)", fontFamily: "var(--font-label)" }}>
              View Services
            </Link>
          </div>
        </Reveal>
      </main>
    </Layout>
  );
}
