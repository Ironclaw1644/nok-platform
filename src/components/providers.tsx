"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * reducedMotion="user" makes every Motion component in the tree honour the OS
 * setting automatically — transform and opacity animations are dropped while
 * layout animations still run, so nothing ends up half-positioned. The CSS
 * side of the same guarantee lives in globals.css.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
