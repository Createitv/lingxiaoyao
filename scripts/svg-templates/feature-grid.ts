/**
 * Feature grid with checkmarks / categories.
 * Use for feature comparison matrices, capability grids.
 */
import { COLORS, esc, svgWrap, glowOverlay } from "./shared";

export interface FeatureGridData {
  title: string;
  columns: string[];
  rows: {
    feature: string;
    values: ("yes" | "no" | "partial" | string)[];
  }[];
  series?: string;
  accentColor?: string;
}

export function featureGrid(data: FeatureGridData): string {
  const W = 780;
  const cols = data.columns.slice(0, 4);
  const featureColW = 220;
  const colW = (W - featureColW - 80) / cols.length;
  const startX = 40;
  const startY = 70;
  const rowH = 32;
  const H = startY + (data.rows.length + 1) * rowH + 20;
  const accentColor = data.accentColor ?? COLORS.accent;

  let content = "";

  // Header background
  content += `<rect x="${startX}" y="${startY}" width="${W - 80}" height="${rowH}" rx="6" fill="${accentColor}" opacity="0.06"/>`;

  // Feature column header
  content += `<text x="${startX + 12}" y="${startY + 21}" fill="${COLORS.textDim}" font-size="10" text-transform="uppercase" letter-spacing="0.1em">Feature</text>`;

  // Column headers
  cols.forEach((col, i) => {
    const x = startX + featureColW + i * colW + colW / 2;
    content += `<text x="${x}" y="${startY + 21}" fill="${accentColor}" font-size="11" font-weight="bold" text-anchor="middle">${esc(col)}</text>`;
  });

  // Separator
  content += `<line x1="${startX}" y1="${startY + rowH}" x2="${W - startX}" y2="${startY + rowH}" stroke="${COLORS.border}" stroke-width="0.5"/>`;

  // Rows
  data.rows.forEach((row, ri) => {
    const y = startY + (ri + 1) * rowH;
    if (ri % 2 === 0) {
      content += `<rect x="${startX}" y="${y}" width="${W - 80}" height="${rowH}" rx="4" fill="${COLORS.surface}" opacity="0.3"/>`;
    }
    // Feature name
    content += `<text x="${startX + 12}" y="${y + 21}" fill="${COLORS.textMuted}" font-size="11">${esc(row.feature)}</text>`;
    // Values
    row.values.slice(0, cols.length).forEach((val, ci) => {
      const x = startX + featureColW + ci * colW + colW / 2;
      if (val === "yes") {
        content += `<circle cx="${x}" cy="${y + 16}" r="6" fill="${COLORS.green}" opacity="0.15"/>`;
        content += `<text x="${x}" y="${y + 20}" fill="${COLORS.green}" font-size="11" text-anchor="middle">✓</text>`;
      } else if (val === "no") {
        content += `<text x="${x}" y="${y + 20}" fill="${COLORS.textDim}" font-size="11" text-anchor="middle">—</text>`;
      } else if (val === "partial") {
        content += `<text x="${x}" y="${y + 20}" fill="${COLORS.accent3}" font-size="11" text-anchor="middle">◐</text>`;
      } else {
        content += `<text x="${x}" y="${y + 21}" fill="${COLORS.text}" font-size="10" text-anchor="middle">${esc(val)}</text>`;
      }
    });
  });

  const inner = `
  ${glowOverlay("390", "80", accentColor, 0.04)}
  <text x="${W / 2}" y="35" fill="${COLORS.text}" font-size="15" font-weight="bold" text-anchor="middle">${esc(data.title)}</text>
  <line x1="40" y1="50" x2="${W - 40}" y2="50" stroke="${COLORS.border}" stroke-width="0.5"/>
  ${content}`;

  return svgWrap(W, H, inner, "feat-grid");
}
