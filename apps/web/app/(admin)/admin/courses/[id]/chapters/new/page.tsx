import { ChapterForm } from "@/components/admin/chapter-form";

export default async function NewChapterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.JSX.Element> {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">新增章节</h1>
      <ChapterForm courseId={id} />
    </div>
  );
}
