import { memo, type ReactNode } from "react";

export type Species = "cat" | "dog" | "bunny" | "bear" | "panda" | "fox" | "pig" | "chick";
export type Accessory = "none" | "headphones" | "bow" | "scarf" | "crown";

interface Palette {
  body: string;
  accent: string;
  inner: string;
}

/** Default colours per species. Any of them can be overridden per critter. */
const PALETTES: Record<Species, Palette> = {
  cat: { body: "#f6a33c", accent: "#df7a1c", inner: "#ffc9b5" },
  dog: { body: "#ffffff", accent: "#b87b4b", inner: "#f3d2b8" },
  bunny: { body: "#fdeef3", accent: "#ffb3c7", inner: "#ffb3c7" },
  bear: { body: "#b98158", accent: "#ecc9a4", inner: "#ecc9a4" },
  panda: { body: "#ffffff", accent: "#23263a", inner: "#23263a" },
  fox: { body: "#f47c3c", accent: "#ffffff", inner: "#ffd2bd" },
  pig: { body: "#ffc2d3", accent: "#ff93b3", inner: "#ff93b3" },
  chick: { body: "#ffd84d", accent: "#ff9f1c", inner: "#ffe98f" },
};

const INK = "#22318f";

/** Relative luminance of a #rrggbb colour (0 = black, 1 = white). */
function luminance(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}
const SW = 5; // outline width in viewBox units

interface CritterProps {
  species: Species;
  body?: string;
  accent?: string;
  accessory?: Accessory;
  /** Feet step in place (loader). */
  walking?: boolean;
  className?: string;
  /** Accessible name; decorative (aria-hidden) when omitted. */
  title?: string;
}

/** Outlined tube: a thick ink stroke with a thinner colour stroke on top. */
function Tube({ d, color, width = 12 }: { d: string; color: string; width?: number }) {
  return (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth={width + SW * 2} strokeLinecap="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />
    </>
  );
}

function Tail({ species, p }: { species: Species; p: Palette }) {
  switch (species) {
    case "cat":
      return <Tube d="M142 164 C 180 166, 188 128, 170 108" color={p.body} />;
    case "dog":
      return <Tube d="M146 150 C 166 146, 170 128, 164 116" color={p.body} width={11} />;
    case "fox":
      return (
        <g>
          <ellipse
            cx="160"
            cy="138"
            rx="22"
            ry="40"
            transform="rotate(28 160 138)"
            fill={p.body}
            stroke={INK}
            strokeWidth={SW}
          />
          <ellipse
            cx="172"
            cy="108"
            rx="11"
            ry="14"
            transform="rotate(28 172 108)"
            fill="#fff"
            stroke={INK}
            strokeWidth={SW}
          />
        </g>
      );
    case "bunny":
      return <circle cx="148" cy="170" r="13" fill="#fff" stroke={INK} strokeWidth={SW} />;
    case "bear":
    case "panda":
      return (
        <circle
          cx="146"
          cy="168"
          r="10"
          fill={species === "panda" ? p.accent : p.body}
          stroke={INK}
          strokeWidth={SW}
        />
      );
    case "pig":
      return (
        <path
          d="M148 156 q16 -2 12 -14 q-8 -6 -10 4"
          fill="none"
          stroke={INK}
          strokeWidth={4}
          strokeLinecap="round"
        />
      );
    default:
      return null;
  }
}

function EarsBehind({ species, p }: { species: Species; p: Palette }) {
  const outline = { stroke: INK, strokeWidth: SW, strokeLinejoin: "round" as const };
  switch (species) {
    case "cat":
    case "fox": {
      const big = species === "fox";
      return (
        <g>
          <path
            d={big ? "M50 70 L52 12 L94 42 Z" : "M54 64 L58 20 L90 42 Z"}
            fill={p.body}
            {...outline}
          />
          <path
            d={big ? "M150 70 L148 12 L106 42 Z" : "M146 64 L142 20 L110 42 Z"}
            fill={p.body}
            {...outline}
          />
          <path d={big ? "M60 56 L61 28 L82 44 Z" : "M62 54 L64 32 L80 44 Z"} fill={p.inner} />
          <path
            d={big ? "M140 56 L139 28 L118 44 Z" : "M138 54 L136 32 L120 44 Z"}
            fill={p.inner}
          />
        </g>
      );
    }
    case "bear":
    case "panda":
      return (
        <g>
          <circle
            cx="58"
            cy="46"
            r="19"
            fill={species === "panda" ? p.accent : p.body}
            {...outline}
          />
          <circle
            cx="142"
            cy="46"
            r="19"
            fill={species === "panda" ? p.accent : p.body}
            {...outline}
          />
          {species === "bear" && (
            <>
              <circle cx="58" cy="46" r="9" fill={p.inner} />
              <circle cx="142" cy="46" r="9" fill={p.inner} />
            </>
          )}
        </g>
      );
    case "bunny":
      return (
        <g>
          <ellipse
            cx="76"
            cy="30"
            rx="15"
            ry="38"
            transform="rotate(-12 76 30)"
            fill={p.body}
            {...outline}
          />
          <ellipse
            cx="124"
            cy="30"
            rx="15"
            ry="38"
            transform="rotate(12 124 30)"
            fill={p.body}
            {...outline}
          />
          <ellipse cx="76" cy="32" rx="6" ry="26" transform="rotate(-12 76 32)" fill={p.inner} />
          <ellipse cx="124" cy="32" rx="6" ry="26" transform="rotate(12 124 32)" fill={p.inner} />
        </g>
      );
    case "pig":
      return (
        <g>
          <path d="M60 52 L58 26 L86 40 Z" fill={p.body} {...outline} />
          <path d="M140 52 L142 26 L114 40 Z" fill={p.body} {...outline} />
        </g>
      );
    default:
      return null;
  }
}

