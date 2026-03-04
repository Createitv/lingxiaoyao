import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Button } from "@workspace/ui/components/button";

export default async function AdminDocsPage(): Promise<React.JSX.Element> {
  const docs = await prisma.doc.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      sortOrder: true,
      publishedAt: true,
      updatedAt: true,
    },
  });

  // Group by category
  const grouped = docs.reduce(
    (acc, doc) => {
      const cat = doc.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(doc);
      return acc;
    },
    {} as Record<string, typeof docs>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">文档管理</h1>
        <Button asChild>
          <Link href="/admin/docs/new">新建文档</Link>
        </Button>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center text-muted-foreground">
          暂无文档
        </div>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {category}
            </h2>
            <div className="rounded-lg border bg-card divide-y">
              {items.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/admin/docs/${doc.id}/edit`}
                  className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-accent"
                >
                  <div>
                    <p className="font-medium">{doc.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      /{doc.slug}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      doc.publishedAt
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {doc.publishedAt ? "已发布" : "草稿"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
