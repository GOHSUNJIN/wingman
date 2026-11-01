# Wingman Design Reference

AI occasion stylist for men. User uploads one selfie, describes an event and budget, and gets 2 to 3 complete outfits from real Singapore menswear stores, each virtually tried on their photo.

This folder is a **design reference**, not production code. The files in `screens/` are high-fidelity mockups written in a templating format (`.dc.html`). Read them for exact layout, spacing, copy and styles. Do not copy the templating syntax (see "Reading the screen files" at the bottom).

---

## 1. Design direction

- Editorial menswear. Think Mr Porter, not Zara. Confident, minimal, premium. No startup energy.
- The user's photo is always the hero. Every layout should feel like a magazine shoot starring them.
- App screens: laptop landscape, designed at **1440 x 900**, dark mode only, no page scroll on app screens (inner panels may scroll).
- Landing page: fluid and responsive, works down to phone width.

## 2. Tokens

### Colour

| Token | Hex | Use |
|---|---|---|
| `bg` | `#0A0A0B` | Page background |
| `surface` | `#141416` | Header, side panels, cards |
| `raised` | `#1C1C1F` | Cards on surface, thumbnails, refine bar, modals |
| `raised-2` | `#26262A` | Chips on raised, hover states |
| `line` | `#2A2A2E` | Thin dividers, empty progress tracks |
| `dot-off` | `#3A3A3F` | Future progress dots, pending timeline dots |
| `text` | `#ECEBE8` | Primary text, selected chip background |
| `text-soft` | `#C9C5BD` | Body text on photos and on warm backgrounds |
| `muted` | `#9C978E` | Labels, secondary text, back links |
| `gold` | `#C8A96A` | The one primary CTA per screen, progress, scores, accents |
| `gold-hover` | `#D6BA80` | Gold button hover |
| `success` | `#5FB58A` | Scores 8.0 and up, "Ready", cheaper price deltas |
| `danger` | `#E06C5F` | Delete, sold out |

Landing page only (warm photo backdrops): `#2B2722` (hero), `#1C1A17` (try-on band), and look backdrops `#3A342D`, `#5B5246`, `#2E3A3E`, `#4A4238`.

### Typography

- Display: **DM Serif Display** (400, regular and italic). Headings, prices, scores, big numbers.
- UI: **DM Sans** (400, 500, 600, 700). Everything else.
- Google Fonts: `https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1&display=swap`

| Role | Font | Size / line-height |
|---|---|---|
| Screen heading (H1) | DM Serif Display | 60 to 64px / 1.0 |
| Look name | DM Serif Display | 40px / 1.05 |
| Landing hero | DM Serif Display | clamp(52px, 7.6vw, 112px) / 0.95 |
| Section heading (landing) | DM Serif Display | clamp(40px, 5.4vw, 72px) / 1.0 |
| Body | DM Sans | 15 to 16px / 1.6 |
| Secondary | DM Sans | 13 to 14px |
| Label | DM Sans | 12px, letter-spacing 0.02em, `muted` |
| Wordmark | DM Serif Display | 20px, letter-spacing 0.2em, "WINGMAN" |

### Capitalisation (important)

- **Title Case**: headings, buttons, links, chips, tab labels, product names. e.g. "Your Photo", "Use This Photo", "Style Me →", "Add Look to Cart", "Wedding Guest".
- **Sentence case**: small labels and helper text. e.g. "Step one", "Like this", "Budget for the whole look", "What Wingman heard".
- **No all-caps text anywhere**, except the WINGMAN wordmark.

### Spacing and layout

- 8px base grid. Common values: 8, 12, 16, 24, 32, 40, 48, 64, 72, 80, 96.
- App header: 64px tall, `surface` background, 40px side padding.
- Content panel padding on app screens: about 44 to 72px top, 80 to 96px sides.

## 3. Hard rules

1. Square corners everywhere (`border-radius: 0`). Exceptions: progress dots, timeline dots, numbered step circles, map pins and the delete badge are circles.
2. No gradients, except a dark scrim over a photo (`linear-gradient(to top, rgba(10,10,11,0.85), rgba(10,10,11,0))`).
3. No glass, blur or drop shadows.
4. No emoji. Icons are 1.25px stroke line SVGs.
5. No borders between sections. Separate with tone steps (`bg` → `surface` → `raised`). The only allowed lines are thin dividers inside a panel, the selected-card outline and the gold left border on cart store groups.
6. **One gold button per screen.** Secondary actions are underlined text links. (Cart is the exception: one gold checkout button per store group.)
7. Back links are always muted text with a "←" arrow. Never a back button.
8. No spinners. Loading is shown with a gold scan line, pulsing dots or placeholder tiles.

## 4. The photo panel (consistent everywhere)

The user uploads one photo, so it must render **identically on every screen**.

