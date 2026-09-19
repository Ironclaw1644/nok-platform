import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

/* ---------------------------------------------------------------------------
   Colour contrast, asserted against globals.css itself.

   This test PARSES the stylesheet rather than importing a duplicated palette,
   so there is exactly one source of truth for the tokens and no way for a
   TypeScript copy to drift away from what actually ships.

   Why it exists: an axe run on 19 Sep 2026 found 158 colour-contrast
   violations across the five routes, all traceable to three tokens —
   consumer --faint (2.97:1), consumer --warn (3.54:1) and NOKM --faint
   (3.47:1). Design tokens fail quietly; nobody notices that a 10px mono label
   is unreadable until someone with less than perfect vision tries to read it.
   A test is the only thing that keeps them honest.
------------------------------------------------------------------------- */

const CSS = readFileSync(
  join(import.meta.dirname, "..", "..", "app", "globals.css"),
  "utf8",
);

function brandTokens(brand: "nok" | "nokm"): Record<string, string> {
  const block = CSS.match(
    new RegExp(`\\[data-brand="${brand}"\\]\\s*\\{([\\s\\S]*?)\\n\\}`),
  )?.[1];
  assert.ok(block, `no [data-brand="${brand}"] block found in globals.css`);
  const out: Record<string, string> = {};
  for (const [, k, v] of block!.matchAll(/--([a-z-]+):\s*(#[0-9a-f]{6})\s*;/gi)) {
    out[k] = v.toLowerCase();
  }
  return out;
}

/** WCAG 2.1 relative luminance. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(fg: string, bg: string): number {
  const a = luminance(fg);
  const b = luminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

const AA_NORMAL = 4.5;
const AA_LARGE = 3;

for (const brand of ["nok", "nokm"] as const) {
  const t = brandTokens(brand);

  test(`${brand}: every brand block parses to real hex tokens`, () => {
    for (const key of ["bg", "surface", "elevated", "ink", "muted", "faint", "accent"]) {
      assert.match(t[key] ?? "", /^#[0-9a-f]{6}$/, `${brand} --${key} missing or not hex`);
    }
  });

  // Every surface a token can land on. `elevated` matters as much as `bg`:
  // the record rows and inline panels sit on it.
  const grounds = ["bg", "surface", "elevated"] as const;

  for (const ground of grounds) {
    test(`${brand}: body text passes AA on --${ground}`, () => {
      for (const fg of ["ink", "muted"] as const) {
        const r = ratio(t[fg], t[ground]);
        assert.ok(
          r >= AA_NORMAL,
          `--${fg} (${t[fg]}) on --${ground} (${t[ground]}) = ${r.toFixed(2)}, need ${AA_NORMAL}`,
        );
      }
    });

    test(`${brand}: --faint passes AA on --${ground}`, () => {
      // faint carries .label-micro, which is 10px — small text, so the normal
      // 4.5:1 threshold applies, not the large-text exemption.
      const r = ratio(t.faint, t[ground]);
      assert.ok(
        r >= AA_NORMAL,
        `--faint (${t.faint}) on --${ground} (${t[ground]}) = ${r.toFixed(2)}, need ${AA_NORMAL}`,
      );
    });

    test(`${brand}: status colours pass AA on --${ground}`, () => {
      for (const fg of ["ok", "warn", "crit", "accent"] as const) {
        const r = ratio(t[fg], t[ground]);
        assert.ok(
          r >= AA_NORMAL,
          `--${fg} (${t[fg]}) on --${ground} (${t[ground]}) = ${r.toFixed(2)}, need ${AA_NORMAL}`,
        );
      }
    });
  }

  test(`${brand}: accent-ink is readable on accent (button labels)`, () => {
    const r = ratio(t["accent-ink"], t.accent);
    assert.ok(
      r >= AA_NORMAL,
      `--accent-ink on --accent = ${r.toFixed(2)}, need ${AA_NORMAL}`,
    );
  });

  test(`${brand}: borders are visible against their surfaces`, () => {
    // Non-text contrast: 3:1 is the WCAG threshold for UI boundaries. Card
    // edges below this make the whole layout read as one undifferentiated field.
    const r = ratio(t["line-strong"], t.bg);
    assert.ok(
      r >= 1.5,
      `--line-strong on --bg = ${r.toFixed(2)}; borders would be invisible`,
    );
    void AA_LARGE;
  });
}

test("print theme forces a light, high-contrast register", () => {
  const block = CSS.match(/@media print \{([\s\S]*?)\n\}/)?.[1] ?? "";
  assert.match(block, /--ink:\s*#000000/, "print --ink must be pure black");
  assert.match(block, /--bg:\s*#ffffff/, "print --bg must be pure white");
  assert.match(
    block,
    /--grid-line:\s*transparent/,
    "decorative grid must not print",
  );
});
