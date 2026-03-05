/**
 * Three-column tier/card layout.
 * Use for comparing tiers, plans, levels, or three related items.
 */
import { COLORS, esc, svgWrap, glowOverlay } from "./shared";

export interface TierCardsData {
  title: string;
  cards: {
    label: string;
    icon?: string;
    items: string[];
    highlight?: boolean;
    color?: string;
  }[];
  series?: string;
}

export function tierCards(data: TierCardsData): string {
  const W = 780;
  const cardW = 220;
  const cardGap = 20;
  const startX = (W - (cardW * 3 + cardGap * 2)) / 2;
  const startY = 65;
  const itemH = 22;
  const maxItems = Math.max(...data.cards.slice(0, 3).map((c) => c.items.length));
  const cardH = 50 + maxItems * itemH + 20;
  const H = startY + cardH + 30;

  const defaultColors = [COLORS.accent, COLORS.accent2, COLORS.accent3];

  let cards = "";
  data.cards.slice(0, 3).forEach((card, i) => {
    const x = startX + i * (cardW + cardGap);
    const color = card.color ?? defaultColors[i % 3];
    const borderOpacity = card.highlight ? 0.5 : 0.2;

    // Card background
    cards += `<rect x="${x}" y="${startY}" width="${cardW}" height="${cardH}" rx="12" fill="${COLORS.surface}" stroke="${color}" stroke-width="1" opacity="${borderOpacity}"/>`;
    cards += `<rect x="${x}" y="${startY}" width="${cardW}" height="${cardH}" rx="12" fill="${COLORS.surface}"/>`;
    cards += `<rect x="${x}" y="${startY}" width="${cardW}" height="${cardH}" rx="12" fill="none" stroke="${color}" stroke-width="1" opacity="${borderOpacity}"/>`;
    // Top accent line
    cards += `<line x1="${x + 20}" y1="${startY}" x2="${x + cardW - 20}" y2="${startY}" stroke="${color}" stroke-width="2" opacity="0.6"/>`;
    // Icon + label
    if (card.icon) {
      cards += `<text x="${x + 20}" y="${startY + 30}" font-size="16">${card.icon}</text>`;
      cards += `<text x="${x + 42}" y="${startY + 30}" fill="${color}" font-size="13" font-weight="bold">${esc(card.label)}</text>`;
    } else {
      cards += `<text x="${x + 20}" y="${startY + 30}" fill="${color}" font-size="13" font-weight="bold">${esc(card.label)}</text>`;
    }
    // Items
    card.items.forEach((item, j) => {
      const iy = startY + 50 + j * itemH;
      cards += `<circle cx="${x + 24}" cy="${iy + 1}" r="2" fill="${color}" opacity="0.5"/>`;
      cards += `<text x="${x + 34}" y="${iy + 5}" fill="${COLORS.textMuted}" font-size="11">${esc(item)}</text>`;
    });
  });

  const inner = `
  ${glowOverlay("200", "120", defaultColors[0], 0.04)}
  ${glowOverlay("580", "120", defaultColors[1], 0.04)}
  <text x="${W / 2}" y="35" fill="${COLORS.text}" font-size="15" font-weight="bold" text-anchor="middle">${esc(data.title)}</text>
  <line x1="40" y1="48" x2="${W - 40}" y2="48" stroke="${COLORS.border}" stroke-width="0.5"/>
  ${cards}`;

  return svgWrap(W, H, inner, "tier-grid");
}
