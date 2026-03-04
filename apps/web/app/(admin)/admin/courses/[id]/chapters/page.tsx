import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Button } from "@workspace/ui/components/button";

export default async function AdminChaptersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.JSX.Element> {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: { chapters: { orderBy: { index: "asc" } } },
  });

  if (!course) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            章节管理
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {course.title}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/admin/courses/${id}/edit`}>返回课程</Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/courses/${id}/chapters/new`}>
              新增章节
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        {course.chapters.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            暂无章节
          </div>
        ) : (
          <div className="divide-y">
            {course.chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/admin/courses/${id}/chapters/${chapter.id}/edit`}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-accent"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-medium">
                    {chapter.index}
                  </span>
                  <div>
                    <p className="font-medium">{chapter.title}</p>
                    <div className="mt-0.5 flex gap-3 text-xs text-muted-foreground">
                      <span>{chapter.duration} 分钟</span>
                      {chapter.videoId && chapter.videoId !== "replace-with-tencent-vod-file-id" && (
                        <span>有视频</span>
                      )}
                    </div>
                  </div>
                </div>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    chapter.isFree
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {chapter.isFree ? "免费" : "付费"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
