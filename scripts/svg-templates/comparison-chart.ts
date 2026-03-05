/**
 * Comparison chart: side-by-side comparison of two items.
 * Use for before/after, A vs B, pros/cons comparisons.
 */
import { COLORS, esc, svgWrap, glowOverlay } from "./shared";

export interface ComparisonData {
  title: string;
  leftLabel: string;
  rightLabel: string;
  items: { label: string; left: string; right: string }[];
  series?: string;
  leftColor?: string;
  rightColor?: string;
}

export function comparisonChart(data: ComparisonData): string {
  const W = 780;
  const leftColor = data.leftColor ?? COLORS.accent;
  const rightColor = data.rightColor ?? COLORS.accent2;
  const rowH = 36;
  const startY = 90;
  const H = startY + data.items.length * rowH + 30;

  let rows = "";
  data.items.forEach((item, i) => {
    const y = startY + i * rowH;
    // Alternating row background
    if (i % 2 === 0) {
      rows += `<rect x="20" y="${y}" width="${W - 40}" height="${rowH}" rx="4" fill="${COLORS.surface}" opacity="0.5"/>`;
    }
    // Label
    rows += `<text x="40" y="${y + 22}" fill="${COLORS.textMuted}" font-size="12">${esc(item.label)}</text>`;
    // Left value
    rows += `<text x="${W / 2 - 40}" y="${y + 22}" fill="${leftColor}" font-size="12" text-anchor="end">${esc(item.left)}</text>`;
    // Right value
    rows += `<text x="${W / 2 + 40}" y="${y + 22}" fill="${rightColor}" font-size="12" text-anchor="start">${esc(item.right)}</text>`;
  });

  // Divider line
  const dividerY1 = startY - 5;
  const dividerY2 = startY + data.items.length * rowH + 5;

  const inner = `
  ${glowOverlay("200", "100", leftColor, 0.06)}
  ${glowOverlay("580", "100", rightColor, 0.06)}
  <!-- Title -->
  <text x="${W / 2}" y="35" fill="${COLORS.text}" font-size="15" font-weight="bold" text-anchor="middle">${esc(data.title)}</text>
  <!-- Column headers -->
  <text x="${W / 2 - 40}" y="65" fill="${leftColor}" font-size="13" font-weight="bold" text-anchor="end">${esc(data.leftLabel)}</text>
  <text x="${W / 2 + 40}" y="65" fill="${rightColor}" font-size="13" font-weight="bold" text-anchor="start">${esc(data.rightLabel)}</text>
  <!-- Center divider -->
  <line x1="${W / 2}" y1="${dividerY1}" x2="${W / 2}" y2="${dividerY2}" stroke="${COLORS.border}" stroke-width="1" stroke-dasharray="4,4"/>
  <!-- Header underline -->
  <line x1="40" y1="74" x2="${W - 40}" y2="74" stroke="${COLORS.border}" stroke-width="0.5"/>
  ${rows}`;

  return svgWrap(W, H, inner, "comp-grid");
}
