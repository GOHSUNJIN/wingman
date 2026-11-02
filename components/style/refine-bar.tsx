"use client";

import { useState } from "react";

const SUGGESTIONS = ["Dress it down", "Dress it up", "More affordable"];

/**
 * Chat bar under the looks. Two modes:
 * - Default: sticky to viewport bottom with negative margins (mobile / page-level use)
 * - inside=true: fixed footer inside a flex column (desktop right panel)
 */
export function RefineBar({
  onRefine,
  inside = false,
}: {
  onRefine: (message: string) => void;
  inside?: boolean;
}) {
  const [message, setMessage] = useState("");
  const send = (text: string) => {
    const trimmed = text.trim();
    if (trimmed.length >= 2) onRefine(trimmed);
  };

  const inner = (
    <>
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {SUGGESTIONS.map((s) => (
          <button key={s} type="button" onClick={() => send(s)} className="btn-quiet shrink-0 px-4">
            {s}
          </button>
        ))}
      </div>
      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(message);
        }}
      >
        <label htmlFor="refine" className="sr-only">
          Tell Wingman what to change
        </label>
        <input
          id="refine"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={200}
          placeholder="Tell Wingman what to change"
          className="min-h-12 min-w-0 flex-1 bg-surface px-4 text-base placeholder:text-muted-foreground focus:bg-surface-raised focus:outline-2 focus:outline-brass"
        />
        <button
          type="submit"
          disabled={message.trim().length < 2}
          className="btn shrink-0 disabled:opacity-50"
        >
          Refine
        </button>
      </form>
    </>
  );

  if (inside) {
    return (
      <div className="shrink-0 border-t bg-surface px-5 pt-3 pb-4" style={{ borderColor: "var(--line)" }}>
        {inner}
      </div>
    );
  }

  return (
    <div className="sticky bottom-0 -mx-(--margin) mt-10 bg-background px-(--margin) pt-3 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
      <div className="max-w-xl">{inner}</div>
    </div>
  );
}
