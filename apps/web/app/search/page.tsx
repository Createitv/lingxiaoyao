import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "搜索",
  description: "搜索文章、课程、文档等内容",
};

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4">搜索</h1>
      <p className="text-muted-foreground mb-8">
        使用快捷键{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">&#8984;</span>K
        </kbd>{" "}
        随时打开搜索面板，查找文章、课程和文档。
      </p>
    </div>
  );
}
