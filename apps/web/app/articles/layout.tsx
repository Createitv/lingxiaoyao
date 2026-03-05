import { Suspense } from "react";
import { getAllArticles } from "@/lib/content/articles";
import {
  ArticlesSidebar,
  type ArticleSeriesGroup,
} from "@/components/articles/articles-sidebar";

// Difficulty ordering: easy → hard (series not listed here are hidden)
const SERIES_ORDER = ["Claude 入门", "30天学Claude", "Claude API 开发", "Claude 高级开发"];

export default async function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const articles = await getAllArticles();

  // Group articles by series, ordered by sortOrder within each series
  const seriesMap = new Map<string, ArticleSeriesGroup>();
  const sorted = [...articles].sort((a, b) => a.sortOrder - b.sortOrder);

  for (const a of sorted) {
    if (!a.series) continue;
    if (!SERIES_ORDER.includes(a.series)) continue; // skip hidden series
    if (!seriesMap.has(a.series)) {
      seriesMap.set(a.series, { name: a.series, articles: [] });
    }
    seriesMap.get(a.series)!.articles.push({
      slug: a.slug,
      title: a.title,
    });
  }

  // Order series by difficulty (SERIES_ORDER)
  const series = SERIES_ORDER
    .filter((name) => seriesMap.has(name))
    .map((name) => seriesMap.get(name)!);

  return (
    <div className="relative">
      <Suspense>
        <ArticlesSidebar series={series} />
      </Suspense>
      <div className="lg:pl-60">{children}</div>
    </div>
  );
}
