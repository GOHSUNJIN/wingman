"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { FlowShell, RAW_IMG_PROPS } from "@/components/style/flow-shell";
import type { Photo } from "@/components/style/style-flow";
import { downscalePhoto } from "@/lib/photo/downscale";
import type { PhotoCheck } from "@/lib/photo/problems";

export function PhotoStep({
  photo,
  onPhoto,
  onNext,
  notice,
}: {
  photo: Photo | null;
  onPhoto: (photo: Photo) => void;
  onNext: () => void;
  /** Shown after "Delete my photo". */
  notice?: string | null;
}) {
  const inputId = useId();
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const latest = useRef<string | null>(null);

  async function choose(file: File | undefined) {
    if (!file) return;
    setProblem(null);
    if (!file.type.startsWith("image/")) return setProblem("That file isn't a photo. Choose a JPEG or PNG.");
    setBusy(true);
    let blob: Blob;
    try {
      blob = await downscalePhoto(file);
    } catch {
      setBusy(false);
      return setProblem("We couldn't read that photo. Try another one.");
    }
    const url = URL.createObjectURL(blob);
    latest.current = url;
    onPhoto({ blob, url });
    setBusy(false);
    setChecking(true);
    const result = await check(blob);
    if (latest.current !== url) return;
    if (result?.zoom) return zoom(file, result.zoom, url);
    onPhoto({ blob, url, check: result });
    setChecking(false);
  }

  async function zoom(file: File, crop: NonNullable<PhotoCheck["zoom"]>, from: string) {
    let blob: Blob;
    try {
      blob = await downscalePhoto(file, undefined, undefined, crop);
    } catch {
      if (latest.current === from) setChecking(false);
      return;
    }
    if (latest.current !== from) return;
    const url = URL.createObjectURL(blob);
    latest.current = url;
    onPhoto({ blob, url, zoomed: true });
    const result = await check(blob);
    if (latest.current !== url) return;
    onPhoto({ blob, url, zoomed: true, check: result });
    setChecking(false);
  }

  const hard = photo?.check?.problems.find((p) => !p.soft);
  const soft = photo?.check?.problems.filter((p) => p.soft) ?? [];
  const shown = hard ? [hard] : soft;

  return (
    <FlowShell step="Photo" wide back={{ label: "Back to the home page", href: "/" }} progress={{ current: 1, total: 3 }}>
      {/* Full-width two-column grid on desktop */}
      <div className="lg:-mx-(--margin) lg:mt-0 lg:grid lg:grid-cols-[1fr_1fr]">

        {/* ── LEFT: Upload zone ── */}
        <label
          htmlFor={inputId}
          className="relative block aspect-[4/5] w-full cursor-pointer overflow-hidden bg-surface transition-colors hover:bg-surface-raised focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brass lg:aspect-auto lg:h-[calc(100dvh-4rem)]"
        >
          {photo ? (
            <Image
              src={photo.url}
              alt="Your photo"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-top"
              {...RAW_IMG_PROPS}
            />
          ) : (
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 text-center">
              <span
                className="absolute inset-6 rounded-sm"
                style={{ border: "1px dashed var(--line)" }}
                aria-hidden
              />
              <span className="relative flex flex-col items-center gap-3">
                <svg
                  viewBox="0 0 24 24"
                  className="size-10 text-brass"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.4}
                  aria-hidden
                >
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1" />
                  <path d="M16 8l-4-4-4 4" />
                  <path d="M12 4v12" />
                </svg>
                <span className="text-lead">
                  {busy ? "Reading your photo…" : "Upload your photo"}
                </span>
                <span className="text-small text-muted-foreground">
                  Waist up, facing the camera
                </span>
              </span>
            </span>
          )}
          {/* Checking overlay on the image */}
          {photo && checking && (
            <p className="absolute inset-x-0 bottom-0 bg-background/80 px-6 py-4 text-small">
              Checking your photo works for a try-on…
            </p>
          )}
          <input
            id={inputId}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              void choose(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>

        {/* ── RIGHT: Content panel ── */}
        <div className="flex flex-col gap-6 py-8 lg:h-[calc(100dvh-4rem)] lg:overflow-y-auto lg:px-12 lg:py-10">

          {/* Heading */}
          <div>
            <h1 className="text-head">Your photo</h1>
            {notice && (
              <p role="status" className="mt-4 bg-surface p-3">
                {notice}
              </p>
            )}
            <p className="mt-4 max-w-[36ch]">
              One photo, waist up, facing the camera in good light. Glasses are fine. Wingman
              tries the shirt or jacket on you; trousers, shoes and watches come as picks beside
              it.
            </p>
          </div>

          {/* Example photo — shown on desktop, hidden on mobile */}
          <figure className="hidden lg:block">
            <div className="relative aspect-[4/5] w-28 overflow-hidden bg-surface">
              <Image
                src="/home/before.jpg"
                alt="Example: waist up, facing the camera"
                fill
                sizes="112px"
                className="object-cover object-[50%_25%]"
              />
            </div>
            <figcaption className="mt-2 text-small text-muted-foreground">Like this</figcaption>
          </figure>

          {/* Tips */}
          <section aria-labelledby="photo-tips">
            <h2 id="photo-tips" className="subhead">
              What works best
            </h2>
            <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 marker:text-muted-foreground">
              <li>Stand facing a window or a lamp, so your face is evenly lit.</li>
              <li>Waist up, with your head, shoulders and chest in the frame.</li>
              <li>Just you, looking straight at the camera.</li>
              <li>Glasses are fine. Hats, masks and hands over your face get in the way.</li>
            </ul>
          </section>

          {/* Problems */}
          {problem && (
            <p role="alert" className="text-danger">
              {problem}
            </p>
          )}
          {photo?.zoomed && !checking && !hard && (
            <p role="status">
              You were a little far from the camera, so we zoomed in to waist up.
            </p>
          )}
          {photo && !checking && shown.length > 0 && (
            <div role="alert" className="bg-surface p-4">
              {shown.map((p) => (
                <div key={p.code} className="not-first:mt-4">
                  <p className="text-lead">{p.message}</p>
                  <p className="mt-1">{p.tip}</p>
                </div>
              ))}
              {!hard && (
                <p className="mt-4 text-muted-foreground">
                  It may still work, so you can use it anyway.
                </p>
              )}
            </div>
          )}

          {/* Action buttons */}
          {photo && !checking && (
            <div className="flex flex-col gap-2">
              {shown.length > 0 ? (
                <label htmlFor={inputId} className="btn w-full cursor-pointer">
                  Choose a different photo
                </label>
              ) : (
                <button type="button" onClick={onNext} className="btn w-full">
                  Use this photo
                </button>
              )}
              {shown.length > 0 && !hard && (
                <button
                  type="button"
                  onClick={onNext}
                  className="text-link flex min-h-11 items-center justify-center"
                >
                  Use it anyway
                </button>
              )}
              {shown.length === 0 && (
                <label
                  htmlFor={inputId}
                  className="text-link flex min-h-11 cursor-pointer items-center justify-center text-muted-foreground"
                >
                  Choose a different photo
                </label>
              )}
            </div>
          )}

          {/* Privacy note — pushed to bottom on desktop */}
          <p className="mt-auto text-small text-muted-foreground">
            Only used to style you. Try-ons are deleted after 24 hours.
          </p>
        </div>
      </div>
    </FlowShell>
  );
}

async function check(blob: Blob): Promise<PhotoCheck | undefined> {
  const form = new FormData();
  form.set("photo", blob, "photo.jpg");
  try {
    const res = await fetch("/api/photo/check", { method: "POST", body: form });
    return res.ok ? ((await res.json()) as PhotoCheck) : undefined;
  } catch {
    return undefined;
  }
}
