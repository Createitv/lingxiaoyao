import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { ChapterForm } from "@/components/admin/chapter-form";

export default async function EditChapterPage({
  params,
}: {
  params: Promise<{ id: string; chapterId: string }>;
}): Promise<React.JSX.Element> {
  const { id, chapterId } = await params;
  const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
  if (!chapter) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">编辑章节</h1>
      <ChapterForm
        courseId={id}
        initial={{
          id: chapter.id,
          courseId: id,
          index: chapter.index,
          title: chapter.title,
          content: chapter.content ?? "",
          videoId: chapter.videoId,
          isFree: chapter.isFree,
          duration: chapter.duration,
        }}
      />
    </div>
  );
}
