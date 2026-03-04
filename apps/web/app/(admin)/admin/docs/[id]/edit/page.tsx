import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { DocForm } from "@/components/admin/doc-form";

export default async function EditDocPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.JSX.Element> {
  const { id } = await params;
  const doc = await prisma.doc.findUnique({ where: { id } });
  if (!doc) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">编辑文档</h1>
      <DocForm
        initial={{
          id: doc.id,
          slug: doc.slug,
          title: doc.title,
          description: doc.description ?? "",
          content: doc.content,
          category: doc.category,
          sortOrder: doc.sortOrder,
          publishedAt: doc.publishedAt?.toISOString() ?? null,
        }}
      />
    </div>
  );
}
