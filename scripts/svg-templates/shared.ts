/**
 * Shared constants and utilities for SVG templates.
 * All templates use a consistent dark-theme design language.
 */

export const COLORS = {
  bg: "#0e1420",
  surface: "#141c2e",
  border: "#1e2d47",
  text: "#e2e8f0",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  accent: "#00d4ff",
  accent2: "#7c3aed",
  accent3: "#f59e0b",
  green: "#10b981",
  red: "#ef4444",
  gridLine: "rgba(0,212,255,0.04)",
};

export const SERIES_COLORS: Record<string, { c1: string; c2: string }> = {
  "Claude 入门": { c1: "#10b981", c2: "#00d4ff" },
  "Claude API 开发": { c1: "#00d4ff", c2: "#0080ff" },
  "Claude 高级开发": { c1: "#7c3aed", c2: "#a855f7" },
};

export function getSeriesColors(series?: string) {
  return series
    ? SERIES_COLORS[series] ?? { c1: COLORS.accent, c2: COLORS.accent2 }
    : { c1: COLORS.accent, c2: COLORS.accent2 };
}

/** Escape XML special characters. */
export function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Common SVG grid pattern background. */
export function gridBg(id: string, w: number, h: number): string {
  return `
  <defs>
    <pattern id="${id}" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="${COLORS.accent}" stroke-width="0.3" opacity="0.06"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="${COLORS.bg}"/>
  <rect width="${w}" height="${h}" fill="url(#${id})"/>`;
}

/** Radial glow overlay. */
export function glowOverlay(
  cx: string,
  cy: string,
  color: string,
  opacity = 0.1,
): string {
  return `<circle cx="${cx}" cy="${cy}" r="200" fill="${color}" opacity="${opacity}" filter="url(#blur)"/>`;
}

/** Standard blur filter definition. */
export function blurDef(id = "blur"): string {
  return `<filter id="${id}"><feGaussianBlur stdDeviation="60"/></filter>`;
}

/** SVG wrapper with viewBox and dark background. */
export function svgWrap(
  w: number,
  h: number,
  inner: string,
  gridId = "g",
): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="font-family: 'JetBrains Mono', monospace">
${gridBg(gridId, w, h)}
${blurDef()}
${inner}
</svg>`;
}
