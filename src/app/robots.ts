import type { MetadataRoute } from "next";

/**
 * Pre-release: not indexable.
 *
 * Three reasons, all of which stop applying the day this becomes a real
 * launch — at which point delete this file.
 *
 * 1. Two of the three surfaces describe a product that does not exist yet.
 *    An indexed page promising encrypted vaults and survivor packets, backed
 *    by no backend, is a claim we cannot honour.
 * 2. /plan renders a third party's business plan. That is for internal
 *    comparison, not publication.
 * 3. /mil sits next to genuinely sensitive subject matter. A search result
 *    for a veteran's family that leads to an unfinished demo is worse than
 *    no result.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
