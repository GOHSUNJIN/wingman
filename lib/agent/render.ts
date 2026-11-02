import "server-only";

import type { LookItems } from "@/lib/agent/pick/candidates";
import { sizedUrl } from "@/lib/catalog/pipeline/images";
import { headShouldersFrom, type PreparedPhoto } from "@/lib/photo/prepare";
import { renderUrl, youcam } from "@/lib/youcam";
import { YouCamError, type YouCamErrorCode } from "@/lib/youcam/errors";
import type { RenderKind } from "./events";
import { HAIR_TEMPLATES } from "./grooming";

type LookRenders = {
  /** Clothes try-on on the whole photo. */
  outfit?: string;
  /** Hair try-on chained on the outfit render (head and shoulders). */
  hair?: string;
  /** Raw outfit image, for the Fit Check. */
  outfitImage?: Buffer;
  errors: YouCamErrorCode[];
};

/** Step 4: clothes try-on with the outer layer, then hair on that render. */
export async function renderLook(args: {
  photo: PreparedPhoto;
  items: LookItems;
  hair: string | null;
  /** Called as each render lands, so the client can show the outfit before hair finishes. */
  onRender?: (kind: RenderKind, url: string) => void;
  /** Called when a render fails, so the client can offer to try it again. */
  onFail?: (kind: RenderKind, code: YouCamErrorCode) => void;
}): Promise<LookRenders> {
  const yc = youcam();
  const { photo } = args;
  const out: LookRenders = { errors: [] };
  const garment = args.items.outerwear ?? args.items.top;

  const attempt = async <T>(kind: RenderKind, fn: () => Promise<T>): Promise<T | undefined> => {
    try {
      return await fn();
    } catch (err) {
      // A bad photo fails every render the same way; let the caller tell the user. Out of units is
      // different: the looks are still worth showing, as pieces without a try-on.
      if (err instanceof YouCamError && err.code === "NO_FACE") throw err;
      console.warn(`[render] ${(err as Error).message}`);
      const code = err instanceof YouCamError ? err.code : "UNKNOWN";
      out.errors.push(code);
      args.onFail?.(kind, code);
      return undefined;
    }
  };

  const clothes = garment
    ? await attempt("outfit", () =>
        yc.tryOnClothes({
          photo: photo.full,
          selfieHash: photo.hash,
          productId: garment.id,
          garmentUrl: sizedUrl(garment.image),
        }),
      )
    : undefined;
  if (clothes) {
    out.outfit = await renderUrl(clothes);
    if (out.outfit) args.onRender?.("outfit", out.outfit);
    else args.onFail?.("outfit", "UNKNOWN");
    // Mock fixtures show a different outfit, so the Fit Check would judge the wrong clothes.
    if (clothes.source !== "mock") out.outfitImage = clothes.image;
  }

  if (args.hair) {
    const source = clothes?.image ? await headShouldersFrom(clothes.image, photo) : photo.headShoulders;
    const hair = await attempt("hair", () =>
      yc.tryOnHair({
        photo: source,
        selfieHash: photo.hash,
        templateId: HAIR_TEMPLATES[args.hair!],
        source: clothes?.image && garment ? `clothes:${garment.id}` : "photo",
        fixture: clothes?.image ? "hair-chained" : "hair",
      }),
    );
    if (hair) out.hair = await renderUrl(hair);
    if (hair && !out.hair) args.onFail?.("hair", "UNKNOWN");
    if (out.hair) args.onRender?.("hair", out.hair);
  }

  return out;
}
