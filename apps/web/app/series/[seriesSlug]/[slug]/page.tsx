import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import {
  getSeriesArticleBySlug,
  getSeriesArticles,
} from "@/lib/content/articles";
import {
  getSeriesConfigBySlug,
  SERIES_CONFIG,
} from "@/lib/content/series-config";
import { mdxComponents } from "@/components/mdx";
import { MdxRenderer } from "@/components/mdx/mdx-renderer";
import { WechatFollowCard } from "@workspace/ui/components/wechat-follow-card";
import { ProgressButton } from "@workspace/ui/components/progress-button";
import { CommentSectionWrapper } from "@/components/comment-section-wrapper";
import { extractTocHeadings } from "@/lib/toc-utils";
import { Toc } from "@/components/toc";
import { CopyMarkdownButton } from "@/components/articles/copy-markdown-button";

interface SeriesArticlePageProps {
  params: Promise<{ seriesSlug: string; slug: string }>;
}

export async function generateStaticParams() {
  try {
    const allParams: { seriesSlug: string; slug: string }[] = [];
    for (const config of SERIES_CONFIG) {
      const articles = await getSeriesArticles(config.name);
      for (const article of articles) {
        allParams.push({ seriesSlug: config.slug, slug: article.slug });
      }
    }
    return allParams;
  } catch {
    return [];
  }
}
export async function generateMetadata({
  params,
}: SeriesArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getSeriesArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      publishedTime: article.date,
      tags: article.tags,
      images: article.coverUrl ? [article.coverUrl] : undefined,
    },
  };
}

export default async function SeriesArticlePage({
  params,
}: SeriesArticlePageProps) {
  const { seriesSlug, slug } = await params;
  const config = getSeriesConfigBySlug(seriesSlug);
  if (!config) notFound();

  const article = await getSeriesArticleBySlug(slug);
  if (!article || article.series !== config.name) notFound();

  const mdxOptions = {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeHighlight, rehypeSlug],
    },
  };

  const headings = extractTocHeadings(article.content);
  const BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://lingxiaoyao.cn";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    datePublished: article.date,
    url: `${BASE_URL}/series/${seriesSlug}/${slug}`,
    image: article.coverUrl,
    author: {
      "@type": "Person",
      name: "林逍遥",
    },
    publisher: {
      "@type": "Organization",
      name: "林逍遥 AI",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
  };

  const formattedDate = new Date(article.date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex">
        <div className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <div className="px-6 lg:px-10 pt-6">
            <Link
              href={`/series/${seriesSlug}`}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
              {config.name}
            </Link>
          </div>

          {/* Hero header */}
          <header className="py-12 md:py-16">
            <div className="px-6 lg:px-10 max-w-3xl">
              {/* Series badge */}
              {article.series && (
                <div className="hero-badge">
                  {article.series.toUpperCase()}
                  {article.sortOrder > 0 && (
                    <>
                      <span className="opacity-30">·</span>
                      Day {String(article.sortOrder).padStart(2, "0")}
                    </>
                  )}
                </div>
              )}

              {/* Title */}
              <h1 className="hero-title text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                {article.title}
              </h1>

              {/* Summary */}
              <p className="mt-4 text-muted-foreground text-base md:text-lg">
                {article.summary}
              </p>

              {/* Meta info */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-mono text-muted-foreground">
                <time dateTime={article.date}>{formattedDate}</time>
                <span className="opacity-30">·</span>
                <span>约 {article.readingTime} 分钟阅读</span>
                {article.tags.length > 0 && (
                  <>
                    <span className="opacity-30">·</span>
                    <div className="flex gap-2">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
                <span className="opacity-30">·</span>
                <CopyMarkdownButton content={article.content} />
              </div>
            </div>
          </header>

          {/* Content */}
          <article className="px-6 lg:px-10 max-w-3xl">
            <div className="prose dark:prose-invert max-w-none">
              <MdxRenderer
                source={article.content}
                options={mdxOptions}
                components={mdxComponents}
              />
            </div>
          </article>

          {/* Navigation between series articles */}
          <SeriesNav
            seriesSlug={seriesSlug}
            seriesName={config.name}
            currentSlug={slug}
          />

          {/* Footer */}
          <footer className="px-6 lg:px-10 max-w-3xl mt-12 space-y-6 border-t pt-8">
            <ProgressButton
              contentType="article"
              contentSlug={slug}
              isCompleted={false}
            />
            <WechatFollowCard />
            <CommentSectionWrapper
              contentType="article"
              contentSlug={slug}
            />
          </footer>
        </div>

        {/* Right TOC */}
        <Toc headings={headings} />
      </div>
    </>
  );
}

async function SeriesNav({
  seriesSlug,
  seriesName,
  currentSlug,
}: {
  seriesSlug: string;
  seriesName: string;
  currentSlug: string;
}) {
  const articles = await getSeriesArticles(seriesName);
  const currentIndex = articles.findIndex((a) => a.slug === currentSlug);
  const prev = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const next =
    currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  if (!prev && !next) return null;

  return (
    <div className="px-6 lg:px-10 max-w-3xl mt-10">
      <div className="flex gap-4">
        {prev ? (
          <Link
            href={`/series/${seriesSlug}/${prev.slug}`}
            className="flex-1 group rounded-lg border p-4 hover:border-primary/30 transition-colors"
          >
            <span className="text-xs text-muted-foreground">上一篇</span>
            <p className="mt-1 text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">
              {prev.title}
            </p>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {next ? (
          <Link
            href={`/series/${seriesSlug}/${next.slug}`}
            className="flex-1 group rounded-lg border p-4 hover:border-primary/30 transition-colors text-right"
          >
            <span className="text-xs text-muted-foreground">下一篇</span>
            <p className="mt-1 text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">
              {next.title}
            </p>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}
