import { ArticleForm } from "@/components/admin/article-form";

export default function NewSeriesArticlePage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">新建系列文章</h1>
      <ArticleForm />
    </div>
  );
}
