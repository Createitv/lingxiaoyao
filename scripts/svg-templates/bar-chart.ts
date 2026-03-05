/**
 * Horizontal bar chart for comparing quantities.
 * Use for showing relative values, performance metrics, cost comparisons.
 */
import { COLORS, esc, svgWrap, glowOverlay } from "./shared";

export interface BarChartData {
  title: string;
  items: { label: string; value: number; displayValue?: string }[];
  series?: string;
  barColor?: string;
  unit?: string;
}

export function barChart(data: BarChartData): string {
  const W = 780;
  const barH = 28;
  const gap = 16;
  const startY = 70;
  const labelW = 160;
  const barMaxW = W - labelW - 140;
  const H = startY + data.items.length * (barH + gap) + 20;
  const barColor = data.barColor ?? COLORS.accent;

  const maxVal = Math.max(...data.items.map((i) => i.value));

  let bars = "";
  data.items.forEach((item, i) => {
    const y = startY + i * (barH + gap);
    const barW = maxVal > 0 ? (item.value / maxVal) * barMaxW : 0;
    const displayVal = item.displayValue ?? String(item.value) + (data.unit ? " " + data.unit : "");

    // Label
    bars += `<text x="${labelW - 10}" y="${y + barH / 2 + 4}" fill="${COLORS.textMuted}" font-size="12" text-anchor="end">${esc(item.label)}</text>`;
    // Bar background
    bars += `<rect x="${labelW}" y="${y}" width="${barMaxW}" height="${barH}" rx="4" fill="${COLORS.surface}" opacity="0.4"/>`;
    // Bar fill with gradient
    bars += `<rect x="${labelW}" y="${y}" width="${barW}" height="${barH}" rx="4" fill="${barColor}" opacity="0.7"/>`;
    bars += `<rect x="${labelW}" y="${y}" width="${barW}" height="${barH / 2}" rx="4" fill="white" opacity="0.08"/>`;
    // Value label
    bars += `<text x="${labelW + barW + 10}" y="${y + barH / 2 + 4}" fill="${COLORS.text}" font-size="11">${esc(displayVal)}</text>`;
  });

  const inner = `
  ${glowOverlay("390", "80", barColor, 0.05)}
  <text x="${W / 2}" y="35" fill="${COLORS.text}" font-size="15" font-weight="bold" text-anchor="middle">${esc(data.title)}</text>
  <line x1="40" y1="50" x2="${W - 40}" y2="50" stroke="${COLORS.border}" stroke-width="0.5"/>
  ${bars}`;

  return svgWrap(W, H, inner, "bar-grid");
}
