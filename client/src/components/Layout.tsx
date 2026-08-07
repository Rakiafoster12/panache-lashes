/**
 * PANACHE Ivory Atelier — Shared Layout (v2 light theme)
 * Warm ivory canvas, charcoal ink, burnished rose-gold accent.
 * Nav: light ivory bar, BLACK logo (® baked into artwork).
 * Footer: dark obsidian anchor band with WHITE logo — the one dark moment per page.
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { STUDIO_SUMMARY_SERVICES } from "@/data/services";
import { ScrollProgress, GrainOverlay, IntroReveal } from "@/components/motion";
import PanacheConcierge from "@/components/PanacheConcierge";

// PANACHE LASHES official logo — ® is part of the artwork; never add it in code
function PanacheWordmark({
  variant = "black",
  size = "4.5rem",
}: {
  variant?: "white" | "black";
  size?: string;
}) {
  const src =
    variant === "white"
      ? "/images/panache/logo-white.png"
      : "/images/panache/logo-black.png";
  return (
    <img
      src={src}
      alt="PANACHE LASHES®"
      width={variant === "white" ? 1484 : 1508}
      height={variant === "white" ? 414 : 438}
      loading={variant === "white" ? "lazy" : "eager"}
      decoding="async"
      style={{
        height: size,
        width: "auto",
        maxWidth: "100%",
        objectFit: "contain",
        objectPosition: "left center",
        display: "block",
        flexShrink: 0,
      }}
      draggable={false}
    />
  );
}

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/policies", label: "Policies" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen" style={{ background: "var(--ivory)" }}>
      <ScrollProgress />
      {/* Intro curtain: home page only, fresh page load only (never on client-side nav) */}
      {location === "/" && <IntroReveal />}
      <GrainOverlay />
      <PanacheConcierge />
      {/* Navigation — solid ivory so the black logo always has contrast */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? "oklch(0.975 0.008 75 / 0.94)"
            : "var(--ivory)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled
            ? "1px solid var(--border)"
            : "1px solid oklch(0.92 0.010 65)",
          boxShadow: scrolled
            ? "0 2px 24px oklch(0.22 0.01 65 / 0.06)"
            : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-28 flex items-center justify-between">
          <Link href="/" className="group shrink-0">
            <PanacheWordmark variant="black" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={location === link.href ? "page" : undefined}
                className="relative text-[1.1875rem] tracking-[0.04em] transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-label)",
                  color:
                    location === link.href
                      ? "var(--rose-gold)"
                      : "var(--charcoal)",
                  fontWeight: 500,
                }}
              >
                {link.label}
                <span
                  className="absolute -bottom-1 left-0 h-px transition-all duration-300 ease-out"
                  style={{
                    background: "var(--rose-gold)",
                    width: location === link.href ? "100%" : "0%",
                  }}
                />
              </Link>
            ))}
            <Link
              href="/services#booking"
              className="px-8 py-3 text-[1.0625rem] tracking-[0.06em] transition-all duration-300"
              style={{
                fontFamily: "var(--font-label)",
                fontWeight: 500,
                fontStyle: "italic",
                background: "var(--rose-gold)",
                color: "oklch(0.99 0.005 80)",
                border: "1px solid var(--rose-gold)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--rose-gold)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--rose-gold)";
                (e.currentTarget as HTMLElement).style.color =
                  "oklch(0.99 0.005 80)";
              }}
            >
              Book Now
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <span
              className="block w-6 h-px transition-all duration-300"
              style={{
                background: "var(--charcoal)",
                transform: menuOpen
                  ? "rotate(45deg) translate(3px, 3px)"
                  : "none",
              }}
            />
            <span
              className="block w-4 h-px transition-all duration-300"
              style={{
                background: "var(--charcoal)",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-6 h-px transition-all duration-300"
              style={{
                background: "var(--charcoal)",
                transform: menuOpen
                  ? "rotate(-45deg) translate(3px, -3px)"
                  : "none",
              }}
            />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            id="mobile-navigation"
            className="lg:hidden border-t"
            style={{
              background: "oklch(0.975 0.008 75 / 0.98)",
              borderColor: "var(--border)",
            }}
          >
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col px-6 py-6 gap-6"
            >
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={location === link.href ? "page" : undefined}
                  className="text-[1.25rem]"
                  style={{
                    fontFamily: "var(--font-label)",
                    color:
                      location === link.href
                        ? "var(--rose-gold)"
                        : "var(--charcoal)",
                    fontWeight: 500,
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/services#booking"
                className="inline-block px-6 py-3.5 text-[1.0625rem] tracking-[0.06em] text-center"
                style={{
                  background: "var(--rose-gold)",
                  color: "oklch(0.99 0.005 80)",
                  fontFamily: "var(--font-label)",
                  fontWeight: 600,
                }}
              >
                Book Now
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div style={{ height: "7rem" }} />

      <main>{children}</main>

      {/* Footer — the dark obsidian anchor band, white logo */}
      <footer style={{ background: "oklch(0.14 0.01 300)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
            <div>
              <img
                src="/images/panache/lash-symbol.png"
                alt=""
                aria-hidden="true"
                width="72"
                height="72"
                loading="lazy"
                className="mb-5 h-16 w-16 object-contain opacity-90"
              />
              <div className="mb-6">
                <PanacheWordmark variant="white" size="4.5rem" />
              </div>
              <p
                className="leading-relaxed mb-6"
                style={{
                  color: "oklch(0.72 0.012 60)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "1rem",
                }}
              >
                Luxury lash artistry.
                <br />
                Every lash, intentional.
              </p>
              <span className="label-caps">Reg. No. 6284886</span>
            </div>
            <div>
              <p className="label-caps mb-6">Services</p>
              <ul className="space-y-3.5">
                {STUDIO_SUMMARY_SERVICES.map(service => (
                  <li
                    key={service.id}
                    style={{
                      color: "oklch(0.72 0.012 60)",
                      fontFamily: "var(--font-sans)",
                      fontSize: "1rem",
                    }}
                  >
                    {service.name}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label-caps mb-6">Find Us</p>
              <address
                className="not-italic leading-loose"
                style={{
                  color: "oklch(0.72 0.012 60)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "1rem",
                }}
              >
                PANACHE LASHES LLC
                <br />
                901 Tower Drive, Suite 420
                <br />
                Troy, MI 48098
                <br />
                <a
                  href="tel:+12484948594"
                  className="transition-colors duration-300 hover:text-white"
                >
                  (248) 494-8594
                </a>
                <br />
                <a
                  href="mailto:info@panachelashes.com"
                  className="transition-colors duration-300 hover:text-white"
                >
                  info@panachelashes.com
                </a>
                <br />
                <a
                  href="https://www.instagram.com/panachelashes"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors duration-300 hover:text-white"
                >
                  @panachelashes on Instagram
                </a>
                <br />
                <br />
                <Link
                  href="/services#booking"
                  className="transition-colors duration-300"
                  style={{ color: "var(--rose-gold-muted)" }}
                >
                  Reserve an appointment →
                </Link>
              </address>
            </div>
          </div>
          <div
            className="mt-14 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-t"
            style={{ borderColor: "oklch(0.28 0.01 300)" }}
          >
            <p
              className="text-sm"
              style={{
                color: "oklch(0.55 0.010 60)",
                fontFamily: "var(--font-sans)",
              }}
            >
              © {new Date().getFullYear()} PANACHE LASHES LLC. All rights
              reserved.
            </p>
            <p
              className="text-sm"
              style={{
                color: "oklch(0.55 0.010 60)",
                fontFamily: "var(--font-sans)",
              }}
            >
              PANACHE® is a registered service mark — US Reg. No. 6284886
            </p>
            <Link
              href="/policies"
              className="text-sm"
              style={{
                color: "var(--rose-gold-muted)",
                fontFamily: "var(--font-label)",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
              }}
            >
              Booking Policies
            </Link>
            <Link
              href="/faq"
              className="text-sm"
              style={{
                color: "var(--rose-gold-muted)",
                fontFamily: "var(--font-label)",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
              }}
            >
              FAQ
            </Link>
            <Link
              href="/privacy"
              className="text-sm"
              style={{
                color: "var(--rose-gold-muted)",
                fontFamily: "var(--font-label)",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
              }}
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
