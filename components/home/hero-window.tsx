"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

type Props = {
  after: string;
  alt: string;
};

export function HeroWindow({ after, alt }: Props) {
  const ref = useRef<HTMLElement>(null);

  // Scroll progress drives --p: 0 is the small window, 1 is full-bleed
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const distance = window.innerHeight * (window.innerWidth >= 900 ? 1 : 0.7);
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / distance));
      el.style.setProperty("--p", p.toFixed(4));
      el.toggleAttribute("data-open", p > 0.42);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={ref} className="hero relative" aria-labelledby="hero-heading">
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Picture layer */}
        <div className="hero__window absolute inset-0 bg-surface">
          <div className="hero__picture absolute inset-0">
            <Image
              src={after}
              alt={`${alt}, styled by Wingman`}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[50%_22%] min-[900px]:object-[50%_42%]"
            />
          </div>
        </div>

        {/* Text */}
        <div className="hero__text pointer-events-none absolute inset-0 px-(--margin)">
          <header className="pointer-events-auto flex h-16 items-center justify-between pt-[env(safe-area-inset-top)] md:h-20">
            <span style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: "20px", letterSpacing: "0.2em", color: "#ECEBE8" }}>WINGMAN</span>
            <nav aria-label="Main" className="flex gap-6 text-small">
              <a href="#looks" className="text-link hidden min-h-11 items-center md:inline-flex">
                The looks
              </a>
              <a href="#how" className="text-link hidden min-h-11 items-center md:inline-flex">
                How it works
              </a>
              <Link href="/style" className="text-link inline-flex min-h-11 items-center">
                Style me
              </Link>
            </nav>
          </header>

          <h1
            id="hero-heading"
            className="italic absolute top-[calc(env(safe-area-inset-top)+4.5rem)] left-(--margin) text-[10vw] min-[900px]:top-auto min-[900px]:bottom-[calc(var(--text-bottom)-0.08em)] min-[900px]:max-w-[calc(var(--side)-3rem)] min-[900px]:text-[min(calc((28vw-3rem)/5.9),5.5rem)]"
          >
            <span className="rise-line">
              <span style={{ "--i": 0 } as React.CSSProperties}>See it</span>
            </span>
            <span className="rise-line">
              <span style={{ "--i": 1 } as React.CSSProperties}>on you</span>
            </span>
          </h1>

          <div className="pointer-events-auto absolute inset-x-(--margin) top-[calc(var(--win-top)+var(--win-h)+1.25rem)] min-[900px]:inset-x-auto min-[900px]:top-auto min-[900px]:right-(--margin) min-[900px]:bottom-(--text-bottom) min-[900px]:w-[min(calc(var(--side)-3rem),24rem)]">
            <p data-load style={{ "--d": "420ms" } as React.CSSProperties} className="max-w-[34ch] text-body">
              One photo, one sentence, and you have a complete outfit tried on you. From stores you can buy from today.
            </p>
            <div data-load style={{ "--d": "500ms" } as React.CSSProperties} className="mt-4 flex flex-col gap-1 min-[900px]:mt-6">
              <Link href="/style" className="btn w-full min-[900px]:w-auto min-[900px]:self-start">
                Start with a photo
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
