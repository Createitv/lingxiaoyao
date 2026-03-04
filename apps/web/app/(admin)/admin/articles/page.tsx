import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Button } from "@workspace/ui/components/button";

export default async function AdminArticlesPage(): Promise<React.JSX.Element> {
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      tags: true,
      isFree: true,
      publishedAt: true,
      updatedAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">文章管理</h1>
        <Button asChild>
          <Link href="/admin/articles/new">新建文章</Link>
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        {articles.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            暂无文章，点击上方按钮创建第一篇文章
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="px-6 py-3 font-medium">标题</th>
                <th className="px-6 py-3 font-medium">标签</th>
                <th className="px-6 py-3 font-medium">状态</th>
                <th className="px-6 py-3 font-medium">更新时间</th>
                <th className="px-6 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-accent/50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{article.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        /{article.slug}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        article.publishedAt
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {article.publishedAt ? "已发布" : "草稿"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {article.updatedAt.toLocaleDateString("zh-CN")}
                  </td>
                  <td className="px-6 py-4">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/articles/${article.id}/edit`}>
                        编辑
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
