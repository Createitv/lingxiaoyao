"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export interface ArticleNavItem {
  slug: string;
  title: string;
}

export interface ArticleSeriesGroup {
  name: string;
  articles: ArticleNavItem[];
}

interface ArticlesSidebarProps {
  series: ArticleSeriesGroup[];
}

export function ArticlesSidebar({ series }: ArticlesSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSeries = searchParams.get("series");

  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, activeSeries]);

  const toggleCollapse = (name: string) => {
    setCollapsed((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Filter series and articles by search query
  const filteredSeries = useMemo(() => {
    if (!search.trim()) return series;
    const q = search.toLowerCase();
    return series
      .map((s) => ({
        ...s,
        articles: s.articles.filter((a) =>
          a.title.toLowerCase().includes(q)
        ),
      }))
      .filter((s) => s.articles.length > 0);
  }, [series, search]);

  const navContent = (
    <>
      {/* Search */}
      <div className="p-3 border-b">
        <div className="relative">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="搜索文章..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border bg-transparent py-1.5 pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        <Link
          href="/articles"
          className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
            pathname === "/articles" && !activeSeries
              ? "bg-accent text-accent-foreground font-medium"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          全部文章
        </Link>

        {filteredSeries.map((group) => {
          const isCollapsed = collapsed[group.name] ?? false;
          const isActiveSeries = activeSeries === group.name;

          return (
            <div key={group.name}>
              {/* Series header */}
              <button
                onClick={() => toggleCollapse(group.name)}
                className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${
                  isActiveSeries
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <span className="truncate text-left">{group.name}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`shrink-0 transition-transform ${
                    isCollapsed ? "-rotate-90" : ""
                  }`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {/* Article links */}
              {!isCollapsed && (
                <ul className="mt-0.5 ml-2 border-l pl-2 space-y-0.5">
                  {group.articles.map((article) => {
                    const href = `/articles/${article.slug}`;
                    const isActive = pathname === href;
                    return (
                      <li key={article.slug}>
                        <Link
                          href={href}
                          className={`block rounded-md px-2 py-1 text-xs transition-colors ${
                            isActive
                              ? "bg-accent text-accent-foreground font-medium"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          {article.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}

        {filteredSeries.length === 0 && search.trim() && (
          <p className="px-2 py-3 text-xs text-muted-foreground">
            未找到匹配的文章
          </p>
        )}

        {/* Secondary navigation — hidden when searching, uses CSS to avoid hydration mismatch */}
        <div className={search.trim() ? "hidden" : ""}>
          <div className="my-3 border-t" />
          <span className="block px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
            学习计划
          </span>
          <Link
            href="/articles/study-plan"
            className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
              pathname === "/articles/study-plan"
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M3 10h18" />
              <path d="m9 16 2 2 4-4" />
            </svg>
            30天学习计划
          </Link>
        </div>
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed top-14 left-0 bottom-0 w-60 border-r bg-background overflow-y-auto z-30">
        {navContent}
      </aside>

      {/* Mobile toggle button */}
      <button
        className="fixed bottom-4 left-4 z-30 lg:hidden rounded-full bg-primary text-primary-foreground p-3 shadow-lg"
        onClick={() => setMobileOpen(true)}
        aria-label="打开文章导航"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed left-0 top-14 bottom-0 w-72 overflow-y-auto bg-background shadow-xl animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
