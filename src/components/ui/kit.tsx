import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Base UI. Deliberately hand-rolled rather than pulled from a shadcn registry:
   registry components are copied into the repo and never receive upstream
   fixes, so for a surface this small the dependency isn't worth the debt.
------------------------------------------------------------------------- */

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const buttonBase =
  "relative inline-flex items-center justify-center gap-2 rounded-[var(--radius-field)] font-medium " +
  "transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-out " +
  "active:scale-[0.985] disabled:pointer-events-none disabled:opacity-45 select-none whitespace-nowrap";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-ink hover:brightness-[1.08] shadow-[0_1px_0_rgb(255_255_255/0.14)_inset]",
  secondary: "bg-elevated text-ink border border-line hover:border-line-strong",
  outline: "border border-line-strong text-ink hover:bg-elevated",
  ghost: "text-muted hover:text-ink hover:bg-elevated",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <button
      className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <Link
      className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
      {...props}
    />
  );
}

export function Card({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div className={cn("surface-card", className)} {...props}>
      {children}
    </div>
  );
}

type Tone = "neutral" | "ok" | "warn" | "crit" | "accent";

const toneStyles: Record<Tone, string> = {
  neutral: "border-line text-muted",
  ok: "border-ok/35 text-ok bg-ok/8",
  warn: "border-warn/35 text-warn bg-warn/8",
  crit: "border-crit/35 text-crit bg-crit/8",
  accent: "border-accent/40 text-accent bg-accent/8",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium leading-5",
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Status dot with an optional live pulse ring. */
export function Dot({ tone = "ok", pulse = false }: { tone?: Tone; pulse?: boolean }) {
  const color =
    tone === "ok"
      ? "bg-ok"
      : tone === "warn"
        ? "bg-warn"
        : tone === "crit"
          ? "bg-crit"
          : tone === "accent"
            ? "bg-accent"
            : "bg-faint";
  return (
    <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
      {pulse && (
        <span
          aria-hidden
          className={cn("absolute inset-0 rounded-full motion-reduce:hidden", color)}
          style={{ animation: "pulse-ring 2.4s ease-out infinite" }}
        />
      )}
      <span className={cn("relative h-1.5 w-1.5 rounded-full", color)} />
    </span>
  );
}

/** Uppercase mono section marker. The structural voice of the NOKM surface. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("label-micro flex items-center gap-2.5", className)}>
      <span className="h-px w-6 bg-line-strong" aria-hidden />
      {children}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-faint">{hint}</span>}
    </label>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-[var(--radius-field)] border border-line bg-surface px-3 text-sm text-ink",
        "placeholder:text-faint transition-colors duration-200",
        "hover:border-line-strong focus:border-accent focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}

/** Animated determinate meter. Width transitions on mount via CSS, so it
 *  costs nothing in the JS frame loop. */
export function Meter({
  value,
  tone = "accent",
  className,
  label,
}: {
  value: number;
  tone?: Tone;
  className?: string;
  label?: string;
}) {
  const bar =
    tone === "ok"
      ? "bg-ok"
      : tone === "warn"
        ? "bg-warn"
        : tone === "crit"
          ? "bg-crit"
          : "bg-accent";
  return (
    <div className={className}>
      {label && (
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="label-micro">{label}</span>
          <span className="tnum text-[11px] text-muted">{Math.round(value * 100)}%</span>
        </div>
      )}
      <div
        className="h-1 w-full overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuenow={Math.round(value * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "progress"}
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-[1200ms]", bar)}
          style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, transitionTimingFunction: "var(--ease-out-expo)" }}
        />
      </div>
    </div>
  );
}
