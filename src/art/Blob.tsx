import { useId } from "react";
import { blobPath } from "./blobPath";

/** Soft two-tone gradient blob, like the reference's pastel shapes. */
export function Blob({
  seed,
  from,
  to,
  className,
}: {
  seed: number;
  from: string;
  to: string;
  className?: string;
}) {
  const id = useId();
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <path d={blobPath(seed, { variance: 0.45 })} fill={`url(#${id})`} />
    </svg>
  );
}
