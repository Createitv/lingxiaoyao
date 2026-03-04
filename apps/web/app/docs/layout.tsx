import { getAllDocs } from "@/lib/content/docs";
import { DocsSidebar, type DocCategory } from "@/components/docs/docs-sidebar";

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const docs = await getAllDocs();

  // Group docs by category (first slug segment)
  const categoryMap: Record<string, DocCategory> = {};
  for (const doc of docs) {
    const categoryName = doc.slug[0] ?? "general";
    if (!categoryMap[categoryName]) {
      categoryMap[categoryName] = { name: categoryName, docs: [] };
    }
    categoryMap[categoryName].docs.push({
      slug: doc.slug,
      title: doc.title,
    });
  }
  const categories = Object.values(categoryMap);

  return (
    <div className="relative">
      <DocsSidebar categories={categories} />
      <div className="lg:pl-60">{children}</div>
    </div>
  );
}
