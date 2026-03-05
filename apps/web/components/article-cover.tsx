/**
 * Cloud-style article cover using inline SVG.
 * Generates atmospheric cloud visuals with subtle animations.
 * Each article gets a unique composition based on its title hash.
 *
 * Two variants:
 * - ArticleCover: Card-size for article list (pure background, no text)
 * - ArticleCoverHero: Full-width banner for article detail page (pure background)
 */

const SERIES_THEMES: Record<string, { c1: string; c2: string }> = {
  "Claude 入门": { c1: "#10b981", c2: "#06b6d4" },
  "Claude API 开发": { c1: "#06b6d4", c2: "#3b82f6" },
  "Claude 高级开发": { c1: "#8b5cf6", c2: "#a855f7" },
  "21天学习Claude": { c1: "#f59e0b", c2: "#ef4444" },
};

const DEFAULT_THEME = { c1: "#06b6d4", c2: "#8b5cf6" };

function hashTitle(title: string): number {
  return title.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

/** Deterministic pseudo-random from seed */
function seeded(seed: number, i: number): number {
  return ((seed * (i + 1) * 9301 + 49297) % 233280) / 233280;
}

function getTheme(series?: string) {
  return series ? (SERIES_THEMES[series] ?? DEFAULT_THEME) : DEFAULT_THEME;
}

interface ArticleCoverProps {
  title: string;
  series?: string;
}

/**
 * Card-size cloud cover (pure visual background, no text).
 * Use inside a positioned container; this fills 100%.
 */
export function ArticleCover({ title, series }: ArticleCoverProps) {
  const theme = getTheme(series);
  const h = hashTitle(title);

  const clouds = Array.from({ length: 4 }, (_, i) => ({
    cx: seeded(h, i * 3) * 80 + 10,
    cy: seeded(h, i * 3 + 1) * 50 + 15,
    rx: seeded(h, i * 3 + 2) * 15 + 12,
    ry: seeded(h, i * 5) * 6 + 5,
    drift: seeded(h, i * 7) * 3 + 1,
    dur: seeded(h, i * 11) * 6 + 8,
  }));

  const particles = Array.from({ length: 6 }, (_, i) => ({
    cx: seeded(h, 20 + i * 2) * 90 + 5,
    cy: seeded(h, 20 + i * 2 + 1) * 70 + 10,
    r: seeded(h, 30 + i) * 2 + 1,
    dur: seeded(h, 40 + i) * 4 + 6,
  }));

  const uid = `ac-${h}`;

  return (
    <div className="absolute inset-0 bg-[#0a0f1a]">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 800 450"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#0a0f1a" />
            <stop offset="100%" stopColor="#0d1321" />
          </linearGradient>
          <filter id={`${uid}-bxl`}><feGaussianBlur stdDeviation="40" /></filter>
          <filter id={`${uid}-blg`}><feGaussianBlur stdDeviation="25" /></filter>
          <filter id={`${uid}-bmd`}><feGaussianBlur stdDeviation="12" /></filter>
          <pattern id={`${uid}-grid`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={theme.c1} strokeWidth="0.3" opacity="0.04" />
          </pattern>
          <linearGradient id={`${uid}-fade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a0f1a" stopOpacity="0" />
            <stop offset="45%" stopColor="#0a0f1a" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0a0f1a" stopOpacity="0.92" />
          </linearGradient>
          <linearGradient id={`${uid}-top`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="30%" stopColor={theme.c1} stopOpacity="0.5" />
            <stop offset="70%" stopColor={theme.c2} stopOpacity="0.5" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="800" height="450" fill={`url(#${uid}-sky)`} />
        <rect width="800" height="450" fill={`url(#${uid}-grid)`} />

        {/* Ambient glow */}
        <ellipse
          cx={seeded(h, 50) * 400 + 200} cy={seeded(h, 51) * 150 + 100}
          rx="300" ry="200" fill={theme.c1} opacity="0.04"
          filter={`url(#${uid}-bxl)`}
        />
        <ellipse
          cx={seeded(h, 52) * 400 + 200} cy={seeded(h, 53) * 150 + 200}
          rx="250" ry="180" fill={theme.c2} opacity="0.035"
          filter={`url(#${uid}-bxl)`}
        />

        {/* Cloud layers with drift animation */}
        {clouds.map((c, i) => {
          const color = i % 2 === 0 ? theme.c1 : theme.c2;
          const opacity = 0.06 + seeded(h, 60 + i) * 0.06;
          const x = (c.cx / 100) * 800;
          const y = (c.cy / 100) * 450;
          const rX = (c.rx / 100) * 800;
          const rY = (c.ry / 100) * 450;
          const dx = (c.drift / 100) * 800;
          return (
            <g key={i}>
              <ellipse cx={x} cy={y} rx={rX} ry={rY} fill={color} opacity={opacity} filter={`url(#${uid}-blg)`}>
                <animateTransform attributeName="transform" type="translate" values={`0 0; ${dx} ${dx * 0.3}; 0 0`} dur={`${c.dur}s`} repeatCount="indefinite" />
              </ellipse>
              <ellipse cx={x + rX * 0.2} cy={y - rY * 0.3} rx={rX * 0.6} ry={rY * 0.5} fill={color} opacity={opacity * 0.7} filter={`url(#${uid}-bmd)`}>
                <animateTransform attributeName="transform" type="translate" values={`0 0; ${-dx * 0.5} ${dx * 0.2}; 0 0`} dur={`${c.dur * 1.3}s`} repeatCount="indefinite" />
              </ellipse>
            </g>
          );
        })}

        {/* Cloud wireframe outlines */}
        <g opacity="0.08">
          {[0, 1, 2].map((i) => {
            const cx = seeded(h, 70 + i) * 500 + 150;
            const cy = seeded(h, 73 + i) * 200 + 80;
            const s = seeded(h, 76 + i) * 30 + 20;
            const color = i % 2 === 0 ? theme.c1 : theme.c2;
            return (
              <g key={`o-${i}`}>
                <circle cx={cx} cy={cy} r={s} fill="none" stroke={color} strokeWidth="0.8" />
                <circle cx={cx - s * 0.7} cy={cy + s * 0.3} r={s * 0.75} fill="none" stroke={color} strokeWidth="0.6" />
                <circle cx={cx + s * 0.7} cy={cy + s * 0.3} r={s * 0.7} fill="none" stroke={color} strokeWidth="0.6" />
              </g>
            );
          })}
        </g>

        {/* Floating particles with pulse */}
        {particles.map((p, i) => {
          const color = i % 2 === 0 ? theme.c1 : theme.c2;
          return (
            <circle key={`p-${i}`} cx={(p.cx / 100) * 800} cy={(p.cy / 100) * 450} r={p.r} fill={color} opacity="0.15">
              <animate attributeName="opacity" values="0.15;0.06;0.15" dur={`${p.dur}s`} repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="translate" values={`0 0; ${seeded(h, 80 + i) * 10 - 5} ${seeded(h, 85 + i) * 8 - 4}; 0 0`} dur={`${p.dur * 1.2}s`} repeatCount="indefinite" />
            </circle>
          );
        })}

        {/* Connecting lines */}
        {[0, 1].map((i) => (
          <line
            key={`ln-${i}`}
            x1={(particles[i * 2].cx / 100) * 800} y1={(particles[i * 2].cy / 100) * 450}
            x2={(particles[i * 2 + 1].cx / 100) * 800} y2={(particles[i * 2 + 1].cy / 100) * 450}
            stroke={i === 0 ? theme.c1 : theme.c2} strokeWidth="0.5" opacity="0.05" strokeDasharray="4 4"
          >
            <animate attributeName="opacity" values="0.05;0.02;0.05" dur={`${8 + i * 3}s`} repeatCount="indefinite" />
          </line>
        ))}

        {/* Bottom fade + top accent */}
        <rect x="0" y="0" width="800" height="450" fill={`url(#${uid}-fade)`} />
        <rect x="0" y="0" width="800" height="1.5" fill={`url(#${uid}-top)`} />
      </svg>
    </div>
  );
}

/**
 * Hero-size cover for article detail page.
 * Renders as a full-width atmospheric cloud background.
 */
export function ArticleCoverHero({ title, series }: ArticleCoverProps) {
  const theme = getTheme(series);
  const h = hashTitle(title);

  const clouds = Array.from({ length: 6 }, (_, i) => ({
    cx: seeded(h, i * 3) * 85 + 7,
    cy: seeded(h, i * 3 + 1) * 60 + 10,
    rx: seeded(h, i * 3 + 2) * 18 + 10,
    ry: seeded(h, i * 5) * 8 + 5,
    drift: seeded(h, i * 7) * 4 + 2,
    dur: seeded(h, i * 11) * 8 + 10,
  }));

  const particles = Array.from({ length: 10 }, (_, i) => ({
    cx: seeded(h, 20 + i * 2) * 90 + 5,
    cy: seeded(h, 20 + i * 2 + 1) * 80 + 5,
    r: seeded(h, 30 + i) * 2.5 + 1,
    dur: seeded(h, 40 + i) * 5 + 7,
  }));

  const uid = `ach-${h}`;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 500"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#0a0f1a" />
          </linearGradient>
          <filter id={`${uid}-bxl`}><feGaussianBlur stdDeviation="60" /></filter>
          <filter id={`${uid}-blg`}><feGaussianBlur stdDeviation="35" /></filter>
          <filter id={`${uid}-bmd`}><feGaussianBlur stdDeviation="16" /></filter>
          <pattern id={`${uid}-grid`} width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke={theme.c1} strokeWidth="0.3" opacity="0.03" />
          </pattern>
          <linearGradient id={`${uid}-fade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="70%" stopColor="transparent" />
            <stop offset="100%" stopColor="var(--background, #0a0f1a)" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id={`${uid}-top`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="20%" stopColor={theme.c1} stopOpacity="0.3" />
            <stop offset="80%" stopColor={theme.c2} stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        <rect width="1200" height="500" fill={`url(#${uid}-sky)`} />
        <rect width="1200" height="500" fill={`url(#${uid}-grid)`} />

        {/* Ambient glow */}
        <ellipse cx="400" cy="200" rx="500" ry="300" fill={theme.c1} opacity="0.03" filter={`url(#${uid}-bxl)`} />
        <ellipse cx="800" cy="300" rx="400" ry="250" fill={theme.c2} opacity="0.025" filter={`url(#${uid}-bxl)`} />

        {/* Cloud layers */}
        {clouds.map((c, i) => {
          const color = i % 2 === 0 ? theme.c1 : theme.c2;
          const opacity = 0.05 + seeded(h, 60 + i) * 0.05;
          const x = (c.cx / 100) * 1200;
          const y = (c.cy / 100) * 500;
          const rX = (c.rx / 100) * 1200;
          const rY = (c.ry / 100) * 500;
          const dx = (c.drift / 100) * 1200;
          return (
            <g key={i}>
              <ellipse cx={x} cy={y} rx={rX} ry={rY} fill={color} opacity={opacity} filter={`url(#${uid}-blg)`}>
                <animateTransform attributeName="transform" type="translate" values={`0 0; ${dx} ${dx * 0.2}; 0 0`} dur={`${c.dur}s`} repeatCount="indefinite" />
              </ellipse>
              <ellipse cx={x + rX * 0.15} cy={y - rY * 0.25} rx={rX * 0.5} ry={rY * 0.4} fill={color} opacity={opacity * 0.6} filter={`url(#${uid}-bmd)`}>
                <animateTransform attributeName="transform" type="translate" values={`0 0; ${-dx * 0.4} ${dx * 0.15}; 0 0`} dur={`${c.dur * 1.2}s`} repeatCount="indefinite" />
              </ellipse>
            </g>
          );
        })}

        {/* Cloud wireframe outlines */}
        <g opacity="0.06">
          {[0, 1, 2, 3].map((i) => {
            const cx = seeded(h, 70 + i) * 800 + 200;
            const cy = seeded(h, 73 + i) * 250 + 60;
            const s = seeded(h, 76 + i) * 40 + 25;
            const color = i % 2 === 0 ? theme.c1 : theme.c2;
            return (
              <g key={`o-${i}`}>
                <circle cx={cx} cy={cy} r={s} fill="none" stroke={color} strokeWidth="0.8" />
                <circle cx={cx - s * 0.7} cy={cy + s * 0.3} r={s * 0.7} fill="none" stroke={color} strokeWidth="0.6" />
                <circle cx={cx + s * 0.7} cy={cy + s * 0.3} r={s * 0.65} fill="none" stroke={color} strokeWidth="0.6" />
              </g>
            );
          })}
        </g>

        {/* Floating particles */}
        {particles.map((p, i) => {
          const color = i % 2 === 0 ? theme.c1 : theme.c2;
          return (
            <circle key={`p-${i}`} cx={(p.cx / 100) * 1200} cy={(p.cy / 100) * 500} r={p.r} fill={color} opacity="0.12">
              <animate attributeName="opacity" values="0.12;0.04;0.12" dur={`${p.dur}s`} repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="translate" values={`0 0; ${seeded(h, 80 + i) * 15 - 7} ${seeded(h, 85 + i) * 10 - 5}; 0 0`} dur={`${p.dur * 1.3}s`} repeatCount="indefinite" />
            </circle>
          );
        })}

        {/* Connecting lines */}
        {[0, 1, 2].map((i) => (
          <line
            key={`ln-${i}`}
            x1={(particles[i * 2].cx / 100) * 1200} y1={(particles[i * 2].cy / 100) * 500}
            x2={(particles[i * 2 + 1].cx / 100) * 1200} y2={(particles[i * 2 + 1].cy / 100) * 500}
            stroke={i % 2 === 0 ? theme.c1 : theme.c2} strokeWidth="0.5" opacity="0.04" strokeDasharray="6 6"
          >
            <animate attributeName="opacity" values="0.04;0.015;0.04" dur={`${10 + i * 4}s`} repeatCount="indefinite" />
          </line>
        ))}

        {/* Fade and accent */}
        <rect x="0" y="0" width="1200" height="500" fill={`url(#${uid}-fade)`} />
        <rect x="0" y="0" width="1200" height="1" fill={`url(#${uid}-top)`} />
      </svg>
    </div>
  );
}