- Fixed size **628 x 836px** on all app screens (full height under the 64px header, 3:4 ratio). Always on the left. Never a percentage width.
- `object-fit: cover`, centred. The right side content panel is `flex: 1`.
- Screens with the photo panel: Upload (1), Occasion (2), Styling (3), Your Looks (4), Swap (6), Night Before (7).
- Overlays allowed on the photo: bottom scrim with caption, score badge top-right (88px square, `bg`, gold serif number), status strip at the bottom, gold scan line, numbered pins.
- Night Before (7) shows the same full photo with white corner brackets around the face labelled "Grooming focus" (not a zoomed crop).
- On the landing page, every photo uses `aspect-ratio: 3 / 4`.

## 5. Components

**Header**: WINGMAN wordmark left. Right: 5 progress dots (8px circles, gap 10px) plus step label like "04 · Your looks". Dots: done = gold, current = gold with pulse animation, future = `#3A3A3F`. Steps: 01 Your photo, 02 The occasion, 03 Styling, 04 Your looks (also Browse, Swap, Prep plan), 05 Cart.

**Gold button**: `gold` background, `bg` text, 15px / 600, height 52 to 56px, full width in side panels. Hover `gold-hover`.

**Text link**: `text` with underline, offset 4px, 1px thickness. Muted variant uses `muted`. Danger variant uses `danger` (Delete My Photo).

**Chip**: height 44px (32px in dense places like the refine bar or filters), padding 0 20px, `raised` background. Selected: `text` background with `bg` text, weight 600.

**Selectable card** (budget tier, swap option, product): unselected `surface`, selected `raised` with a 1px `text` outline.

**Product row**: 64px square thumbnail on `raised`, name 15px, store 13px muted, price right-aligned, actions as small text links ("Swap", "Cheaper", "View", "Add").

**Score colours**: 8.0 and up = `success`; 6.0 to 7.9 = `text`; below 6.0 = `danger`. The badge on the photo is always gold.

**Fit Check box**: `raised` panel with the big score (serif 34px, score colour), reasoning text and three sub-scores (Occasion, Colour on You, Budget). Each sub-score has a label, a value and a 2px bar (`line` track, `text` fill, width = value x 10%). Overall score = average of the three.

**Modal** (delete confirm): full-screen `rgba(10,10,11,0.78)` overlay, 460px `raised` dialog, serif heading "Delete Your Photo?", body copy, `danger` filled button "Delete Photo" and a "Cancel" text link.

**Switch** ("Find Cheaper"): 40 x 22 square track, 16px square knob. Off: `line` track, `muted` knob. On: `text` track, `bg` knob.

### Motion

```css
@keyframes wmIn   { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } } /* every screen on mount, 0.7s cubic-bezier(.2,.7,.2,1) */
@keyframes wmPulse{ 0%,100% { opacity: 1; transform: scale(1) } 50% { opacity: .35; transform: scale(.7) } } /* current dot, active step, 1.6s infinite */
@keyframes wmScan { 0% { top: -120px } 100% { top: 100% } } /* 120px band rgba(200,169,106,0.07) with 2px gold line at bottom, 3 to 5s ease-in-out infinite */
@keyframes wmReveal { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } } /* try-on tiles appearing, staggered 0.6s */
```

## 6. Screens

Files are in `screens/`. Each app screen is 1440 x 900.

**0. Home (landing page)** `00-Home.dc.html`
Fluid, responsive. Sections in order:
1. Cover hero on `#2B2722`: headline "See the Look on You Before You Buy It." ("on You" gold italic), gold "Upload Your Photo" button, "See How It Works" link, 3:4 try-on with a fit score badge and labels pointing to pieces with prices.
2. Scrolling marquee of the six occasions with gold diamonds between them.
3. Lookbook "A Cousin's Wedding, Three Ways.": three 3:4 try-ons on different backdrops with name, score and price.
4. Fit Check verdict: photo with numbered gold pins on the left, 8.4 score, three ring gauges, quote and three numbered notes on the right.
5. How It Works: three steps, each with a mini UI illustration (upload frame with ticks, occasion chips plus budget cards, three try-on thumbnails with scores).
6. Before and after try-on with the scan line.
7. Pieces grid on coloured tiles with store names.
8. Privacy band with a faded photo thumbnail and a red delete badge.
9. Final call to action "Walk In Already Sure." over a faded photo.
10. Footer.
Only one gold button on the page (hero). Other CTAs are underlined text links.

**1. Upload your photo** `01-Upload.dc.html`
Left: photo panel. Empty state: dashed 1px border, upload icon, "Upload Your Photo", helper text. Uploaded: photo fills edge to edge with a scrim showing the file name and a "Replace Photo" link.
Right: label "Step one", H1 "Your Photo", intro line, four icon rows (Even Lighting / Waist Up / Face the Camera / Glasses Are Fine) next to a small 112 x 148 "Like this" example, gold "Use This Photo" (only after upload), privacy line at the very bottom. Nothing scrolls.

