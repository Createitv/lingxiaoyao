import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { getLatestArticles } from "@/lib/content/articles";
import { getCourses } from "@/lib/content/courses";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lingxiaoyao.cn";

export default async function HomePage() {
  const latestArticles = await getLatestArticles(3);
  const courses = await getCourses();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "林逍遥 AI",
      url: BASE_URL,
      description:
        "学习 AI 工具、Claude 使用技巧，提升日常工作效率。免费教程 + 系统视频课程。",
      potentialAction: {
        "@type": "SearchAction",
        target: `${BASE_URL}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "林逍遥 AI",
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
      description:
        "AI 课程教育平台，提供 Claude 教程、AI 使用技巧和系统视频课程。",
    },
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Warm gradient background */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, hsl(18 60% 55% / 0.08), transparent), radial-gradient(ellipse 60% 50% at 80% 50%, hsl(35 40% 70% / 0.06), transparent)",
          }}
        />
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(30 10% 12%) 1px, transparent 1px), linear-gradient(90deg, hsl(30 10% 12%) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="container mx-auto px-6 pb-24 pt-20 sm:pb-32 sm:pt-28 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium tracking-widest uppercase text-primary/80 mb-6">
              AI Learning Platform
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-[1.15]">
              <span className="block">AI 不只是工具，</span>
              <span className="block mt-1 text-primary">
                更是一种思维方式
              </span>
            </h1>
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground max-w-xl mx-auto">
              从零开始系统学习 Claude，掌握 AI 时代的核心技能。
              视频课程与图文教程结合，让每个人都能把 AI 用到工作中。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8 h-12 text-base rounded-full">
                <Link href="/courses">开始学习</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 h-12 text-base rounded-full"
              >
                <Link href="/articles">浏览免费教程</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Divider line */}
        <div className="container mx-auto px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      </section>

      {/* ── What You'll Learn ── */}
      <section className="container mx-auto px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            在这里，你可以
          </h2>
        </div>

        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="group relative rounded-2xl border bg-card p-8 transition-shadow hover:shadow-lg">
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">系统视频课程</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              从 Claude 入门到进阶，6大模块循序渐进。每节课配套实战练习，学完即用。
            </p>
          </div>

          {/* Card 2 */}
          <div className="group relative rounded-2xl border bg-card p-8 transition-shadow hover:shadow-lg">
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">免费图文教程</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              持续更新的 AI 使用技巧和 Prompt 工程指南，全部免费阅读。
            </p>
          </div>

          {/* Card 3 */}
          <div className="group relative rounded-2xl border bg-card p-8 transition-shadow hover:shadow-lg">
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                <rect width="20" height="14" x="2" y="6" rx="2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">实战模板库</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              职场写作、数据分析、文档阅读等场景的 Prompt 模板，复制即用。
            </p>
          </div>
        </div>
      </section>

      {/* ── Courses ── */}
      {courses.length > 0 && (
        <section className="border-y bg-secondary/30">
          <div className="container mx-auto px-6 py-24 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-sm font-medium tracking-widest uppercase text-primary/70 mb-2">
                  Courses
                </p>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  精选课程
                </h2>
              </div>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href="/courses">
                  查看全部
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link
                  key={course.slug}
                  href={`/courses/${course.slug}`}
                  className="group block rounded-2xl border bg-card overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  {course.coverUrl ? (
                    <div className="aspect-[16/9] bg-muted overflow-hidden relative">
                      <img
                        src={course.coverUrl}
                        alt={course.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 flex items-center justify-center">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-primary/30"
                      >
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold text-lg leading-snug group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between pt-4 border-t">
                      <span className="text-xs text-muted-foreground tracking-wide">
                        {course.totalChapters} 节课 /{" "}
                        {course.chapters.reduce(
                          (acc, ch) => acc + ch.duration,
                          0,
                        )}{" "}
                        分钟
                      </span>
                      <span className="font-semibold text-primary">
                        {course.price === 0
                          ? "免费"
                          : `\u00A5${(course.price / 100).toFixed(0)}`}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center sm:hidden">
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/courses">查看全部课程</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ── Latest Articles ─��� */}
      {latestArticles.length > 0 && (
        <section className="container mx-auto px-6 py-24 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm font-medium tracking-widest uppercase text-primary/70 mb-2">
                Articles
              </p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                最新教程
              </h2>
            </div>
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/articles">
                查看全部
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </Button>
          </div>

          <div className="mx-auto max-w-3xl divide-y">
            {latestArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group flex items-start gap-6 py-7 first:pt-0 last:pb-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {article.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-full bg-primary/8 text-primary/80 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-semibold text-lg leading-snug group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
                <div className="flex-shrink-0 pt-1 text-right">
                  <time className="text-xs text-muted-foreground tabular-nums">
                    {new Date(article.date).toLocaleDateString("zh-CN", {
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {article.readingTime} min
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/articles">查看全部教程</Link>
            </Button>
          </div>
        </section>
      )}

      {/* ── Bottom CTA ── */}
      <section className="border-t">
        <div className="container mx-auto px-6 py-24 lg:px-8">
          <div
            className="relative mx-auto max-w-3xl rounded-3xl overflow-hidden p-10 sm:p-16 text-center"
            style={{
              background:
                "linear-gradient(135deg, hsl(18 60% 55% / 0.06), hsl(35 40% 70% / 0.08))",
            }}
          >
            {/* Subtle decorative circle */}
            <div
              className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-64 w-64 rounded-full opacity-[0.04]"
              style={{
                background:
                  "radial-gradient(circle, hsl(18 60% 55%), transparent 70%)",
              }}
            />
            <h2 className="relative text-2xl font-bold tracking-tight sm:text-3xl">
              准备好开始你的 AI 学习之旅了吗？
            </h2>
            <p className="relative mt-4 text-muted-foreground max-w-lg mx-auto leading-relaxed">
              无论你是刚接触 AI 的新手，还是想要深入掌握 Claude
              的进阶用户，这里都有适合你的学习路径。
            </p>
            <div className="relative mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8 h-12 text-base rounded-full">
                <Link href="/courses">浏览课程</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 h-12 text-base rounded-full"
              >
                <Link href="/about">了解更多</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
