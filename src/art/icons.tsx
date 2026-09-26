import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true } as const;

/** Generic community / chat icon (stands in for Discord). */
export const ChatIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M5 4h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-5.5L9 21.5V18H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Zm3.5 6.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm7 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z" />
  </svg>
);

/** Sailboat (stands in for a marketplace like OpenSea). */
export const BoatIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M11 3v12H4.5L11 3Zm2 2.5 6.5 9.5H13V5.5ZM2.5 17h19l-2.2 3.2a2 2 0 0 1-1.65.8H6.35a2 2 0 0 1-1.65-.8L2.5 17Z" />
  </svg>
);

/** Bird (stands in for X / Twitter). */
export const BirdIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.2-.8.5-1.7.8-2.6 1a4 4 0 0 0-6.9 3.7A11.4 11.4 0 0 1 3.7 4.9a4 4 0 0 0 1.2 5.4c-.7 0-1.3-.2-1.8-.5 0 2 1.4 3.6 3.2 4a4 4 0 0 1-1.8.1 4 4 0 0 0 3.8 2.8A8 8 0 0 1 2 18.3 11.4 11.4 0 0 0 8.2 20c7.5 0 11.6-6.2 11.6-11.6v-.5c.8-.6 1.5-1.3 2.2-2Z" />
  </svg>
);

export const StarIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden {...props}>
    <path
      d="M12 1.5c.6 5.2 3.3 7.9 10.5 10.5-7.2 2.6-9.9 5.3-10.5 10.5-.6-5.2-3.3-7.9-10.5-10.5C8.7 9.4 11.4 6.7 12 1.5Z"
      fill="currentColor"
    />
  </svg>
);

export const FishIcon = (props: IconProps) => (
  <svg viewBox="0 0 32 20" aria-hidden {...props}>
    <path d="M2 10c4-7 13-9 20-4l6-4-1.5 8L28 18l-6-4c-7 5-16 3-20-4Z" fill="currentColor" />
    <circle cx="9" cy="8.5" r="1.4" fill="#0d1145" />
  </svg>
);
