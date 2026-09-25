/**
 * Organic blob paths. Every path has the same number of points and commands,
 * so Framer Motion can interpolate `d` between two blobs (a smooth morph).
 */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Closed Catmull-Rom spline through `points` jittered points on a circle (viewBox 0 0 200 200). */
export function blobPath(seed: number, { points = 8, variance = 0.28, radius = 80 } = {}): string {
  const random = rng(seed);
  const pts = Array.from({ length: points }, (_, i) => {
    const angle = (i / points) * Math.PI * 2;
    const r = radius * (1 - variance / 2 + random() * variance);
    return [100 + Math.cos(angle) * r, 100 + Math.sin(angle) * r] as const;
  });
  const at = (i: number) => pts[(i + points) % points]!;
  let d = `M${at(0)[0].toFixed(2)} ${at(0)[1].toFixed(2)}`;
  for (let i = 0; i < points; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]!.toFixed(2)} ${c1[1]!.toFixed(2)} ${c2[0]!.toFixed(2)} ${c2[1]!.toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return `${d} Z`;
}
