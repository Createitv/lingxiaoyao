import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Button } from "@workspace/ui/components/button";

export default async function AdminCoursesPage(): Promise<React.JSX.Element> {
  const courses = await prisma.course.findMany({
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { chapters: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">课程管理</h1>
        <Button asChild>
          <Link href="/admin/courses/new">新建课程</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {courses.length === 0 ? (
          <div className="col-span-2 rounded-lg border bg-card p-12 text-center text-muted-foreground">
            暂无课程
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="rounded-lg border bg-card p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{course.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    /{course.slug}
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    course.publishedAt
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {course.publishedAt ? "已发布" : "草稿"}
                </span>
              </div>

              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>&yen;{(course.price / 100).toFixed(0)}</span>
                <span>{course._count.chapters} 章节</span>
              </div>

              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/courses/${course.id}/edit`}>编辑</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/courses/${course.id}/chapters`}>
                    管理章节
                  </Link>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
