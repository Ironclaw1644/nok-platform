"use client";

import {
  motion,
  stagger,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Motion primitives.

   House rules, applied everywhere below:
   1. Reduced motion is gated AT THE SOURCE. Every primitive checks
      useReducedMotion() and returns the END state — never a half-built layout.
   2. Only transform/opacity animate on scroll paths. Those are the two
      properties that are composited everywhere; filter and clip-path are not.
   3. Scroll position lives in MotionValues, never in useState. Mirroring it
      into React state re-renders the tree on every frame and is the single
      most common way these pages end up janky.
------------------------------------------------------------------------- */

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * True only after hydration.
 *
 * `useReducedMotion()` cannot be consulted on the server — there is no media
 * query there — so it is effectively false during SSR and may be true on the
 * client's very first render. Any component whose RENDERED OUTPUT (markup or
 * text, as opposed to an animation prop) depends on it will therefore produce
 * two different trees and trip React hydration error #418.
 *
 * Gating on this hook makes the first client render identical to the server's,
 * and lets the reduced-motion end state apply on the render immediately after.
 * Use it anywhere `reduce` decides what is on the page rather than how it moves.
 */
const noopSubscribe = () => () => {};

export function useHydrated() {
  // useSyncExternalStore rather than useEffect+setState: it is the primitive
  // React provides for exactly this — a value that differs between the server
  // snapshot and the client — and it avoids the extra render pass the effect
  // version costs on every mount.
  return useSyncExternalStore(
    noopSubscribe,
    () => true, // client
    () => false, // server
  );
}

/** Fade + rise on scroll entry. The workhorse. */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  once = true,
  className,
  amount = 0.35,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
  className?: string;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: stagger(0.07) } },
};

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Parent for StaggerItem children. Variants propagate automatically —
 *  children declare `variants` only, never their own `animate`. */
export function Stagger({
  children,
  className,
  amount = 0.3,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={staggerChild}>
      {children}
    </motion.div>
  );
}

/**
 * Word-by-word headline reveal.
 *
 * Splitting on words rather than characters is deliberate: per-character
 * reveals on a headline about death read as a gimmick, and they destroy
 * screen-reader output. The whole string stays in one accessible node via
 * aria-label; the animated spans are hidden from AT.
 */
export function SplitWords({
  text,
  className,
  delay = 0,
  step = 0.055,
  as: Tag = "h1",
}: {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const words = text.split(" ");

  /*
   * NOTE: there is deliberately no `if (reduce) return <Tag>{text}</Tag>`
   * branch here, and it must not come back.
   *
   * It caused React hydration error #418 for every reduced-motion user. The
   * server has no media query, so it always rendered the animated span
   * structure; a client with prefers-reduced-motion rendered flat text
   * instead, the markup disagreed, and React threw away the server HTML.
   *
   * Motion handles this correctly on its own: <MotionConfig reducedMotion=
   * "user"> in the root layout suppresses the transform, so these words fade
   * in without moving. Fade is the accepted reduced-motion behaviour — it is
   * movement that triggers vestibular symptoms, not opacity.
   */
  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        aria-hidden
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { delayChildren: stagger(step, { startDelay: delay }) } },
        }}
        style={{ display: "inline" }}
      >
        {words.map((w, i) => (
          <span key={`${w}-${i}`} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "108%", opacity: 0 },
                visible: { y: "0%", opacity: 1, transition: { duration: 0.85, ease: EASE } },
              }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/** Count up to a value when scrolled into view. Driven by rAF via Motion's
 *  frame loop rather than setInterval so it stays in sync with everything else. */
export function Counter({
  to,
  from = 0,
  duration = 1.4,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  // Gated: this decides the TEXT on the page, so it must match the server.
  // Both hooks run unconditionally — `&&` would short-circuit the second.
  const prefersReduce = useReducedMotion();
  const hydrated = useHydrated();
  const reduce = prefersReduce && hydrated;
  const [value, setValue] = useState(from);

  useEffect(() => {
    // The reduced-motion end state is DERIVED at render (see `display` below)
    // rather than pushed through setState here. useReducedMotion resolves
    // after first paint, so setting state on it would schedule a cascading
    // render for every counter on the page.
    if (!inView || reduce) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      // easeOutExpo — fast arrival, long settle. Matches the page's easing.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(from + (to - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, from, duration, reduce]);

  const display = reduce ? to : value;

  return (
    <span ref={ref} className={cn("tnum", className)}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/** Cursor-following highlight. Pure CSS var + MotionTemplate, no re-renders. */
export function Spotlight({
  children,
  className,
  size = 420,
}: {
  children: ReactNode;
  className?: string;
  size?: number;
}) {
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const reduce = useReducedMotion();
  const background = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, var(--glow), transparent 70%)`;

  return (
    <div
      className={cn("group relative", className)}
      onPointerMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerLeave={() => {
        x.set(-9999);
        y.set(-9999);
      }}
    >
      {/* Rendered unconditionally so the markup matches the server; the
          pointer handler simply never moves it when motion is reduced. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background }}
      />
      {children}
    </div>
  );
}

/** Subtle magnetic pull toward the cursor. Springs, so release feels physical. */
export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 22, mass: 0.6 });
  const y = useSpring(my, { stiffness: 260, damping: 22, mass: 0.6 });

  // Always the same element. Returning a plain <div> when reduced changed the
  // markup between server and client and tripped hydration error #418; now
  // only the handlers are withheld, so nothing moves but the tree matches.
  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduce) return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - (r.left + r.width / 2)) * strength);
        my.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Parallax translate driven by the element's own scroll progress. */
export function Parallax({
  children,
  distance = 60,
  className,
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.4 });
  const y = useTransform(smooth, [0, 1], [distance, -distance]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}

/** Thin scroll-progress rule pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-100 h-px origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}

/** Infinite horizontal marquee. CSS-driven — no JS in the frame loop. */
export function Marquee({
  children,
  speed = 40,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  return (
    <div className={cn("relative flex overflow-hidden", className)}>
      <div
        className="flex shrink-0 gap-10 pr-10 motion-reduce:animate-none"
        style={{ animation: `marquee ${speed}s linear infinite` }}
      >
        <div className="flex shrink-0 items-center gap-10 pr-10">{children}</div>
        <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