function Face({ species, p }: { species: Species; p: Palette }) {
  const parts: ReactNode[] = [];

  if (species === "fox")
    parts.push(<ellipse key="muzzle" cx="100" cy="110" rx="34" ry="20" fill="#fff" />);
  if (species === "bear")
    parts.push(<ellipse key="muzzle" cx="100" cy="108" rx="21" ry="15" fill={p.inner} />);
  if (species === "dog")
    parts.push(
      <ellipse key="patch" cx="122" cy="86" rx="17" ry="15" fill={p.accent} opacity={0.85} />,
    );
  if (species === "panda") {
    parts.push(
      <ellipse
        key="pl"
        cx="78"
        cy="90"
        rx="13"
        ry="16"
        transform="rotate(25 78 90)"
        fill={p.accent}
      />,
      <ellipse
        key="pr"
        cx="122"
        cy="90"
        rx="13"
        ry="16"
        transform="rotate(-25 122 90)"
        fill={p.accent}
      />,
    );
  }
  if (species === "cat") {
    parts.push(
      <g key="stripes" stroke={p.accent} strokeWidth={6} strokeLinecap="round">
        <path d="M100 40 v14" />
        <path d="M84 45 l4 11" />
        <path d="M116 45 l-4 11" />
      </g>,
    );
  }

  // Eyes must read on any body colour: white on dark bodies and on panda patches.
  const eyeColor = species === "panda" || luminance(p.body) < 0.35 ? "#fff" : INK;
  parts.push(
    <g key="eyes">
      <ellipse cx="80" cy="91" rx="5.5" ry="7" fill={eyeColor} />
      <ellipse cx="120" cy="91" rx="5.5" ry="7" fill={eyeColor} />
      {eyeColor === INK && (
        <>
          <circle cx="82" cy="88" r="2" fill="#fff" />
          <circle cx="122" cy="88" r="2" fill="#fff" />
        </>
      )}
    </g>,
    <g key="blush" fill="#ff8fa3" opacity={0.55}>
      <ellipse cx="64" cy="106" rx="9" ry="5" />
      <ellipse cx="136" cy="106" rx="9" ry="5" />
    </g>,
  );

  if (species === "pig") {
    parts.push(
      <g key="snout">
        <ellipse cx="100" cy="104" rx="16" ry="11" fill={p.accent} stroke={INK} strokeWidth={4} />
        <ellipse cx="94" cy="104" rx="2.5" ry="3.5" fill={INK} />
        <ellipse cx="106" cy="104" rx="2.5" ry="3.5" fill={INK} />
      </g>,
    );
  } else if (species === "chick") {
    parts.push(
      <path
        key="beak"
        d="M90 100 L110 100 L100 113 Z"
        fill={p.accent}
        stroke={INK}
        strokeWidth={4}
        strokeLinejoin="round"
      />,
    );
  } else {
    parts.push(
      <ellipse key="nose" cx="100" cy="101" rx="5" ry="3.6" fill={INK} />,
      <path
        key="mouth"
        d="M91 107 q4.5 5 9 0 q4.5 5 9 0"
        fill="none"
        stroke={INK}
        strokeWidth={3.5}
        strokeLinecap="round"
      />,
    );
  }
  return <>{parts}</>;
}

