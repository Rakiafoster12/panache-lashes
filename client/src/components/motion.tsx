/**
 * PANACHE Ivory Atelier — Scroll Motion Primitives
 * Editorial, restrained, fashion-house motion. Never bouncy, never flashy.
 * All effects respect prefers-reduced-motion via useReducedMotion.
 *
 * Primitives:
 *  - Parallax        : scroll-linked translateY depth for images/sections
 *  - Reveal          : cinematic entrance (fade + rise + optional blur-clear)
 *  - LineReveal      : headline that rises out of an overflow-hidden mask
 *  - ScaleImage      : image that gently de-zooms (1.15 → 1) as it enters
 *  - CountUp         : scroll-triggered number counter
 *  - DrawRule        : rose-gold rule that draws itself in on scroll
 *  - ScrollProgress  : thin rose-gold page progress bar under the nav
 *
 * Signature moments (the "wow" layer — still restrained):
 *  - Tilt            : cursor-reactive parallax tilt for the hero portrait
 *  - CursorDot       : custom rose-gold cursor dot + trailing ring (desktop only)
 *  - GrainOverlay    : faint film-grain texture over the whole page
 *  - GhostNumeral    : oversized ghosted serif numeral behind a section
 *  - MarqueeBand     : slow editorial marquee strip (brand · est · city)
 *  - HorizontalGallery : pinned section whose panels glide sideways on scroll
 *  - IntroReveal     : one-time wordmark curtain on first visit per session
 */
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useReducedMotion,
  useMotionValue,
  animate,
  AnimatePresence,
} from "framer-motion";

const EASE = [0.23, 1, 0.32, 1] as const;

/* ── Parallax: scroll-linked vertical drift ── */
export function Parallax({
  children,
  amount = 60,
  className,
  style,
}: {
  children: React.ReactNode;
  amount?: number; // px of total drift across the element's scroll journey
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  const classPosition = (className ?? "").match(/\b(absolute|fixed|relative|sticky)\b/)?.[1] as
    | React.CSSProperties["position"]
    | undefined;
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, position: style?.position ?? classPosition ?? "relative", y: reduced ? 0 : y }}
    >
      {children}
    </motion.div>
  );
}

/* ── Reveal: cinematic entrance with soft blur-clear ── */
export function Reveal({
  children,
  delay = 0,
  y = 36,
  blur = true,
  once = true,
  className,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  blur?: boolean;
  once?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      initial={
        reduced
          ? { opacity: 1 }
          : { opacity: 0, y, filter: blur ? "blur(6px)" : "none" }
      }
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, amount: 0.25, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ── LineReveal: text rises out of a clipped mask, line by line ── */
export function LineReveal({
  lines,
  delay = 0,
  stagger = 0.14,
  onMount = false,
  as: Tag = "span",
  lineClassName,
  lineStyle,
}: {
  lines: React.ReactNode[];
  delay?: number;
  stagger?: number;
  /** Animate immediately on mount (for above-the-fold heroes) instead of waiting for scroll into view */
  onMount?: boolean;
  as?: React.ElementType;
  lineClassName?: string;
  lineStyle?: React.CSSProperties;
}) {
  const reduced = useReducedMotion();
  const transition = (i: number) => ({ duration: 1.0, delay: delay + i * stagger, ease: EASE });
  return (
    <>
      {lines.map((line, i) => (
        <Tag key={i} className={lineClassName} style={{ display: "block", overflow: "hidden", ...lineStyle }}>
          {onMount ? (
            <motion.span
              style={{ display: "block" }}
              initial={reduced ? { y: 0 } : { y: "110%" }}
              animate={{ y: 0 }}
              transition={transition(i)}
            >
              {line}
            </motion.span>
          ) : (
            <motion.span
              style={{ display: "block" }}
              initial={reduced ? { y: 0 } : { y: "110%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, amount: 0.2, margin: "0px 0px -10% 0px" }}
              transition={transition(i)}
            >
              {line}
            </motion.span>
          )}
        </Tag>
      ))}
    </>
  );
}

/* ── ScaleImage: gentle de-zoom on entrance (editorial "settle") ── */
export function ScaleImage({
  src,
  alt,
  className,
  style,
  imgClassName,
  imgStyle,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  imgClassName?: string;
  imgStyle?: React.CSSProperties;
}) {
  const reduced = useReducedMotion();
  return (
    <div className={className} style={{ overflow: "hidden", ...style }}>
      <motion.img
        src={src}
        alt={alt}
        className={imgClassName}
        style={{ display: "block", width: "100%", ...imgStyle }}
        initial={reduced ? { scale: 1 } : { scale: 1.14, opacity: 0.6 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4, ease: EASE }}
      />
    </div>
  );
}

/* ── CountUp: scroll-triggered number counter ── */
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1.6,
  className,
  style,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(String(to));
      return;
    }
    const controls = animate(mv, to, {
      duration,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (v) => setDisplay(String(Math.round(v))),
    });
    return controls.stop;
  }, [inView, to, duration, reduced, mv]);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ── DrawRule: rose-gold rule that draws itself in ── */
export function DrawRule({
  width = "3rem",
  className,
  style,
  center = false,
}: {
  width?: string;
  className?: string;
  style?: React.CSSProperties;
  center?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      className={className}
      style={{
        display: "block",
        height: "1px",
        background: "var(--rose-gold)",
        transformOrigin: center ? "center" : "left",
        width,
        ...style,
      }}
      initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.9 }}
      transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
    />
  );
}

