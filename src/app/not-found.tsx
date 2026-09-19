import Link from "next/link";
import { fontVars } from "@/lib/fonts";
import "./globals.css";

/**
 * Global 404.
 *
 * With two root layouts there is no shared <html> for Next to hang this off,
 * so this route renders its own document. It uses the consumer brand because
 * an unmatched URL has no product context to infer from.
 */
export default function NotFound() {
  return (
    <html lang="en" data-brand="nok" className={`${fontVars} h-full antialiased`}>
      <body className="min-h-full bg-bg text-ink">
        <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-20">
          <div className="label-micro">404</div>
          <h1 className="mt-5 font-display text-[clamp(2rem,4.6vw,2.9rem)] leading-[1.06]">
            Nothing filed here.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-muted">
            Which is the one place a missing record is not a problem.
          </p>
          <div className="mt-9 flex flex-wrap gap-5 text-[14px]">
            <Link href="/" className="text-accent underline-offset-4 hover:underline">
              Next of Kin
            </Link>
            <Link href="/app" className="text-muted underline-offset-4 hover:underline hover:text-ink">
              The family record
            </Link>
            <Link href="/mil" className="text-muted underline-offset-4 hover:underline hover:text-ink">
              NOKM, for service families
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
