# Fluffy PALS: UI Animation Challenge

A single animated landing page that recreates the **feel** of [nft.fluffyhugs.io](https://nft.fluffyhugs.io/), with my own brand ("Fluffy PALS") and my own artwork: a small library of hand-built SVG animals.

Like the reference, the page is **one fixed 100vh screen**. Scrolling doesn't move a document. It moves the story to the next page with a transition.

- **Live URL:** [Live URL](https://animation-ui-5sy2.vercel.app/)
- **Stack:** React 19, TypeScript, Vite, **Framer Motion**, **Tailwind CSS v4**

---

## 1. Setup instructions

Requires Node 20+ and npm.

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # type-check + production build → dist/
npm run preview      # serve the production build locally
```

Quality checks:

```bash
npm run typecheck    # tsc
npm run lint         # oxlint
npm run format       # prettier
```

**Deploy:** import the repo in Vercel or Netlify, choose the "Vite" preset, and use `dist` as the output folder. It's a single page with no routing, so no rewrites are needed.

---

## 2. Which 3 slides I implemented

I followed the brief's recommended set: **loading screen → hero → collection**.

| #   | Slide              | Reference scene                                             | What moves                                                                                                                                                                                                                                                                                                                                         |
| --- | ------------------ | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Loading screen** | Walking character + "LOADING.."                             | The mascot walks in place and the letters do a staggered wave. The **progress %** tracks real readiness (fonts, window load). On exit the white sheet fades out and the hero's entrance plays.                                                                                                                                                     |
| 2   | **Hero**           | Giant title, a character lying in front of it, pastel blobs | **Entrance:** the title letters spring up, the blobs pop in and the mascot rises in lying down. **Idle:** the blobs float and follow the mouse. **Leaving:** each letter scatters upward at its own speed.                                                                                                                                         |
| 3   | **Collection**     | Dark NFT gallery room                                       | **The camera pans right** and the dark room slides in. The cards spring in one by one, then the row **drifts as an endless marquee**. You can **drag** it (it flings, then eases back into the drift), and hovering or keyboard focus slows it to a stop. Cards **tilt toward the cursor** with a glare, and fish and stars parallax with the row. |

### Extra: two bridge pages

The reference's main effect is the camera move _between_ scenes, and that doesn't show with only three hard cuts. So between the hero and the collection I added two short pages that continue the same story:

| Page      | What moves                                                                                                                                                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Story** | A hill rises. **The mascot rotates upright** and steps aside, **friends fly in** from the edges, and the copy **types in letter by letter and bobs**.                                                                                                        |
| **Orbit** | **The camera zooms through the mascot.** It scales past the screen while the friends rush outward, and a **ring of animals comes in from behind the camera**. The ring turns with the transition plus an idle drift, and the counter **counts up to 3,333**. |

### How you move between pages

- **Mouse wheel or trackpad:** one gesture moves one page. The inertia tail after a swipe is ignored, like the reference.
- **Swipe up or down** on touch screens.
- **Keyboard:** ↑ ↓, PageUp / PageDown, Space, Home / End.

---

## 3. Libraries chosen and why

| Library             | Why                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framer Motion**   | **Motion values** (`useMotionValue` → `useTransform`) write straight to the DOM, so a page transition doesn't re-render React. **Springs** give natural entrances and hovers. **Variants** with `staggerChildren` handle the letter reveals and card entrances. It also covers the rest of what I needed in one library: `AnimatePresence` for the loader exit, path `d` morphing for the blob, pan gestures for the gallery, and `MotionConfig reducedMotion` for accessibility. |
| **Tailwind CSS v4** | Layout, breakpoints and design tokens (`@theme` in `index.css`). Fluid sizes with `clamp()`, `vmin` and `svh` stay next to the markup, so each component is self-contained.                                                                                                                                                                                                                                                                                                       |
| **clsx**            | A tiny helper (`cn()`) for joining conditional class names.                                                                                                                                                                                                                                                                                                                                                                                                                       |

**What I chose _not_ to use, and why:**

- **No Lenis / Locomotive Scroll.** The page has no document scroll, because the reference doesn't either. One eased motion value between pages is simpler and gives finer control over the transition than smoothing a native scroll.
- **No GSAP.** Framer Motion already covers timelines (through `useTransform` ranges), springs and gestures, and it fits React's model well. Using one animation library keeps the code consistent.
- **No WebGL.** The reference's camera moves are faked with layered DOM and SVG transforms. That keeps the text real and accessible, and the performance cost much lower.

---

## 4. Approach to animation, smooth scroll and responsiveness

### Animation: one timeline value drives everything

The core idea is in `src/stage/`:

- `StageProvider` holds two things:
  - `page`: React state that changes once per transition.
  - `position`: a motion value that **eases from page to page** (1.3 s, ease-in-out, a little longer for multi-page jumps).
- `Scene` is one stacked full-screen page. It's only painted while it's within one page of `position`, and only the current page can take focus or clicks (`inert`).
- **Every scroll animation is a function of `position`.** For example, the mascot is one "actor" that spans the hero, story and orbit pages:

  ```ts
  const rotate = useTransform(position, [0, 1], [-90, 0])        // lying → standing
  const scale = useTransform(position, [0, 1, 1.8], [1, 1.3, 5])  // …then the camera zooms through it
  ```

  Reading a scene tells you exactly what happens between which pages, and going back plays the same timeline in reverse for free.

Moments that aren't tied to scrolling use small reusable pieces in `src/motion/`:

| Piece       | Used for                                                                                                                                                                    |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `WaveText`  | The reference's copy reveal: letters type in with a stagger once the page lands, then bob on a CSS wave that's phase-shifted per letter. Screen readers get the plain text. |
| `SplitText` | Staggered spring entrance for headings (the hero title).                                                                                                                    |
| `Float`     | An idle bob loop that only runs while its scene is on stage.                                                                                                                |
| `TiltCard`  | 3D tilt toward the cursor with a moving glare (gallery cards).                                                                                                              |
| `pointer()` | One shared pointer listener for all mouse parallax.                                                                                                                         |

How this covers the brief's four moments:

- **On load:** the loader, then the hero's entrance reveal.
- **On scroll:** scrubbed fades, scales and translates, parallax, and the camera zoom and pan.
- **On hover:** the blob morph, social pop, page-dot labels, card tilt and glare, and the marquee pause.
- **On resize:** see Responsiveness below.

### Smooth scroll

There is no native scroll to smooth. Instead:

- Wheel, touch and keyboard input are turned into "next" and "previous" page.
- `position` then animates to the new page with an ease-in-out curve, so every gesture gives the same smooth camera move.
- Input is ignored while a transition is playing, and a trackpad's inertia tail (a burst of shrinking wheel deltas right after a swipe) is ignored too. So one swipe always means one page, on mouse, trackpad, touch and keyboard alike.
- Horizontal wheel gestures are left to the gallery row.

### Responsiveness (desktop / tablet / mobile)

- **Every motion path is in `vw` / `vh`.** For example, a friend flies from `-70vw` to `2vw`. Transitions are correct at any size, and stay correct _while_ you resize, with no JavaScript measuring.
- **Sizes are fluid**, using `clamp()`, `vmin` (so portrait tablets don't get tiny animals) and `svh` (so mobile toolbars don't cause jumps).
- **The orbit's radii are CSS variables:** a wide ellipse on desktop, a tall one on phones.
- I checked 1440×900 (desktop), tablet widths and 390×844 (phone) page by page, including screenshots taken mid-transition.

---

## 5. Performance notes

- **Only `transform` and `opacity` are animated during transitions.**
  - The page dots stretch with `scaleX`, not `width`.
  - The loader's progress bar is a `scaleX`, not a `width`.
  - The only non-compositor animation is the blob's path morph on hover: one element, short and one-off.
- **No re-renders during a transition.** Everything reads the `position` motion value. React renders only when `page` changes, once per transition.
- **No forced reflows in the loop.** Scroll animations need no layout reads. The marquee reads one card offset per frame and then only writes a transform.
- **Off-stage work stops.**
  - Scenes more than one page away aren't painted.
  - `Float` loops and the orbit's idle drift only run on or next to the current page.
  - The copy's wave loop only runs while that copy is showing.
- **Lazy work:** the gallery cards mount only once the visitor reaches the page before the gallery.
- **No network images.** All artwork is inline SVG. The `Critter` component makes 8 species × colours × 4 accessories from code, so there's no heavy media to lazy-load.

### Edge cases

- **Slow asset loading:**
  - A static HTML/CSS boot loader shows before any JavaScript arrives.
  - It hands off to the React loader, whose progress tracks fonts, window load and a minimum display time (1.6 s), so it never flashes.
  - An 8-second cap means a failed asset can never trap the user.
  - Page input is only turned on after the loader has left.
- **`prefers-reduced-motion`** (bonus): Framer runs with `MotionConfig reducedMotion="user"`.

---

## 6. Assumptions made

- **"Recreate the feel" means the same story beats and kinds of motion, not a pixel copy.** The brand, art and copy are my own (English instead of Japanese), which the brief allows.
- **"3 slides" is the minimum.** I built the recommended three (loader, hero, collection) plus two short bridge pages, because the transitions _between_ scenes are the heart of the reference and need a few pages to show.
- **I used a simpler page model than the reference.** The reference settles its scroll with custom physics. I use one eased transition per gesture. It reads the same, is easier to reason about, and behaves the same on mouse, trackpad, touch and keyboard.
- **"Pinned sections" are covered by the stage itself.** Every page is pinned full-screen and the content transitions inside it, which is how the reference works too.
- **Links are placeholders.** Social and CTA links have hover and focus states but don't navigate, as the brief says.
- **Breakpoints:** the phone layout is below 640px (Tailwind's `sm`). Tablets share the desktop layout, with `vmin`-based sizing so portrait tablets still look balanced, and a few details adjust again at `lg`.

---

## Project structure

```
src/
  stage/      StageProvider (page + position, input), Scene (stacked page), stage (context, hooks)
  sections/   Loader, Hero, Story, Mascot (actor across pages 1–3), Orbit, Collection
  motion/     WaveText, SplitText, Float, TiltCard, pointer, tier / TierProvider, intro
  art/        Critter (parametric SVG animals), Blob, blobPath (morph-safe paths), icons
  data/       pals and collection items (deterministic)
```

To add a page:

1. Add its name to `PAGES` in `App.tsx`.
2. Render a `<Scene index={n}>`.
3. Drive its motion from `position` around `n`.

Other docs: [`IMPLEMENTATION.md`](./IMPLEMENTATION.md) (how it was built, step by step, and why), [`PLAN.md`](./PLAN.md) (the plan, plus a note on the first scroll-based version).
