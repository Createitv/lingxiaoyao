import { ArticleForm } from "@/components/admin/article-form";

export default function NewArticlePage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">新建文章</h1>
      <ArticleForm />
    </div>
  );
}
