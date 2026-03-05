import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/content/articles";
import { ArticleCover } from "@/components/article-cover";

export const metadata: Metadata = {
  title: "教程文章",
  description: "免费 AI 教程、Claude 使用技巧，持续更新。",
};

interface ArticlesPageProps {
  searchParams: Promise<{ series?: string }>;
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const { series } = await searchParams;
  const articles = await getAllArticles();

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group block rounded-lg border bg-card overflow-hidden transition-all hover:border-primary/40 hover:shadow-md"
            >
              {/* Cover image */}
              {article.coverUrl ? (
                <img
                  src={article.coverUrl}
                  alt={article.title}
                  className="w-full aspect-[16/9] object-cover"
                  loading="lazy"
                />
              ) : (
                <ArticleCover
                  title={article.title}
                  series={article.series}
                  sortOrder={article.sortOrder}
                />
              )}
              {/* Card body */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1.5">
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
                <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
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
