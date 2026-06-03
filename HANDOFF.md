# The Detangling Brush — Landing Page Handoff

_Source: `whereyouaremktg/Glow-stiletto`, branch `claude/festive-archimedes-D0Jzk` (merged to `main` via PR #6). Date: 2026-06-03._

---

## 1. TL;DR
An all-in-one, conversion-optimized **product landing page** for The Detangling Brush, built from your theme's own design system, plus **4 reusable `glow-*` sections**. Everything is additive and ports cleanly to your live theme.

## 2. ⚠️ Where this needs to go (important)
- **Your published theme is "Copy of Birthday Sale (USE THIS)"** — `gid://shopify/OnlineStoreTheme/174403944471` (role `MAIN`).
- Despite the name, it's the **same Stiletto + Glow base** as this repo (it has `assets/glow-stiletto.css`, `snippets/glow-vars.liquid`, `main-product--default`, and the `glow-*` sections).
- **This repo's `main` is a different theme instance.** Merging PR #6 updated *this repo only* — it did **not** change your live store. To go live you must add the change set below to the live theme (or, best practice, to a duplicate of it that you preview then publish).

## 3. The change set (all my work)
### Add these 5 files verbatim
| File | What it is |
|---|---|
| `templates/product.detangling-brush.json` | The landing page template (16 sections, wired with copy/images/products) |
| `sections/glow-comparison.liquid` | "vs ordinary brushes" comparison table (check / cross / partial, highlighted product column, CTA) |
| `sections/glow-ugc.liquid` | UGC + pull-quote wall (photo cards w/ stars, quote, @handle, badge; mobile scroll-snap) |
| `sections/glow-badge-row.liquid` | Circular trust-badge row (renders placeholder coins until real art is added) |
| `sections/glow-checker-strip.liquid` | Full-bleed pure-CSS checkerboard divider |

### Append to 1 existing file
- `assets/glow-stiletto.css` — ~95 lines of **additive** CSS (4 blocks). They start at the banner comment `/* Section: glow-comparison */` and run to end of file. **No existing rules were changed.**

## 4. Already on your live theme — no action needed
Confirmed present via Admin API: `main-product--default`, `glow-hero`, `glow-press-strip`, `glow-editorial-split`, `glow-results-compare`, `glow-story-stack`, `glow-quote`, `glow-routine-grid`, `multi-column`, `testimonials`, `product-tabs`, `recommended-products`, `snippets/image.liquid`, `snippets/glow-vars.liquid`.

## 5. Deploy options (pick one)
**A) Shopify CLI (recommended)**
```bash
# Duplicate the live theme in admin first (Themes → ⋯ → Duplicate), then pull the COPY:
shopify theme pull --theme <DUPLICATE_THEME_ID>
# add the 5 files + append the CSS (from this repo / PR #6), then:
shopify theme push --theme <DUPLICATE_THEME_ID>
# Preview → QA → Publish from admin when happy.
```
**B) GitHub integration** — connect your new repo to a duplicate of the live theme (Themes → Add theme → Connect from GitHub), push, preview, publish.

**C) Let me do it via API (fastest)** — I can write all 5 files + the CSS into a **non-destructive duplicate** of your live theme using the Admin API, then you just preview & publish. Say "push it to a copy."