function AccessoryLayer({ accessory }: { accessory: Accessory }) {
  switch (accessory) {
    case "headphones":
      return (
        <g>
          <path
            d="M46 84 Q100 -6 154 84"
            fill="none"
            stroke={INK}
            strokeWidth={15}
            strokeLinecap="round"
          />
          <path
            d="M46 84 Q100 -6 154 84"
            fill="none"
            stroke="#e5383b"
            strokeWidth={8}
            strokeLinecap="round"
          />
          <ellipse cx="44" cy="92" rx="14" ry="19" fill="#e5383b" stroke={INK} strokeWidth={SW} />
          <ellipse cx="156" cy="92" rx="14" ry="19" fill="#e5383b" stroke={INK} strokeWidth={SW} />
          <ellipse cx="44" cy="92" rx="6" ry="9" fill="none" stroke="#ffb3b3" strokeWidth={3} />
          <ellipse cx="156" cy="92" rx="6" ry="9" fill="none" stroke="#ffb3b3" strokeWidth={3} />
        </g>
      );
    case "bow":
      return (
        <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
          <path d="M136 40 L118 28 L120 52 Z" fill="#ff5fa2" />
          <path d="M136 40 L154 28 L152 52 Z" fill="#ff5fa2" />
          <circle cx="136" cy="40" r="6" fill="#ff8fc7" />
        </g>
      );
    case "scarf":
      return (
        <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
          <path d="M54 124 Q100 146 146 124 L146 138 Q100 160 54 138 Z" fill="#4cc9f0" />
          <path d="M118 140 L126 172 L140 168 L134 138 Z" fill="#4cc9f0" />
          <path
            d="M62 132 Q100 150 138 132"
            fill="none"
            stroke="#fff"
            strokeWidth={3}
            strokeDasharray="6 7"
          />
        </g>
      );
    case "crown":
      return (
        <path
          d="M76 40 L82 14 L94 30 L100 10 L106 30 L118 14 L124 40 Z"
          fill="#ffd84d"
          stroke={INK}
          strokeWidth={4}
          strokeLinejoin="round"
        />
      );
    default:
      return null;
  }
}

/** A cute, outlined, sitting animal. Pure SVG, so it scales crisply and costs no network. */
export const Critter = memo(function Critter({
  species,
  body,
  accent,
  accessory = "none",
  walking = false,
  className,
  title,
}: CritterProps) {
  const base = PALETTES[species];
  const p: Palette = { body: body ?? base.body, accent: accent ?? base.accent, inner: base.inner };
  const outline = { stroke: INK, strokeWidth: SW };

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      overflow="visible"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <Tail species={species} p={p} />
      {/* body */}
      <ellipse cx="100" cy="146" rx="50" ry="42" fill={p.body} {...outline} />
      {species !== "panda" && species !== "dog" && species !== "bunny" && (
        <ellipse
          cx="100"
          cy="154"
          rx="28"
          ry="24"
          fill="#fff"
          opacity={species === "chick" ? 0.35 : 0.5}
        />
      )}
      {species === "panda" && (
        <path d="M54 134 Q100 116 146 134 L148 150 Q100 132 52 150 Z" fill={p.accent} />
      )}
      {species === "chick" && (
        <>
          <ellipse
            cx="52"
            cy="146"
            rx="12"
            ry="20"
            transform="rotate(20 52 146)"
            fill={p.body}
            {...outline}
          />
          <ellipse
            cx="148"
            cy="146"
            rx="12"
            ry="20"
            transform="rotate(-20 148 146)"
            fill={p.body}
            {...outline}
          />
        </>
      )}
      {/* feet */}
      <g className={walking ? "walk-left" : undefined}>
        <ellipse
          cx="78"
          cy="186"
          rx="15"
          ry="9"
          fill={species === "chick" ? p.accent : p.body}
          {...outline}
        />
      </g>
      <g className={walking ? "walk-right" : undefined}>
        <ellipse
          cx="122"
          cy="186"
          rx="15"
          ry="9"
          fill={species === "chick" ? p.accent : p.body}
          {...outline}
        />
      </g>
      <EarsBehind species={species} p={p} />
      {/* head */}
      <ellipse cx="100" cy="86" rx="57" ry="50" fill={p.body} {...outline} />
      {species === "dog" && (
        <>
          <ellipse
            cx="46"
            cy="86"
            rx="15"
            ry="31"
            transform="rotate(16 46 86)"
            fill={p.accent}
            {...outline}
          />
          <ellipse
            cx="154"
            cy="86"
            rx="15"
            ry="31"
            transform="rotate(-16 154 86)"
            fill={p.accent}
            {...outline}
          />
        </>
      )}
      {species === "chick" && (
        <path
          d="M94 38 q-4 -18 8 -22 q-2 10 6 18"
          fill="none"
          stroke={INK}
          strokeWidth={4}
          strokeLinecap="round"
        />
      )}
      <Face species={species} p={p} />
      <AccessoryLayer accessory={accessory} />
    </svg>
  );
});
