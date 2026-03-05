import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeriesArticles } from "@/lib/content/articles";
import {
  getSeriesConfigBySlug,
  SERIES_CONFIG,
} from "@/lib/content/series-config";
import { ArticleCover } from "@/components/article-cover";

interface SeriesPageProps {
  params: Promise<{ seriesSlug: string }>;
}

export function generateStaticParams() {
  return SERIES_CONFIG.map((s) => ({ seriesSlug: s.slug }));
}

export async function generateMetadata({
  params,
}: SeriesPageProps): Promise<Metadata> {
  const { seriesSlug } = await params;
  const config = getSeriesConfigBySlug(seriesSlug);
  if (!config) return {};

  return {
    title: config.name,
    description: config.description,
  };
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { seriesSlug } = await params;
  const config = getSeriesConfigBySlug(seriesSlug);
  if (!config) notFound();

  const articles = await getSeriesArticles(config.name);

  return (
    <div className="py-8 lg:py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M3 10h18" />
            </svg>
            {articles.length} 篇文章
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {config.name}
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          {config.description}
        </p>
      </div>

      {/* Article cards */}
      {articles.length === 0 ? (
        <p className="text-muted-foreground">暂无文章。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/series/${seriesSlug}/${article.slug}`}
              className="group block rounded-lg border border-white/5 overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Cover */}
              <div className="relative aspect-[16/9]">
                {article.coverUrl ? (
                  <img
                    src={article.coverUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    aria-hidden="true"
                  />
                ) : (
                  <ArticleCover
                    title={article.title}
                    series={article.series}
                  />
                )}
                {/* Day badge */}
                {article.sortOrder > 0 && (
                  <div className="absolute top-3 left-3 flex items-center justify-center w-8 h-8 rounded-lg bg-black/60 text-white text-xs font-bold backdrop-blur-sm">
                    {String(article.sortOrder).padStart(2, "0")}
                  </div>
                )}
              </div>

              {/* Card content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  {article.sortOrder > 0 && (
                    <span className="text-xs font-mono text-muted-foreground">
                      Day {String(article.sortOrder).padStart(2, "0")}
                    </span>
                  )}
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {article.readingTime} min
                  </span>
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 text-[15px] leading-snug">
                  {article.title}
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {article.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
