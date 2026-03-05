"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  // Default: all series collapsed except the first one ("Claude 入门")
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    series.forEach((s, i) => {
      initial[s.name] = i !== 0; // only the first series is expanded
    });
    return initial;
  });
  const [activeSeries, setActiveSeries] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Restore sidebar collapse state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("articles-sidebar-collapsed");
    if (saved === "true") setSidebarCollapsed(true);
  }, []);

  // Persist sidebar collapse state
  useEffect(() => {
    localStorage.setItem("articles-sidebar-collapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Read search params on client after mount to avoid hydration mismatch
  // (useSearchParams inside Suspense without fallback causes server/client divergence)
  useEffect(() => {
    setActiveSeries(new URLSearchParams(window.location.search).get("series"));
  }, [pathname]);

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
          className={`block rounded-md px-2 py-2 text-base transition-colors ${
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
                className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-base transition-colors ${
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
                          className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
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

        {filteredSeries.length === 0 && search.trim().length > 0 && (
          <p className="px-2 py-3 text-sm text-muted-foreground">
            未找到匹配的文章
          </p>
        )}

        {/* Study plan link removed — now part of right "系列" sidebar */}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:block shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto overflow-x-hidden border-r bg-background z-30 transition-[width] duration-300 ease-in-out ${
          sidebarCollapsed ? "w-0 border-r-0" : "w-60"
        }`}
      >
        <div className="w-60">{navContent}</div>
      </aside>

      {/* Desktop collapse toggle */}
      <button
        onClick={() => setSidebarCollapsed((prev) => !prev)}
        className="hidden lg:flex items-center justify-center shrink-0 sticky top-20 self-start z-40 -ml-3 h-6 w-6 rounded-full border bg-background shadow-sm hover:bg-accent transition-colors"
        aria-label={sidebarCollapsed ? "展开侧边栏" : "收起侧边栏"}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-300 ${
            sidebarCollapsed ? "" : "rotate-180"
          }`}
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

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
