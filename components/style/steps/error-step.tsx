"use client";

import { FlowShell } from "@/components/style/flow-shell";

/** Photo problems need a new photo; everything else can simply be retried. */
const PHOTO_CODES = new Set(["NO_FACE", "BAD_LIGHTING"]);

function ErrorIcon({ code }: { code: string }) {
  if (PHOTO_CODES.has(code)) {
    return (
      <svg viewBox="0 0 24 24" className="size-10 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    );
  }
  if (code === "NO_LOOKS") {
    return (
      <svg viewBox="0 0 24 24" className="size-10 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35M8 11h6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="size-10 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function ErrorStep({
  code,
  message,
  onRetry,
  onNewPhoto,
  onBack,
  onDeletePhoto,
}: {
  code: string;
  message: string;
  onRetry: () => void;
  onNewPhoto: () => void;
  onBack: () => void;
  onDeletePhoto: () => void;
}) {
  const photoProblem = PHOTO_CODES.has(code);
  return (
    <FlowShell step="Styling">
      <div className="mt-8">
        <ErrorIcon code={code} />
      </div>
      <h1 className="mt-4 text-head">
        {photoProblem ? "Try another photo" : code === "NO_LOOKS" ? "No matches found" : "That didn't work"}
      </h1>
      <p role="alert" className="mt-4 max-w-[38ch] text-lead">
        {message}
      </p>
      {photoProblem && (
        <p className="mt-4 max-w-[38ch] text-muted-foreground">
          Waist up, facing the camera, in even light. Glasses are fine.
        </p>
      )}
      <div className="mt-8 flex flex-col gap-2">
        {photoProblem ? (
          <button type="button" onClick={onNewPhoto} className="btn w-full">
            Choose another photo
          </button>
        ) : (
          <button type="button" onClick={onRetry} className="btn w-full">
            Try again
          </button>
        )}
        <button type="button" onClick={onBack} className="text-link min-h-11 text-muted-foreground">
          Change the occasion
        </button>
        <button type="button" onClick={onDeletePhoto} className="text-link min-h-11 text-muted-foreground">
          Delete my photo
        </button>
      </div>
    </FlowShell>
  );
}
