import Link from "next/link";

const MENU = [
  { label: "Style me", href: "/style" },
  { label: "Pick the night", href: "#looks" },
  { label: "Three budgets", href: "#budgets" },
  { label: "Fit check", href: "#fit" },
  { label: "How it works", href: "#how" },
  { label: "The stores", href: "#stores" },
];

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t bg-background px-(--margin) pt-16 pb-10 md:pt-24 md:pb-12" style={{ borderColor: "var(--line)" }}>
      <div className="grid gap-12 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-5">
          <p className="font-display text-[2.5rem] leading-none tracking-[-0.02em]">Wingman</p>
          <p className="mt-4 max-w-[32ch] text-muted-foreground">
            AI occasion stylist for men in Singapore. Real stores, real try-ons, one tap to checkout.
          </p>
          <div className="mt-6">
            <Link href="/style" className="btn">
              Style me
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>

        <nav aria-label="Footer" className="md:col-span-5 md:col-start-8 md:self-end">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1 md:flex md:flex-col md:gap-2">
            {MENU.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-link inline-flex min-h-11 items-center text-muted-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p className="mt-12 border-t pt-6 text-small text-muted-foreground" style={{ borderColor: "var(--line)" }}>
        Wingman, built for the YouCam API hackathon. Model photos by MART PRODUCTION, Estefania Milazzo, Gabby K (Monstera Production), Ivan S, Atahan Demir and Alvin Ramadhian on Pexels; every try-on on this page is a real YouCam render, in pieces from Colony Clothing, Kevin Seah and Pharaoh&apos;s Horses.
      </p>
    </footer>
  );
}
