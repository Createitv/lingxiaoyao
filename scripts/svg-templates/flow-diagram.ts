/**
 * Step-by-step flow diagram with arrows.
 * Use for processes, workflows, pipelines, data flows.
 */
import { COLORS, esc, svgWrap, glowOverlay } from "./shared";

export interface FlowDiagramData {
  title: string;
  steps: { label: string; description?: string; icon?: string }[];
  series?: string;
  direction?: "horizontal" | "vertical";
  color?: string;
}

export function flowDiagram(data: FlowDiagramData): string {
  const W = 780;
  const color = data.color ?? COLORS.accent;
  const isVertical = data.direction === "vertical";

  if (isVertical) {
    return verticalFlow(W, data, color);
  }
  return horizontalFlow(W, data, color);
}

function horizontalFlow(W: number, data: FlowDiagramData, color: string): string {
  const steps = data.steps.slice(0, 5);
  const stepW = 120;
  const arrowW = 30;
  const totalW = steps.length * stepW + (steps.length - 1) * arrowW;
  const startX = (W - totalW) / 2;
  const H = 180;
  const cy = 105;
  const boxH = 60;

  let content = "";
  steps.forEach((step, i) => {
    const x = startX + i * (stepW + arrowW);
    // Step box
    content += `<rect x="${x}" y="${cy - boxH / 2}" width="${stepW}" height="${boxH}" rx="10" fill="${COLORS.surface}" stroke="${color}" stroke-width="1" opacity="0.3"/>`;
    content += `<rect x="${x}" y="${cy - boxH / 2}" width="${stepW}" height="${boxH}" rx="10" fill="${COLORS.surface}"/>`;
    content += `<rect x="${x}" y="${cy - boxH / 2}" width="${stepW}" height="${boxH}" rx="10" fill="none" stroke="${color}" stroke-width="1" opacity="0.3"/>`;
    // Step number
    content += `<text x="${x + stepW / 2}" y="${cy - 8}" fill="${color}" font-size="10" text-anchor="middle" opacity="0.7">${String(i + 1).padStart(2, "0")}</text>`;
    // Label
    content += `<text x="${x + stepW / 2}" y="${cy + 10}" fill="${COLORS.text}" font-size="11" font-weight="bold" text-anchor="middle">${esc(step.label)}</text>`;
    // Description below
    if (step.description) {
      content += `<text x="${x + stepW / 2}" y="${cy + boxH / 2 + 18}" fill="${COLORS.textDim}" font-size="9" text-anchor="middle">${esc(step.description)}</text>`;
    }
    // Arrow to next
    if (i < steps.length - 1) {
      const ax = x + stepW + 4;
      const aEnd = ax + arrowW - 8;
      content += `<line x1="${ax}" y1="${cy}" x2="${aEnd}" y2="${cy}" stroke="${color}" stroke-width="1.5" opacity="0.4"/>`;
      content += `<polygon points="${aEnd},${cy - 4} ${aEnd + 6},${cy} ${aEnd},${cy + 4}" fill="${color}" opacity="0.5"/>`;
    }
  });

  const inner = `
  ${glowOverlay("390", "100", color, 0.05)}
  <text x="${W / 2}" y="35" fill="${COLORS.text}" font-size="15" font-weight="bold" text-anchor="middle">${esc(data.title)}</text>
  <line x1="40" y1="48" x2="${W - 40}" y2="48" stroke="${COLORS.border}" stroke-width="0.5"/>
  ${content}`;

  return svgWrap(W, H, inner, "flow-grid");
}

function verticalFlow(W: number, data: FlowDiagramData, color: string): string {
  const steps = data.steps.slice(0, 6);
  const stepH = 44;
  const arrowH = 24;
  const startY = 65;
  const boxW = 400;
  const startX = (W - boxW) / 2;
  const H = startY + steps.length * (stepH + arrowH) - arrowH + 30;

  let content = "";
  steps.forEach((step, i) => {
    const y = startY + i * (stepH + arrowH);
    // Box
    content += `<rect x="${startX}" y="${y}" width="${boxW}" height="${stepH}" rx="8" fill="${COLORS.surface}" stroke="${color}" stroke-width="1" opacity="0.25"/>`;
    content += `<rect x="${startX}" y="${y}" width="${boxW}" height="${stepH}" rx="8" fill="${COLORS.surface}"/>`;
    content += `<rect x="${startX}" y="${y}" width="${boxW}" height="${stepH}" rx="8" fill="none" stroke="${color}" stroke-width="1" opacity="0.25"/>`;
    // Number circle
    content += `<circle cx="${startX + 24}" cy="${y + stepH / 2}" r="10" fill="${color}" opacity="0.15"/>`;
    content += `<text x="${startX + 24}" y="${y + stepH / 2 + 4}" fill="${color}" font-size="10" font-weight="bold" text-anchor="middle">${i + 1}</text>`;
    // Label
    content += `<text x="${startX + 46}" y="${y + stepH / 2 + 4}" fill="${COLORS.text}" font-size="12" font-weight="bold">${esc(step.label)}</text>`;
    // Description
    if (step.description) {
      content += `<text x="${startX + boxW - 16}" y="${y + stepH / 2 + 4}" fill="${COLORS.textDim}" font-size="10" text-anchor="end">${esc(step.description)}</text>`;
    }
    // Arrow
    if (i < steps.length - 1) {
      const ay = y + stepH + 4;
      const aEnd = ay + arrowH - 10;
      content += `<line x1="${W / 2}" y1="${ay}" x2="${W / 2}" y2="${aEnd}" stroke="${color}" stroke-width="1.5" opacity="0.3"/>`;
      content += `<polygon points="${W / 2 - 4},${aEnd} ${W / 2},${aEnd + 6} ${W / 2 + 4},${aEnd}" fill="${color}" opacity="0.4"/>`;
    }
  });

  const inner = `
  ${glowOverlay("390", "100", color, 0.05)}
  <text x="${W / 2}" y="35" fill="${COLORS.text}" font-size="15" font-weight="bold" text-anchor="middle">${esc(data.title)}</text>
  <line x1="40" y1="48" x2="${W - 40}" y2="48" stroke="${COLORS.border}" stroke-width="0.5"/>
  ${content}`;

  return svgWrap(W, H, inner, "vflow-grid");
}
