/**
 * Pricing/comparison table.
 * Use for cost breakdowns, pricing tiers, input vs output.
 */
import { COLORS, esc, svgWrap, glowOverlay } from "./shared";

export interface PricingTableData {
  title: string;
  headers: string[];
  rows: { cells: string[]; highlight?: boolean }[];
  series?: string;
  headerColor?: string;
}

export function pricingTable(data: PricingTableData): string {
  const W = 780;
  const colCount = data.headers.length;
  const colW = (W - 80) / colCount;
  const startX = 40;
  const startY = 70;
  const rowH = 34;
  const H = startY + (data.rows.length + 1) * rowH + 20;
  const headerColor = data.headerColor ?? COLORS.accent;

  let content = "";

  // Header row background
  content += `<rect x="${startX}" y="${startY}" width="${W - 80}" height="${rowH}" rx="6" fill="${headerColor}" opacity="0.08"/>`;

  // Header cells
  data.headers.forEach((h, i) => {
    const x = startX + i * colW + colW / 2;
    content += `<text x="${x}" y="${startY + 22}" fill="${headerColor}" font-size="11" font-weight="bold" text-anchor="middle" text-transform="uppercase" letter-spacing="0.1em">${esc(h)}</text>`;
  });

  // Separator
  content += `<line x1="${startX}" y1="${startY + rowH}" x2="${W - startX}" y2="${startY + rowH}" stroke="${COLORS.border}" stroke-width="0.5"/>`;

  // Data rows
  data.rows.forEach((row, ri) => {
    const y = startY + (ri + 1) * rowH;
    // Alternating bg
    if (ri % 2 === 0) {
      content += `<rect x="${startX}" y="${y}" width="${W - 80}" height="${rowH}" rx="4" fill="${COLORS.surface}" opacity="0.4"/>`;
    }
    // Highlight row
    if (row.highlight) {
      content += `<rect x="${startX}" y="${y}" width="${W - 80}" height="${rowH}" rx="4" fill="${headerColor}" opacity="0.05"/>`;
    }

    row.cells.forEach((cell, ci) => {
      const x = startX + ci * colW + colW / 2;
      const fillColor = ci === 0 ? COLORS.textMuted : COLORS.text;
      content += `<text x="${x}" y="${y + 22}" fill="${fillColor}" font-size="11" text-anchor="middle">${esc(cell)}</text>`;
    });
  });

  const inner = `
  ${glowOverlay("390", "80", headerColor, 0.04)}
  <text x="${W / 2}" y="35" fill="${COLORS.text}" font-size="15" font-weight="bold" text-anchor="middle">${esc(data.title)}</text>
  <line x1="40" y1="50" x2="${W - 40}" y2="50" stroke="${COLORS.border}" stroke-width="0.5"/>
  ${content}`;

  return svgWrap(W, H, inner, "price-grid");
}