/* ── ScrollProgress: thin rose-gold bar tracking page scroll ── */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        background: "var(--rose-gold)",
        transformOrigin: "left",
        scaleX,
        zIndex: 60,
      }}
    />
  );
}

/* ── Tilt: cursor-reactive parallax tilt (hero portrait) ── */
export function Tilt({
  children,
  maxDeg = 2.5,
  className,
  style,
}: {
  children: React.ReactNode;
  maxDeg?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 60, damping: 18, mass: 0.6 });
  const sry = useSpring(ry, { stiffness: 60, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (reduced) return;
    // Only on devices with a fine pointer (mouse)
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5; // -0.5..0.5
      const ny = e.clientY / window.innerHeight - 0.5;
      ry.set(nx * maxDeg * 2);
      rx.set(-ny * maxDeg * 2);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced, maxDeg, rx, ry]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        rotateX: reduced ? 0 : srx,
        rotateY: reduced ? 0 : sry,
        transformPerspective: 1200,
        willChange: "transform",
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── CursorDot: rose-gold dot + trailing ring, desktop fine-pointer only ── */
export function CursorDot() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 140, damping: 20, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 140, damping: 20, mass: 0.5 });
  const [hoveringLink, setHoveringLink] = useState(false);

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      setHoveringLink(!!t?.closest("a, button, [role='button'], input, select, textarea, label"));
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced, x, y]);

  if (!enabled) return null;
  return (
    <>
      {/* Trailing ring */}
      <motion.div
        aria-hidden
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          width: hoveringLink ? 44 : 30,
          height: hoveringLink ? 44 : 30,
          borderRadius: "50%",
          border: "1px solid var(--rose-gold)",
          opacity: hoveringLink ? 0.9 : 0.45,
          pointerEvents: "none",
          zIndex: 9999,
          transition: "width 0.25s cubic-bezier(0.23,1,0.32,1), height 0.25s cubic-bezier(0.23,1,0.32,1), opacity 0.25s",
        }}
      />
      {/* Core dot */}
      <motion.div
        aria-hidden
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "var(--rose-gold)",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
    </>
  );
}

