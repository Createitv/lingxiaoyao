import { DocForm } from "@/components/admin/doc-form";

export default function NewDocPage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">新建文档</h1>
      <DocForm />
    </div>
  );
}