**2. The occasion** `02-Occasion.dc.html`
Left: photo with scrim caption "Styling for · You, on the Day". Right: back link, H1 "The Occasion", occasion chips (First Date, Interview, Wedding Guest, CNY, Company D&D, Night Out), "Describe the event" textarea (132px, `surface`), three budget cards (Budget S$150–350, Mid-range S$350–800, Luxury S$800+), gold "Style Me →" at the bottom.

**3. Styling (loading)** `03-Styling.dc.html`
Left: photo, lightly dimmed, with the gold scan line sweeping it and a caption with a pulsing dot. Right: context label, heading that alternates every ~3s between "Picking Your Looks" and "Trying Them On You", the line "Usually takes about a minute. Keep this tab open.", three 260px try-on tiles (Ready / Rendering with scan / Queued) fading in staggered. Below: a 4-step timeline (done gold, active pulsing, pending muted) and a 2 x 2 "What Wingman heard" grid (Occasion, Setting, Vibe, Time).

**4. Your looks (main screen)** `04-Looks.dc.html`
Left: photo showing the selected look, look label top-left, gold score badge top-right, rendering strip at the bottom (pulsing dot, text, 2px gold progress bar).
Right (flex column, no outer scroll, `surface`):
- Tab row (64px): Look 1 / 2 / 3 with scores. Selected tab has a 2px underline.
- Scrollable middle: tier label, look name plus price, Fit Check box with sub-scores, sub-tabs "The Look" / "Additional", piece list ("Swap" and "Cheaper" links on look pieces, "View" and "Add" on accessories).
- Footer: gold "Add Look to Cart · S$756", 1px divider, links: Your Prep Plan / Browse Every Piece / Change Occasion / Delete My Photo (danger, opens the confirm modal).
- Refine bar (`raised`): chips (More Casual, Dressier, Under S$500, No White Sneakers), text input and a "Refine" text button.

**5. Browse catalog** `05-Browse.dc.html`
Left sidebar 260px (`surface`, scrolls): piece count, then filter chip groups Category / Budget / Price / Colour (with swatches) / Size / Store. Main: back link, H1 "Every Piece", 4-column grid of square product tiles plus name, store and price. Clicking a card slides a 460px detail panel in from the right (`raised`, dims the grid): large image, name, store, price, size chips, "Add to which look" radio list and a gold "Add to Cart".

**6. Swap a piece** `06-Swap.dc.html`
Left: photo (jacket colour updates when an option is picked), scan line and "Trying on the …" strip while rendering. Right: back link, H1 "Swapping the Jacket", "Currently: …" line, "Find Cheaper" switch, 3 x 2 grid of options (170px tile, name, store, price, and a delta like "−S$39 vs current" in green or "+S$70 vs current" in muted), gold "Keep This Swap".

**7. The night before** `07-NightBefore.dc.html`
Left: same photo with face corner brackets. Right: label "Friday evening", H1 "The Night Before", intro line, three `surface` step cards with a 36px gold numbered circle, bold title and detail, then a muted disclaimer and a "← Back to Your Looks" link.

**8. Cart** `08-Cart.dc.html`
Left 40% (`surface`): back link, "Your total", total in 96px serif, "6 pieces · 3 stores", a "You Pay at Each Store Directly" note box and a sold-out warning in `danger`. Right 60% (scrolls): H1 "Your Cart", one group per store with a 2px gold left border, store name, item rows (thumbnail, name, size chips, quantity stepper, price, Remove), subtotal and a gold "Check Out at [Store] ↗" (opens a new tab). Sold-out items are greyed out, with the price struck through, a danger note and no quantity stepper. They are excluded from the totals.

## 7. Sample data used in the mockups

Stores: Benjamin Barker, Massimo Dutti, COS, Uniqlo, Kapok. All product names and prices are placeholders.

```js
look = {
  name: 'Ballroom Navy', tier: 'Mid-range', price: 'S$756', score: 8.4,
  subs: { occasion: 9.0, colour: 8.5, budget: 7.8 },
  reason: 'Navy reads formal under ballroom lighting without competing with the groom...',
  pieces: [{ name, store, price, kind: 'jacket' | 'shirt' | 'trousers' | 'shoes' }],
  extras: [{ name, store, price, kind: 'belt' | 'square' | 'watch', why }]
}
```

## 8. Reading the screen files

Each `.dc.html` is a mockup in a small template format. When using it as reference:

- Inline `style="…"` attributes are the real styles. Take sizes, colours and spacing from them.
- `<helmet>` holds fonts, keyframes and hover classes (`.wm-gold`, `.wm-u`, `.wm-back`, etc.).
- `{{name}}` is a value from the `renderVals()` function in the `<script type="text/x-dc">` block at the bottom. That function also holds the sample data and the interaction logic (selected tab, selected chip and so on).
- `<sc-if value="…">` is a conditional and `<sc-for list="…" as="x">` is a loop.
- `<a href="Other.dc.html">` shows navigation between screens.
- Person photos and product images are inline SVG placeholders. Replace them with the real user photo, try-on renders and product images.
