/**
 * Loads the display face (Plus Jakarta Sans) for the social cards.
 *
 * Satori (which renders next/og) cannot use next/font or CSS — it needs raw
 * font bytes. So the TTF is fetched at build time from the Google Fonts CSS
 * API.
 *
 * Wrapped in a failure path on purpose: a social card is not worth failing a
 * deploy over. If the font cannot be fetched the cards render in Satori's
 * default face, which is plain but correct, and the build proceeds.
 */
export async function displayFontData(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700&display=swap",
      {
        headers: {
          // Google serves woff2 to modern UAs and TTF to older ones. Satori
          // needs TTF/OTF, so ask as an old browser.
          "User-Agent": "Mozilla/5.0 (Windows NT 6.1)",
        },
      },
    ).then((r) => (r.ok ? r.text() : ""));

    const url = css.match(/src:\s*url\(([^)]+)\)\s*format\('truetype'\)/)?.[1];
    if (!url) return null;

    const res = await fetch(url);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}
