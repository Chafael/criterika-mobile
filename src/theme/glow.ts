/**
 * Cross-platform stand-in for Figma's layer blur (`filter: blur()` only works
 * on Android in React Native). Builds a radial gradient whose alpha stops
 * follow a Gaussian-blurred disk, computed numerically from the Figma blur
 * radius (σ) and shape radius (r), sampled at 0–100 % of r + 2σ.
 */

type Rgba = { r: number; g: number; b: number; a: number };

function parseRgba(color: string): Rgba {
  const match = /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\s*\)/.exec(
    color,
  );
  if (!match) {
    throw new Error(`Unsupported color for glow: ${color}`);
  }
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] === undefined ? 1 : Number(match[4]),
  };
}

/** Relative alpha (0–1) at each stop, normalized to the shape's own alpha. */
type GlowProfile = readonly (readonly [stopPercent: number, relativeAlpha: number])[];

/** Circle r = 64, blur σ = 40 (decoration 1:424). */
export const decorGlowProfile: GlowProfile = [
  [0, 0.72],
  [25, 0.587],
  [50, 0.303],
  [65, 0.157],
  [80, 0.063],
  [100, 0],
];

/** Pill half-height r = 67, blur σ = 12 (active halo 1:485). */
export const haloGlowProfile: GlowProfile = [
  [0, 1],
  [25, 1],
  [50, 0.953],
  [65, 0.707],
  [80, 0.28],
  [100, 0],
];

export function glowGradient(color: string, profile: GlowProfile): string {
  const { r, g, b, a } = parseRgba(color);
  const stops = profile
    .map(([stop, relative]) => `rgba(${r}, ${g}, ${b}, ${(a * relative).toFixed(3)}) ${stop}%`)
    .join(', ');
  return `radial-gradient(closest-side, ${stops})`;
}
