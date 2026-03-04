import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/content/articles";

export const metadata: Metadata = {
  title: "教程文章",
  description: "免费 AI 教程、Claude 使用技巧，持续更新。",
};

// Distinct color palette for series category cards
const seriesColors = [
  { bg: "bg-blue-50 dark:bg-blue-950/40", border: "border-blue-200 dark:border-blue-800", text: "text-blue-700 dark:text-blue-300", icon: "text-blue-500" },
  { bg: "bg-amber-50 dark:bg-amber-950/40", border: "border-amber-200 dark:border-amber-800", text: "text-amber-700 dark:text-amber-300", icon: "text-amber-500" },
  { bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-200 dark:border-emerald-800", text: "text-emerald-700 dark:text-emerald-300", icon: "text-emerald-500" },
  { bg: "bg-violet-50 dark:bg-violet-950/40", border: "border-violet-200 dark:border-violet-800", text: "text-violet-700 dark:text-violet-300", icon: "text-violet-500" },
  { bg: "bg-rose-50 dark:bg-rose-950/40", border: "border-rose-200 dark:border-rose-800", text: "text-rose-700 dark:text-rose-300", icon: "text-rose-500" },
  { bg: "bg-cyan-50 dark:bg-cyan-950/40", border: "border-cyan-200 dark:border-cyan-800", text: "text-cyan-700 dark:text-cyan-300", icon: "text-cyan-500" },
];

interface ArticlesPageProps {
  searchParams: Promise<{ series?: string }>;
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const { series } = await searchParams;
  const articles = await getAllArticles();

  // Build ordered series list (by earliest sortOrder in each series)
  const seriesMap = new Map<string, number>();
  for (const a of articles) {
    if (a.series && !seriesMap.has(a.series)) {
      seriesMap.set(a.series, a.sortOrder);
    }
  }
  const allSeries = Array.from(seriesMap.entries())
    .sort((a, b) => a[1] - b[1])
    .map(([name]) => name);

  // Filter articles
  const filtered = series
    ? articles.filter((a) => a.series === series)
    : articles;

  // Sort filtered articles by sortOrder for series view
  const displayed = series
    ? [...filtered].sort((a, b) => a.sortOrder - b.sortOrder)
    : filtered;

  return (
    <div className="px-6 py-8 lg:px-10">
      <h1 className="text-2xl font-bold mb-2">
        {series ?? "教程文章"}
      </h1>
      <p className="text-muted-foreground mb-8">
        系统学习 AI 工具使用技巧，所有文章免费阅读。
      </p>

      {/* Series category cards — only show when viewing all articles */}
      {!series && allSeries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
          {allSeries.map((s, i) => {
            const color = seriesColors[i % seriesColors.length];
            const count = articles.filter((a) => a.series === s).length;
            return (
              <Link
                key={s}
                href={`/articles?series=${encodeURIComponent(s)}`}
                className={`group relative rounded-xl border p-5 transition-all hover:shadow-md ${color.bg} ${color.border}`}
              >
                <div className={`mb-3 ${color.icon}`}>
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    <path d="M8 7h6" />
                    <path d="M8 11h8" />
                  </svg>
                </div>
                <h3 className={`font-semibold ${color.text}`}>{s}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {count} 篇文章
                </p>
              </Link>
            );
          })}
        </div>
      )}

      {/* Back to all link when filtering */}
      {series && (
        <Link
          href="/articles"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          返回全部文章
        </Link>
      )}

      {/* Article cards */}
      {displayed.length === 0 ? (
        <p className="text-muted-foreground">暂无文章。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayed.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group block rounded-lg border bg-card p-5 transition-colors hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                {article.series && (
                  <span className="text-xs font-medium text-primary">
                    {article.series}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  约 {article.readingTime} 分钟
                </span>
              </div>
              <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {article.summary}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {article.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
