import { FormEvent, useState } from "react";
import { Reveal, DrawRule } from "@/components/motion";

const DESTINATION = "Panache Lashes, 901 Tower Drive Suite 420, Troy, MI 48098";
const PLACE_MAP_URL = `https://www.google.com/maps?q=${encodeURIComponent(DESTINATION)}&output=embed`;

export default function GoogleBusinessMap() {
  const [origin, setOrigin] = useState("");
  const [mapUrl, setMapUrl] = useState(PLACE_MAP_URL);
  const [showingDirections, setShowingDirections] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(false);

  const showDirections = (event: FormEvent) => {
    event.preventDefault();
    const startingPoint = origin.trim();
    if (!startingPoint) return;
    setMapLoading(true);
    setMapError(false);
    setMapUrl(`https://www.google.com/maps?saddr=${encodeURIComponent(startingPoint)}&daddr=${encodeURIComponent(DESTINATION)}&output=embed`);
    setShowingDirections(true);
  };

  const resetMap = () => {
    setMapLoading(true);
    setMapError(false);
    setMapUrl(PLACE_MAP_URL);
    setShowingDirections(false);
  };

  return (
    <section style={{ background: "var(--ivory)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <Reveal className="lg:col-span-4">
            <p className="label-caps mb-5">Visit the Atelier</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2.25rem, 4vw, 3.25rem)", lineHeight: 1.12, color: "var(--charcoal)" }}>
              Find us in <em style={{ color: "var(--rose-gold)" }}>Troy</em>
            </h2>
            <DrawRule className="my-7" />
            <address className="not-italic lede">
              901 Tower Drive, Suite 420<br />
              Troy, Michigan 48098
            </address>
            <a href="tel:+12484948594" className="inline-block mt-4" style={{ color: "var(--charcoal)", fontFamily: "var(--font-label)", fontSize: "1rem" }}>
              (248) 494-8594
            </a>
            <p className="mt-5" style={{ color: "var(--warm-gray)", fontFamily: "var(--font-sans)", fontSize: "1rem", lineHeight: 1.7 }}>
              Open Tuesday through Saturday, 10:00 AM–7:00 PM. Visits are by appointment.
            </p>
            <form onSubmit={showDirections} className="mt-8" aria-label="Get directions to Panache Lashes">
              <label htmlFor="directions-origin" className="label-caps block mb-2.5">Starting Address</label>
              <input
                id="directions-origin"
                type="text"
                value={origin}
                onChange={(event) => setOrigin(event.target.value)}
                placeholder="Enter your address or ZIP code"
                autoComplete="street-address"
                required
                className="w-full px-4 py-3.5"
                style={{ background: "oklch(0.995 0.004 80)", border: "1px solid var(--border)", color: "var(--charcoal)", fontFamily: "var(--font-label)", fontSize: "1rem" }}
              />
              <div className="flex flex-wrap gap-3 mt-3">
                <button type="submit" className="px-8 py-3.5 transition-all duration-300" style={{ background: "var(--rose-gold)", color: "white", border: "1px solid var(--rose-gold)", fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.0625rem" }}>
                  Show Directions →
                </button>
                {showingDirections && (
                  <button type="button" onClick={resetMap} className="px-6 py-3.5" style={{ background: "transparent", color: "var(--charcoal)", border: "1px solid var(--border)", fontFamily: "var(--font-label)", fontSize: "0.9375rem" }}>
                    Show Panache
                  </button>
                )}
              </div>
            </form>
          </Reveal>

          <Reveal className="lg:col-span-8" delay={0.12} y={35}>
            <div
              className="relative overflow-hidden"
              aria-busy={mapLoading}
              style={{ minHeight: "28rem", border: "1px solid var(--border)", boxShadow: "0 20px 60px oklch(0.22 0.01 65 / 0.10)" }}
            >
              {mapLoading && !mapError && (
                <div className="absolute inset-0 z-10 grid place-items-center px-6 text-center" role="status" style={{ background: "var(--blush-cream)" }}>
                  <div>
                    <p className="label-caps">Preparing the map</p>
                    <p className="mt-3" style={{ color: "var(--warm-gray)", fontFamily: "var(--font-sans)", fontSize: "1rem" }}>
                      Loading the Troy studio location…
                    </p>
                  </div>
                </div>
              )}
              {mapError && (
                <div className="absolute inset-0 z-20 grid place-items-center px-8 text-center" role="alert" style={{ background: "var(--blush-cream)" }}>
                  <div>
                    <p style={{ color: "var(--charcoal)", fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>The embedded map is taking a pause.</p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Panache%20Lashes%2C%20901%20Tower%20Drive%20Suite%20420%2C%20Troy%2C%20MI%2048098"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-5"
                      style={{ color: "var(--rose-gold)", fontFamily: "var(--font-label)", textDecoration: "underline", textUnderlineOffset: "5px" }}
                    >
                      Open PANACHE in Google Maps →
                    </a>
                  </div>
                </div>
              )}
              <iframe
                title="Map showing Panache Lashes at 901 Tower Drive in Troy, Michigan"
                src={mapUrl}
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                onLoad={() => setMapLoading(false)}
                onError={() => {
                  setMapLoading(false);
                  setMapError(true);
                }}
              />
            </div>
            <p className="mt-4 text-center" style={{ color: "var(--warm-gray)", fontFamily: "var(--font-sans)", fontSize: "0.875rem" }}>
              Prefer a separate map?{" "}
              <a
                href="https://www.google.com/maps/search/?api=1&query=Panache%20Lashes%2C%20901%20Tower%20Drive%20Suite%20420%2C%20Troy%2C%20MI%2048098"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--rose-gold)", textDecoration: "underline", textUnderlineOffset: "4px" }}
              >
                Open Google Maps
              </a>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
