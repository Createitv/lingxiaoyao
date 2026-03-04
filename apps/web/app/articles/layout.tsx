import { Suspense } from "react";
import { getAllArticles } from "@/lib/content/articles";
import {
  ArticlesSidebar,
  type ArticleSeriesGroup,
} from "@/components/articles/articles-sidebar";

export default async function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const articles = await getAllArticles();

  // Group articles by series, ordered by sortOrder
  const seriesMap = new Map<string, ArticleSeriesGroup>();
  // Sort by sortOrder for consistent ordering
  const sorted = [...articles].sort((a, b) => a.sortOrder - b.sortOrder);

  for (const a of sorted) {
    if (!a.series) continue;
    if (!seriesMap.has(a.series)) {
      seriesMap.set(a.series, { name: a.series, articles: [] });
    }
    seriesMap.get(a.series)!.articles.push({
      slug: a.slug,
      title: a.title,
    });
  }

  const series = Array.from(seriesMap.values());

  return (
    <div className="relative">
      <Suspense>
        <ArticlesSidebar series={series} />
      </Suspense>
      <div className="lg:pl-60">{children}</div>
    </div>
  );
}
