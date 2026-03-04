"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface DocNavItem {
  slug: string[];
  title: string;
}

export interface DocCategory {
  name: string;
  docs: DocNavItem[];
}

interface DocsSidebarProps {
  categories: DocCategory[];
}

export function DocsSidebar({ categories }: DocsSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navContent = (
    <nav className="p-4 space-y-6">
      {categories.map((category) => (
        <div key={category.name}>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-2">
            {category.name}
          </h3>
          <ul className="space-y-0.5">
            {category.docs.map((doc) => {
              const href = `/docs/${doc.slug.join("/")}`;
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {doc.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
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
        aria-label="打开文档导航"
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
