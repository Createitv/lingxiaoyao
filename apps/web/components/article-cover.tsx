/**
 * Programmatic article cover image using SVG.
 * Generates a consistent dark-themed cover based on article metadata.
 * No upload needed — renders server-side as part of the article list page.
 */

const SERIES_THEMES: Record<string, { color1: string; color2: string; emoji: string }> = {
  "Claude 入门": { color1: "#10b981", color2: "#00d4ff", emoji: "🚀" },
  "Claude API 开发": { color1: "#00d4ff", color2: "#0080ff", emoji: "⚡" },
  "Claude 高级开发": { color1: "#7c3aed", color2: "#a855f7", emoji: "🧠" },
};

const DEFAULT_THEME = { color1: "#00d4ff", color2: "#7c3aed", emoji: "📝" };

interface ArticleCoverProps {
  title: string;
  series?: string;
  sortOrder: number;
}

export function ArticleCover({ title, series, sortOrder }: ArticleCoverProps) {
  const theme = series ? (SERIES_THEMES[series] ?? DEFAULT_THEME) : DEFAULT_THEME;
  const orderLabel = String(sortOrder).padStart(2, "0");

  // Generate deterministic "random" positions from title hash
  const hash = title.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const p1 = ((hash * 7) % 60) + 10;
  const p2 = ((hash * 13) % 50) + 20;
  const p3 = ((hash * 23) % 40) + 30;

  return (
    <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#080c14] rounded-t-lg">
      {/* Grid overlay */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id={`grid-${hash}`} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke={theme.color1} strokeWidth="0.3" opacity="0.08" />
          </pattern>
          <radialGradient id={`glow1-${hash}`} cx={`${p1}%`} cy="40%" r="50%">
            <stop offset="0%" stopColor={theme.color1} stopOpacity="0.12" />
            <stop offset="100%" stopColor={theme.color1} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`glow2-${hash}`} cx={`${100 - p1}%`} cy="60%" r="50%">
            <stop offset="0%" stopColor={theme.color2} stopOpacity="0.1" />
            <stop offset="100%" stopColor={theme.color2} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${hash})`} />
        <rect width="100%" height="100%" fill={`url(#glow1-${hash})`} />
        <rect width="100%" height="100%" fill={`url(#glow2-${hash})`} />
        {/* Floating dots */}
        <circle cx={`${p1}%`} cy={`${p2}%`} r="3" fill={theme.color1} opacity="0.15" />
        <circle cx={`${p3 + 40}%`} cy={`${p1}%`} r="2" fill={theme.color2} opacity="0.12" />
        <circle cx={`${p2 + 30}%`} cy={`${p3 + 30}%`} r="4" fill={theme.color1} opacity="0.08" />
        {/* Subtle lines */}
        <line x1="0" y1={`${p2 + 20}%`} x2="100%" y2={`${p3 + 30}%`} stroke={theme.color1} strokeWidth="0.5" opacity="0.06" />
        <line x1={`${p1}%`} y1="0" x2={`${p3 + 20}%`} y2="100%" stroke={theme.color2} strokeWidth="0.5" opacity="0.05" />
      </svg>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-4">
        {series && (
          <span
            className="text-[10px] font-mono tracking-wider mb-1.5 opacity-80"
            style={{ color: theme.color1 }}
          >
            {series.toUpperCase()} · {orderLabel}
          </span>
        )}
        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
          {title}
        </h3>
      </div>

      {/* Bottom gradient for text readability */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2/3 pointer-events-none"
        style={{
          background: "linear-gradient(to top, #080c14 0%, #080c14cc 30%, transparent 100%)",
        }}
      />
    </div>
  );
}