/* ── GrainOverlay: faint film grain over the page (pure SVG, no asset) ── */
export function GrainOverlay() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 80,
        opacity: 0.035,
        backgroundImage:
          `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
      }}
    />
  );
}

/* ── GhostNumeral: oversized ghosted serif numeral behind a section ── */
export function GhostNumeral({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={className}
      style={{
        position: "absolute",
        fontFamily: "var(--font-display)",
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: "clamp(10rem, 22vw, 20rem)",
        lineHeight: 1,
        color: "var(--rose-gold)",
        opacity: 0.07,
        userSelect: "none",
        pointerEvents: "none",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/* ── MarqueeBand: slow editorial marquee strip ── */
export function MarqueeBand({
  items = ["PANACHE®", "EST. 2020", "TROY, MICHIGAN", "EVERY LASH, INTENTIONAL"],
  dark = false,
}: {
  items?: string[];
  dark?: boolean;
}) {
  const reduced = useReducedMotion();
  const sequence = [...items, ...items, ...items, ...items];
  const color = dark ? "oklch(0.55 0.02 45)" : "oklch(0.80 0.03 50)";
  const border = dark ? "oklch(0.26 0.01 300)" : "oklch(0.90 0.012 60)";
  return (
    <div
      aria-hidden
      style={{
        overflow: "hidden",
        borderTop: `1px solid ${border}`,
        borderBottom: `1px solid ${border}`,
        background: dark ? "oklch(0.14 0.01 300)" : "transparent",
        padding: "1.1rem 0",
      }}
    >
      <motion.div
        style={{ display: "flex", gap: "3.5rem", whiteSpace: "nowrap", width: "max-content" }}
        animate={reduced ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        {sequence.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "var(--font-label)",
              fontSize: "0.8125rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color,
              display: "inline-flex",
              alignItems: "center",
              gap: "3.5rem",
            }}
          >
            {item}
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--rose-gold)", opacity: 0.6, display: "inline-block" }} />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ── HorizontalGallery: pinned section, panels glide sideways on scroll ── */
export function HorizontalGallery({
  children,
  heightMultiplier = 2.6,
}: {
  children: React.ReactNode;
  heightMultiplier?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [shift, setShift] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -shift]);
  const springX = useSpring(x, { stiffness: 90, damping: 26, mass: 0.4 });

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const overflow = trackRef.current.scrollWidth - window.innerWidth;
      setShift(Math.max(0, overflow));
    };
    measure();
    window.addEventListener("resize", measure);
    // re-measure after images load
    const t = setTimeout(measure, 600);
    return () => { window.removeEventListener("resize", measure); clearTimeout(t); };
  }, []);

  if (reduced) {
    // Reduced motion: plain horizontal scroll, no pinning
    return (
      <div style={{ overflowX: "auto" }}>
        <div ref={trackRef} style={{ display: "flex", width: "max-content" }}>{children}</div>
      </div>
    );
  }

  return (
    <div ref={ref} style={{ height: `${heightMultiplier * 100}vh`, position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "flex", alignItems: "center" }}>
        <motion.div ref={trackRef} style={{ display: "flex", width: "max-content", x: springX }}>
          {children}
        </motion.div>
      </div>
    </div>
  );
}

/* ── IntroReveal: wordmark curtain on fresh page load of the home page only.
   A module-level flag (reset only by a full page load) prevents replays on
   client-side navigation back to Home. ── */
let introPlayed = false;

export function IntroReveal() {
  const reduced = useReducedMotion();
  const [show, setShow] = useState(() => !introPlayed);

  useEffect(() => {
    if (!show) return;
    introPlayed = true;
    const t = setTimeout(() => setShow(false), reduced ? 400 : 1900);
    return () => clearTimeout(t);
  }, [show, reduced]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "var(--ivory)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {/* Phase 1: masked vertical rise (clip released after rise completes).
              Phase 2: free scale-up on the outer wrapper — never clipped. */}
          <motion.span
            style={{ display: "block" }}
            initial={reduced ? { scale: 1 } : { scale: 0.92 }}
            animate={{ scale: reduced ? 1 : 1.12 }}
            transition={{ duration: 1.7, delay: 0.1, ease: EASE }}
          >
            <MaskedRiseLogo reduced={!!reduced} />
          </motion.span>
          <motion.span
            style={{ display: "block", height: "1px", background: "var(--rose-gold)", width: "6rem", transformOrigin: "left" }}
            initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Inner logo: clipped only during the rise, then the clip is released so the
   outer scale-up can expand beyond the original bounds without cut-off. */
function MaskedRiseLogo({ reduced }: { reduced: boolean }) {
  const [risen, setRisen] = useState(reduced);
  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => setRisen(true), 1050); // rise: 0.9s + 0.1s delay + buffer
    return () => clearTimeout(t);
  }, [reduced]);
  return (
    <span style={{ display: "block", overflow: risen ? "visible" : "hidden" }}>
      <motion.img
        src="/manus-storage/panache-logo-black-trimmed_b79f88ee_633dc4c1.png"
        alt="PANACHE LASHES®"
        width="1508"
        height="438"
        loading="eager"
        decoding="async"
        style={{ height: "5rem", width: "auto", display: "block" }}
        initial={reduced ? { y: 0 } : { y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
        draggable={false}
      />
    </span>
  );
}
