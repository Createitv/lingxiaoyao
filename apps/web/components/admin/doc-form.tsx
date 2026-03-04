"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";

interface DocData {
  id?: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  sortOrder: number;
  publishedAt: string | null;
}

export function DocForm({ initial }: { initial?: DocData }) {
  const router = useRouter();
  const isEditing = !!initial?.id;

  const [form, setForm] = useState<DocData>({
    slug: initial?.slug ?? "",
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    content: initial?.content ?? "",
    category: initial?.category ?? "",
    sortOrder: initial?.sortOrder ?? 0,
    publishedAt: initial?.publishedAt ?? null,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(publish: boolean) {
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      category: form.category || form.slug.split("/")[0] || form.slug,
      publishedAt: publish ? new Date().toISOString() : form.publishedAt,
    };

    try {
      const url = isEditing
        ? `/api/admin/docs/${initial!.id}`
        : "/api/admin/docs";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? "保存失败");
        return;
      }

      router.push("/admin/docs");
      router.refresh();
    } catch {
      setError("网络错误");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("确定删除这篇文档吗？此操作不可撤销。")) return;
    setSaving(true);

    try {
      await fetch(`/api/admin/docs/${initial!.id}`, { method: "DELETE" });
      router.push("/admin/docs");
      router.refresh();
    } catch {
      setError("删除失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium">标题</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="文档标题"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Slug（路径）
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono"
              placeholder="category/doc-name"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              格式：分类/文档名，如 claude-api/getting-started
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">描述</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              rows={2}
              placeholder="文档描述..."
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              内容（Markdown）
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono"
              rows={20}
              placeholder="# 文档标题&#10;&#10;正文内容..."
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-4 space-y-4">
            <h3 className="font-medium">设置</h3>

            <div>
              <label className="mb-1.5 block text-sm font-medium">分类</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="自动从 slug 提取"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                排序序号
              </label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <h3 className="font-medium">操作</h3>

            {form.publishedAt ? (
              <div className="text-sm text-muted-foreground">
                已发布于{" "}
                {new Date(form.publishedAt).toLocaleDateString("zh-CN")}
              </div>
            ) : (
              <div className="text-sm text-yellow-600 dark:text-yellow-400">
                草稿状态
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Button onClick={() => handleSave(false)} disabled={saving}>
                {saving ? "保存中..." : "保存草稿"}
              </Button>
              {!form.publishedAt && (
                <Button
                  variant="outline"
                  onClick={() => handleSave(true)}
                  disabled={saving}
                >
                  发布
                </Button>
              )}
              {isEditing && (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={saving}
                >
                  删除
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
