/**
 * Layered architecture / stack diagram.
 * Use for showing layers, hierarchies, architecture stacks.
 */
import { COLORS, esc, svgWrap, glowOverlay } from "./shared";

export interface LayeredStackData {
  title: string;
  layers: { label: string; description?: string; color?: string }[];
  series?: string;
}

export function layeredStack(data: LayeredStackData): string {
  const W = 780;
  const layerH = 48;
  const gap = 8;
  const layers = data.layers.slice(0, 6);
  const startY = 65;
  const boxW = 500;
  const startX = (W - boxW) / 2;
  const H = startY + layers.length * (layerH + gap) - gap + 30;

  const defaultColors = [COLORS.accent, "#0080ff", COLORS.accent2, COLORS.accent3, COLORS.green, "#ef4444"];

  let content = "";
  layers.forEach((layer, i) => {
    const y = startY + i * (layerH + gap);
    const color = layer.color ?? defaultColors[i % defaultColors.length];

    // Layer box
    content += `<rect x="${startX}" y="${y}" width="${boxW}" height="${layerH}" rx="8" fill="${COLORS.surface}"/>`;
    content += `<rect x="${startX}" y="${y}" width="${boxW}" height="${layerH}" rx="8" fill="none" stroke="${color}" stroke-width="1" opacity="0.25"/>`;
    // Left accent bar
    content += `<rect x="${startX}" y="${y}" width="4" height="${layerH}" rx="2" fill="${color}" opacity="0.6"/>`;
    // Label
    content += `<text x="${startX + 20}" y="${y + layerH / 2 + 5}" fill="${COLORS.text}" font-size="13" font-weight="bold">${esc(layer.label)}</text>`;
    // Description on right
    if (layer.description) {
      content += `<text x="${startX + boxW - 16}" y="${y + layerH / 2 + 4}" fill="${COLORS.textDim}" font-size="10" text-anchor="end">${esc(layer.description)}</text>`;
    }
    // Arrow between layers
    if (i < layers.length - 1) {
      const arrowY = y + layerH + 1;
      content += `<line x1="${W / 2 - 15}" y1="${arrowY}" x2="${W / 2 - 1}" y2="${arrowY + gap - 2}" stroke="${COLORS.textDim}" stroke-width="0.8" opacity="0.4"/>`;
      content += `<line x1="${W / 2 + 15}" y1="${arrowY}" x2="${W / 2 + 1}" y2="${arrowY + gap - 2}" stroke="${COLORS.textDim}" stroke-width="0.8" opacity="0.4"/>`;
    }
  });

  const inner = `
  ${glowOverlay("390", "100", defaultColors[0], 0.04)}
  <text x="${W / 2}" y="35" fill="${COLORS.text}" font-size="15" font-weight="bold" text-anchor="middle">${esc(data.title)}</text>
  <line x1="40" y1="48" x2="${W - 40}" y2="48" stroke="${COLORS.border}" stroke-width="0.5"/>
  ${content}`;

  return svgWrap(W, H, inner, "layer-grid");
}
