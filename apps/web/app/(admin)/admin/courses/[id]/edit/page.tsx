import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { CourseForm } from "@/components/admin/course-form";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.JSX.Element> {
  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">编辑课程</h1>
      <CourseForm
        initial={{
          id: course.id,
          slug: course.slug,
          title: course.title,
          description: course.description,
          content: course.content ?? "",
          price: course.price,
          coverUrl: course.coverUrl ?? "",
          publishedAt: course.publishedAt?.toISOString() ?? null,
        }}
      />
    </div>
  );
}
