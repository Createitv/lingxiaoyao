import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/content/articles";
import { ArticleCover } from "@/components/article-cover";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "教程文章",
  description: "免费 AI 教程、Claude 使用技巧，持续更新。",
};

interface ArticlesPageProps {
  searchParams: Promise<{ series?: string }>;
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const { series } = await searchParams;
  const [articles, user] = await Promise.all([
    getAllArticles(),
    getCurrentUser(),
  ]);
  const isAdmin = user?.role === "admin";

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
            <div
              key={article.slug}
              className="group relative rounded-lg border border-white/5 overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <Link
                href={`/articles/${article.slug}`}
                className="block"
              >
                {/* Cover image on top */}
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
                </div>

                {/* Card content below the image */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    {article.series && (
                      <span className="text-xs font-medium text-cyan-400/90">
                        {article.series}
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

              {/* Admin edit button */}
              {isAdmin && (
                <Link
                  href={`/admin/articles/${article.id}/edit`}
                  className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 rounded-md bg-background/80 backdrop-blur-sm px-2 py-1 text-xs text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                  编辑
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
