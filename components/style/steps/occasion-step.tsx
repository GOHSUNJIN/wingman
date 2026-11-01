"use client";

import Image from "next/image";
import { useId } from "react";
import { FlowShell, RAW_IMG_PROPS } from "@/components/style/flow-shell";
import type { Photo } from "@/components/style/style-flow";
import { type Occasion, type Tier } from "@/lib/catalog/types";
import { OCCASION_CHOICES, TIER_LABELS } from "@/lib/occasions";
import { cn } from "@/lib/utils/cn";

export function OccasionStep(props: {
  photo: Photo | null;
  occasionId: Occasion;
  sentence: string;
  tier: Tier;
  onOccasion: (id: Occasion) => void;
  onSentence: (s: string) => void;
  onTier: (t: Tier) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const textId = useId();
  const ready = props.sentence.trim().length >= 3;

  return (
    <FlowShell step="Occasion" wide progress={{ current: 2, total: 3 }}>
      {/* Full-width two-column grid on desktop */}
      <div className="lg:-mx-(--margin) lg:mt-0 lg:grid lg:grid-cols-[1fr_1fr]">

        {/* ── LEFT: User's photo fills the left half on desktop ── */}
        <div className="relative hidden lg:block lg:h-[calc(100dvh-4rem)]">
          {props.photo ? (
            <Image
              src={props.photo.url}
              alt=""
              fill
              sizes="50vw"
              className="object-cover object-[50%_20%]"
              {...RAW_IMG_PROPS}
            />
          ) : (
            <div className="h-full bg-surface" />
          )}
          {/* Neutral scrim at bottom so text is legible if added later */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
            style={{ background: "linear-gradient(to top, var(--bg) 0%, transparent 100%)" }}
          />
        </div>

        {/* ── RIGHT: Form panel ── */}
        <div className="flex flex-col py-8 lg:h-[calc(100dvh-4rem)] lg:overflow-y-auto lg:px-12 lg:py-10">

          {/* Heading row — photo thumbnail visible on mobile */}
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-head">The occasion</h1>
            {props.photo && (
              <button
                type="button"
                onClick={props.onBack}
                className="relative size-14 shrink-0 overflow-hidden bg-surface lg:hidden"
                aria-label="Change your photo"
              >
                <Image
                  src={props.photo.url}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                  {...RAW_IMG_PROPS}
                />
              </button>
            )}
          </div>

          <form
            className="mt-8 flex flex-col gap-8"
            onSubmit={(e) => {
              e.preventDefault();
              if (ready) props.onSubmit();
            }}
          >
            {/* Occasion chips */}
            <fieldset>
              <legend className="font-medium">Where are you headed?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {OCCASION_CHOICES.map((o) => {
                  const on = props.occasionId === o.id;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => props.onOccasion(o.id)}
                      className={cn(
                        "min-h-11 px-4 transition-colors",
                        on
                          ? "bg-brass text-background"
                          : "bg-surface text-ivory hover:bg-surface-raised",
                      )}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Free-text description */}
            <div>
              <label htmlFor={textId} className="font-medium">
                Tell Wingman about it
              </label>
              <textarea
                id={textId}
                value={props.sentence}
                onChange={(e) => props.onSentence(e.target.value)}
                maxLength={300}
                rows={3}
                placeholder="Where, when, and anything you want or want to avoid"
                aria-describedby={`${textId}-hint`}
                className="mt-3 block w-full resize-none bg-surface p-4 text-lead leading-snug placeholder:text-muted-foreground focus:bg-surface-raised focus:outline-2 focus:outline-brass"
              />
              <p id={`${textId}-hint`} className="mt-2 text-small text-muted-foreground">
                Say where, when and how you want to look. For example: &ldquo;Wedding dinner at a
                hotel ballroom, sharp but not stiff.&rdquo;
              </p>
            </div>

            {/* Budget tiers */}
            <fieldset>
              <legend className="font-medium">Budget</legend>
              <div role="radiogroup" aria-label="Budget" className="mt-3 grid grid-cols-3 gap-1">
                {(
                  [
                    { t: "budget", hint: "Under S$200 per piece" },
                    { t: "mid", hint: "S$200–500 per piece" },
                    { t: "luxury", hint: "S$500+ per piece" },
                  ] as const
                ).map(({ t, hint }) => {
                  const on = props.tier === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => props.onTier(t)}
                      className={cn(
                        "flex min-h-[4.5rem] flex-col items-center justify-center gap-1 rounded-sm border px-2 py-3 text-center transition-all duration-200",
                        on
                          ? "border-brass bg-surface-raised text-ivory shadow-[0_0_0_1px_var(--brass)]"
                          : "border-transparent bg-surface text-ivory hover:bg-surface-raised",
                      )}
                    >
                      <span className="font-medium">{TIER_LABELS[t]}</span>
                      <span className="text-small leading-tight text-muted-foreground">{hint}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={!ready}
                className="btn w-full disabled:opacity-50"
              >
                Style me
                <svg
                  viewBox="0 0 24 24"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  aria-hidden
                >
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={props.onBack}
                className="text-link min-h-11 text-muted-foreground"
              >
                Back to your photo
              </button>
            </div>
          </form>
        </div>
      </div>
    </FlowShell>
  );
}
