"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

/* Three builds of the same company, one click apart. Exists so the comparison
   is actually takeable rather than three URLs in a chat message. */

const VERSIONS = [
  { href: "/plan", short: "1", label: "As specified" },
  { href: "/", short: "2", label: "Consumer" },
  { href: "/mil", short: "3", label: "Military" },
] as const;

export function VersionSwitch({
  current,
  className,
}: {
  current: "/plan" | "/" | "/mil";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "hidden items-center gap-0.5 rounded-full border border-line p-0.5 md:flex",
        className,
      )}
    >
      {VERSIONS.map((v) => {
        const active = v.href === current;
        return (
          <Link
            key={v.href}
            href={v.href}
            title={v.label}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11.5px] transition-colors duration-200",
              active
                ? "bg-accent text-accent-ink"
                : "text-muted hover:bg-elevated hover:text-ink",
            )}
          >
            <span className="font-mono">{v.short}</span>
            <span className="ml-1.5 hidden lg:inline">{v.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
