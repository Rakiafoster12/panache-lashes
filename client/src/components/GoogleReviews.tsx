import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Reveal, DrawRule } from "@/components/motion";
import { trpc } from "@/lib/trpc";

type Review = {
  rating: number;
  text?: { text: string };
  relativePublishTimeDescription: string;
  googleMapsUri: string;
  authorAttribution: { displayName: string; uri: string; photoUri?: string };
};

type Profile = {
  displayName: { text: string };
  formattedAddress: string;
  nationalPhoneNumber: string;
  rating: number;
  userRatingCount: number;
  googleMapsUri: string;
  reviews?: Review[];
};

export default function GoogleReviews() {
  const { data: profile } = trpc.business.googleProfile.useQuery(undefined, {
    retry: 1,
    staleTime: 6 * 60 * 60 * 1000,
  });
  const [interacting, setInteracting] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);

  useEffect(() => {
    if (!profile?.reviews?.length || interacting) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let previousTime: number | undefined;
    const glide = (time: number) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      if (previousTime !== undefined) {
        const elapsed = Math.min(time - previousTime, 50);
        scroller.scrollLeft += elapsed * 0.03;
      }
      previousTime = time;
      frame = requestAnimationFrame(glide);
    };
    frame = requestAnimationFrame(glide);
    return () => cancelAnimationFrame(frame);
  }, [profile, interacting]);

  useEffect(() => {
    const reviews = profile?.reviews || [];
    const scroller = scrollerRef.current;
    if (!reviews.length || !scroller) return;
    const frame = requestAnimationFrame(() => {
      const cards = scroller.querySelectorAll<HTMLElement>("[data-review-card]");
      activeRef.current = reviews.length;
      scroller.scrollTo({ left: cards[reviews.length]?.offsetLeft || 0, behavior: "auto" });
    });
    return () => cancelAnimationFrame(frame);
  }, [profile]);

  if (!profile) return null;
  const reviews = profile.reviews || [];
  const loopingReviews = [...reviews, ...reviews, ...reviews];

  const maintainInfiniteLoop = () => {
    const scroller = scrollerRef.current;
    if (!scroller || !reviews.length) return;
    window.requestAnimationFrame(() => {
      const cards = Array.from(scroller.querySelectorAll<HTMLElement>("[data-review-card]"));
      const nearest = cards.reduce((best, card, index) =>
        Math.abs(card.offsetLeft - scroller.scrollLeft) < Math.abs(cards[best].offsetLeft - scroller.scrollLeft) ? index : best, 0);
      activeRef.current = nearest;
      if (nearest <= 1) {
        activeRef.current = nearest + reviews.length;
        scroller.scrollTo({ left: cards[activeRef.current].offsetLeft, behavior: "auto" });
      } else if (nearest >= cards.length - 2) {
        activeRef.current = nearest - reviews.length;
        scroller.scrollTo({ left: cards[activeRef.current].offsetLeft, behavior: "auto" });
      }
    });
  };

  return (
    <section id="google-reviews" style={{ background: "var(--ivory)", borderTop: "1px solid var(--border)", scrollMarginTop: "7rem" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <Reveal className="text-center max-w-3xl mx-auto">
          <p className="label-caps mb-5">Client Notes</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2.25rem, 4vw, 3.25rem)", color: "var(--charcoal)" }}>
            Loved in <em style={{ color: "var(--rose-gold)" }}>Troy</em>
          </h2>
          <DrawRule className="mx-auto my-7" center />
          <a href={profile.googleMapsUri} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3" aria-label={`View ${profile.rating} star rating on Google`}>
            <span aria-hidden style={{ color: "#e9ad22", letterSpacing: "0.12em", fontSize: "1.25rem" }}>★★★★★</span>
            <strong style={{ fontFamily: "var(--font-label)", color: "var(--charcoal)" }}>{profile.rating.toFixed(1)}</strong>
            <span style={{ fontFamily: "var(--font-label)", color: "var(--warm-gray)", fontSize: "0.9375rem" }}>from {profile.userRatingCount} Google reviews</span>
          </a>
          <p className="mt-3" style={{ color: "var(--warm-gray)", fontFamily: "var(--font-sans)", fontSize: "1rem" }}>
            Verified profile data, refreshed from Google.
          </p>
        </Reveal>

        {reviews.length ? (
          <>
            <Reveal y={36} blur className="mt-12">
              <div
                ref={scrollerRef}
                className="flex gap-4 sm:gap-5 lg:gap-6 overflow-x-auto no-scrollbar py-3"
                style={{
                  scrollSnapType: "none",
                  overscrollBehaviorInline: "contain",
                  scrollPaddingInline: "1px",
                  maskImage: "linear-gradient(90deg, transparent 0, black 3%, black 97%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(90deg, transparent 0, black 3%, black 97%, transparent 100%)",
                }}
                onScroll={maintainInfiniteLoop}
                onMouseEnter={() => setInteracting(true)}
                onMouseLeave={() => setInteracting(false)}
                onPointerDown={() => setInteracting(true)}
                onPointerUp={() => setInteracting(false)}
                aria-label="Google reviews carousel. Swipe or scroll to explore reviews. Reviews repeat continuously."
              >
                {loopingReviews.map((review, index) => (
                  <div
                    key={`${review.googleMapsUri}-${index}`}
                    data-review-card
                    className="shrink-0 w-[86vw] sm:w-[calc(50%_-_0.625rem)] lg:w-[calc(33.333%_-_1rem)]"
                    style={{ scrollSnapAlign: "none" }}
                  >
                    <article className="h-full p-6 sm:p-7 lg:p-8" style={{ background: "oklch(0.995 0.004 80)", border: "1px solid var(--border)" }}>
                      <div aria-label={`${review.rating} out of 5 stars`} style={{ color: "#e9ad22", letterSpacing: "0.1em" }}>{"★".repeat(review.rating)}</div>
                      {review.text?.text ? (
                        <p className="mt-5 leading-relaxed" style={{ color: "var(--charcoal)", fontFamily: "var(--font-sans)", fontSize: "1rem" }}>
                          “{review.text.text}”
                        </p>
                      ) : (
                        <p className="mt-5 leading-relaxed" style={{ color: "var(--warm-gray)", fontFamily: "var(--font-sans)", fontSize: "1rem" }}>
                          This Google rating did not include written feedback.
                        </p>
                      )}
                      <div className="mt-6 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
                        <a href={review.authorAttribution.uri} target="_blank" rel="noreferrer" style={{ color: "var(--charcoal)", fontFamily: "var(--font-label)", fontWeight: 500 }}>
                          {review.authorAttribution.displayName}
                        </a>
                        <p style={{ color: "var(--warm-gray)", fontFamily: "var(--font-label)", fontSize: "0.8125rem" }}>{review.relativePublishTimeDescription} · Google</p>
                        <a href={review.googleMapsUri} target="_blank" rel="noreferrer" className="inline-block mt-3" style={{ color: "var(--rose-gold)", fontFamily: "var(--font-label)", fontSize: "0.8125rem", textDecoration: "underline" }}>View original review</a>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </Reveal>

            <p className="text-center mt-3" style={{ color: "var(--warm-gray)", fontFamily: "var(--font-label)", fontSize: "0.8125rem", letterSpacing: "0.08em" }}>
              Auto-advancing · Swipe freely · Continuous loop
            </p>

            <p className="text-center mt-8" style={{ color: "var(--warm-gray)", fontFamily: "var(--font-label)", fontSize: "0.75rem" }}>
              Reviews shown in the relevance order returned by Google. Google does not verify reviews but checks for and removes fake content when identified.
            </p>
          </>
        ) : (
          <Reveal y={20} className="mt-8 text-center">
            <p style={{ color: "var(--warm-gray)", fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.125rem" }}>
              Read every client note in its original context on the verified Google profile.
            </p>
          </Reveal>
        )}
        <div className="text-center mt-5 flex flex-col sm:flex-row justify-center items-center gap-5">
          <a href={profile.googleMapsUri} target="_blank" rel="noreferrer" style={{ color: "var(--rose-gold)", fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.125rem", textDecoration: "underline", textUnderlineOffset: "5px" }}>Read all reviews on Google →</a>
          <Link href="/services" className="inline-block px-9 py-3.5 transition-all duration-300" style={{ background: "var(--rose-gold)", color: "white", border: "1px solid var(--rose-gold)", fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.0625rem" }}>
            See Our Services →
          </Link>
        </div>
      </div>
    </section>
  );
}
