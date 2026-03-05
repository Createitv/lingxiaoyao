/**
 * Timeline / sequential steps diagram.
 * Use for learning paths, development milestones, progression steps.
 */
import { COLORS, esc, svgWrap, glowOverlay } from "./shared";

export interface TimelineData {
  title: string;
  events: { label: string; description?: string; tag?: string }[];
  series?: string;
  color?: string;
}

export function timeline(data: TimelineData): string {
  const W = 780;
  const events = data.events.slice(0, 8);
  const color = data.color ?? COLORS.accent;
  const startY = 65;
  const eventH = 52;
  const H = startY + events.length * eventH + 20;
  const lineX = 100;

  let content = "";

  // Vertical timeline line
  content += `<line x1="${lineX}" y1="${startY + 10}" x2="${lineX}" y2="${startY + (events.length - 1) * eventH + 10}" stroke="${color}" stroke-width="1.5" opacity="0.2"/>`;

  events.forEach((event, i) => {
    const y = startY + i * eventH;

    // Node dot
    content += `<circle cx="${lineX}" cy="${y + 12}" r="6" fill="${COLORS.bg}" stroke="${color}" stroke-width="2" opacity="0.8"/>`;
    content += `<circle cx="${lineX}" cy="${y + 12}" r="3" fill="${color}" opacity="0.6"/>`;

    // Connector line to content
    content += `<line x1="${lineX + 10}" y1="${y + 12}" x2="${lineX + 30}" y2="${y + 12}" stroke="${color}" stroke-width="0.5" opacity="0.3"/>`;

    // Content card
    const cardX = lineX + 35;
    const cardW = W - cardX - 40;
    content += `<rect x="${cardX}" y="${y}" width="${cardW}" height="38" rx="6" fill="${COLORS.surface}" opacity="0.6"/>`;
    content += `<rect x="${cardX}" y="${y}" width="${cardW}" height="38" rx="6" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.15"/>`;

    // Label
    content += `<text x="${cardX + 14}" y="${y + 16}" fill="${COLORS.text}" font-size="12" font-weight="bold">${esc(event.label)}</text>`;

    // Description
    if (event.description) {
      content += `<text x="${cardX + 14}" y="${y + 30}" fill="${COLORS.textDim}" font-size="10">${esc(event.description)}</text>`;
    }

    // Tag badge
    if (event.tag) {
      content += `<rect x="${cardX + cardW - 70}" y="${y + 6}" width="56" height="18" rx="9" fill="${color}" opacity="0.1"/>`;
      content += `<text x="${cardX + cardW - 42}" y="${y + 19}" fill="${color}" font-size="9" text-anchor="middle">${esc(event.tag)}</text>`;
    }

    // Step number on left
    content += `<text x="${lineX - 20}" y="${y + 16}" fill="${COLORS.textDim}" font-size="10" text-anchor="end">${String(i + 1).padStart(2, "0")}</text>`;
  });

  const inner = `
  ${glowOverlay("100", "150", color, 0.05)}
  <text x="${W / 2}" y="35" fill="${COLORS.text}" font-size="15" font-weight="bold" text-anchor="middle">${esc(data.title)}</text>
  <line x1="40" y1="48" x2="${W - 40}" y2="48" stroke="${COLORS.border}" stroke-width="0.5"/>
  ${content}`;

  return svgWrap(W, H, inner, "time-grid");
}
