import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAllDocs } from "@/lib/content/docs";

export const metadata: Metadata = {
  title: "参考文档",
  description: "AI 工具参考文档，Prompt 写法、Claude API、常见场景。",
};

export default async function DocsPage() {
  const docs = await getAllDocs();

  if (docs.length > 0) {
    redirect(`/docs/${docs[0].slug.join("/")}`);
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold">参考文档</h1>
      <p className="text-muted-foreground mt-2">暂无文档内容。</p>
    </div>
  );
}