## 6. After deploy
- Assign the template: **Products → The Detangling Brush → Theme template → `detangling-brush`** (or it's auto-available on the product page once the theme has the file).
- QA on mobile: sticky add-to-cart, UGC scroll carousel, comparison table, checker strip.
- Test on a **duplicate/unpublished** theme before publishing to customers.

## 7. Page structure (top → bottom)
`main` (buy box) → `press` (as seen in) → `feature` (editorial) → `badges` (trust coins) → `comparison` (vs ordinary) → `compare` (before/after) → `pillars` (3 benefits) → `story` (3 features) → `quote` (ELLE) → `ugc` (UGC + quotes) → `reviews` (testimonials) → `tabs` (why/science/care/FAQ) → `routine` (cross-sell) → `checker` (divider) → `closing` (CTA) → `recommended`.

## 8. Wired content you may want to swap
- **Product:** The Detangling Brush · handle `glow-beauty-hair-brush` · variant `40103502643223` · $33
- **Product images (Shopify Files):** `20_b8f8a191-…png`, `OG-001_5cf83a11-…png`, `OG-001_2_2b7fc700-…png`, `19_f7f93beb-…png`, `18_8434790d-…png`, `18_b165525b-…png`
- **Press logos:** `Anthropologie_Logo_svg.png`, `Revolve-Logo.png`, `Urban_Outfitters_logo_svg.png`
- **UGC/lifestyle:** `maryselects_4.jpg`, `productsselects_5.jpg`
- **Cross-sell products:** `round-brush`, `the-mini-detangling-brush`, `the-detangling-duo`

## 9. Open items / automated review notes
**Codex P2 — hard-coded variant ID in CTAs.** Feature, comparison, and closing CTAs use `/cart/40103502643223:1`. This is correct and works on this store. Only brittle if you duplicate/recreate the product or reuse on another store. To make it bulletproof, set those CTA links blank and add to `glow-editorial-split` (button) and `glow-comparison` (cta):
```liquid
{%- assign cta = block.settings.link -%}
{%- if cta == blank and product != blank and product.selected_or_first_available_variant != blank -%}
  {%- assign cta = '/cart/' | append: product.selected_or_first_available_variant.id | append: ':1' -%}
{%- endif -%}
```
**Codex P2 — badge row placeholders.** Intentional (you asked to leave placeholders). Coins show a dashed placeholder until art is added. Swap real images in (**Badge row → each Badge → image**) or hide the section before publishing.

**Pending design assets**
- `detangling-brush-sunburst.png` — never reached me (zip attachments aren't accessible to me). Upload to Shopify Files, then set it as the **`feature`** section image.
- Badge coin art (4) — in progress on your side.
- Optional: a real before/after hair pair (the slider currently uses two in-use shots); real UGC photos.

## 10. Fresh-session handoff prompt
Paste this into a new Claude Code session opened on your live-theme repo:

> Add a conversion-optimized landing page for **The Detangling Brush** (handle `glow-beauty-hair-brush`, single variant `40103502643223`, $33) to this Stiletto/Glow theme. The theme already has `main-product--default`, `glow-hero`, `glow-press-strip`, `glow-editorial-split`, `glow-results-compare`, `glow-story-stack`, `glow-quote`, `glow-routine-grid`, `multi-column`, `testimonials`, `product-tabs`, `recommended-products`, `snippets/image`, `snippets/glow-vars`, and `assets/glow-stiletto.css`.
>
> Copy these 5 files from `whereyouaremktg/Glow-stiletto` (PR #6 / `main`): `templates/product.detangling-brush.json`, `sections/glow-comparison.liquid`, `sections/glow-ugc.liquid`, `sections/glow-badge-row.liquid`, `sections/glow-checker-strip.liquid`. Then append the `glow-comparison` / `glow-ugc` / `glow-badge-row` / `glow-checker-strip` CSS block (banner `/* Section: glow-comparison */` to EOF) to `assets/glow-stiletto.css`.
>
> Template section order: `main, press, feature, badges, comparison, compare, pillars, story, quote, ugc, reviews, tabs, routine, checker, closing, recommended`. Validate that every section/block type and setting is valid and the JSON parses, then assign template `detangling-brush` to the product and QA on mobile.
>
> Notes: CTAs use `/cart/40103502643223:1` (fine on this store; make dynamic if duplicating the product). The badge row shows placeholder coins until real badge art is added. A sunburst image (`detangling-brush-sunburst.png`) is intended for the `feature` section image once available.
