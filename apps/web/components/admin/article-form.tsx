"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { CoverImagePicker } from "./cover-image-picker";

interface ArticleData {
  id?: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  coverUrl: string;
  tags: string[];
  series: string;
  sortOrder: number;
  isFree: boolean;
  publishedAt: string | null;
}

function parseFrontmatter(raw: string): {
  meta: Record<string, string | string[]>;
  body: string;
} {
  const trimmed = raw.trimStart();
  if (!trimmed.startsWith("---")) {
    return { meta: {}, body: raw };
  }

  const end = trimmed.indexOf("\n---", 3);
  if (end === -1) {
    return { meta: {}, body: raw };
  }

  const yamlBlock = trimmed.slice(4, end);
  const body = trimmed.slice(end + 4).trimStart();
  const meta: Record<string, string | string[]> = {};

  let currentKey = "";
  let listValues: string[] = [];
  let inList = false;

  for (const line of yamlBlock.split("\n")) {
    const listMatch = line.match(/^\s+-\s+(.+)/);
    if (listMatch && inList) {
      listValues.push(listMatch[1].trim().replace(/^["']|["']$/g, ""));
      continue;
    }

    if (inList && currentKey) {
      meta[currentKey] = listValues;
      inList = false;
      listValues = [];
    }

    const kvMatch = line.match(/^(\w+)\s*:\s*(.*)/);
    if (!kvMatch) continue;

    const [, key, val] = kvMatch;
    const trimVal = val.trim();

    // Inline array: tags: [a, b, c]
    const arrayMatch = trimVal.match(/^\[(.+)\]$/);
    if (arrayMatch) {
      meta[key] = arrayMatch[1]
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""));
      continue;
    }

    if (trimVal === "" || trimVal === "[]") {
      // Could be start of a YAML list
      currentKey = key;
      inList = true;
      listValues = [];
      continue;
    }

    meta[key] = trimVal.replace(/^["']|["']$/g, "");
  }

  if (inList && currentKey) {
    meta[currentKey] = listValues;
  }

  return { meta, body };
}

function extractImages(content: string): string[] {
  const urls: string[] = [];
  const seen = new Set<string>();

  // Markdown images: ![alt](url)
  const mdRegex = /!\[.*?\]\((\S+?)\)/g;
  let match;
  while ((match = mdRegex.exec(content)) !== null) {
    const url = match[1];
    if (!seen.has(url)) {
      seen.add(url);
      urls.push(url);
    }
  }

  // HTML img tags: <img src="url" />
  const htmlRegex = /<img\s[^>]*src=["'](\S+?)["'][^>]*>/gi;
  while ((match = htmlRegex.exec(content)) !== null) {
    const url = match[1];
    if (!seen.has(url)) {
      seen.add(url);
      urls.push(url);
    }
  }

  return urls;
}

export function ArticleForm({ initial }: { initial?: ArticleData }) {
  const router = useRouter();
  const isEditing = !!initial?.id;

  const [form, setForm] = useState<ArticleData>({
    slug: initial?.slug ?? "",
    title: initial?.title ?? "",
    summary: initial?.summary ?? "",
    content: initial?.content ?? "",
    coverUrl: initial?.coverUrl ?? "",
    tags: initial?.tags ?? [],
    series: initial?.series ?? "",
    sortOrder: initial?.sortOrder ?? 0,
    isFree: initial?.isFree ?? true,
    publishedAt: initial?.publishedAt ?? null,
  });

  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const mdInputRef = useRef<HTMLInputElement>(null);
  const coverManualRef = useRef(!!initial?.coverUrl);

  const contentImages = useMemo(
    () => extractImages(form.content),
    [form.content],
  );

  // Auto-select first image as cover when content changes (only if user hasn't manually set cover)
  useEffect(() => {
    if (!coverManualRef.current && !form.coverUrl && contentImages.length > 0) {
      setForm((prev) => ({ ...prev, coverUrl: contentImages[0] }));
    }
  }, [contentImages, form.coverUrl]);

  function handleCoverChange(url: string) {
    coverManualRef.current = true;
    setForm({ ...form, coverUrl: url });
  }

  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5\s-]/g, "")
      .replace(/[\s]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  }

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm({ ...form, tags: [...form.tags, tag] });
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  }

  function handleImportMarkdown(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;

      if (form.content.trim() && !confirm("当前已有内容，导入将覆盖现有内容。是否继续？")) {
        return;
      }

      const { meta, body } = parseFrontmatter(text);

      const updates: Partial<ArticleData> = { content: body };

      if (meta.title && typeof meta.title === "string") {
        updates.title = meta.title;
        if (!isEditing) {
          updates.slug = generateSlug(meta.title);
        }
      }

      const summary = meta.summary ?? meta.description ?? meta.excerpt;
      if (summary && typeof summary === "string") {
        updates.summary = summary;
      }

      if (meta.tags && Array.isArray(meta.tags)) {
        updates.tags = meta.tags;
      }

      if (meta.series && typeof meta.series === "string") {
        updates.series = meta.series;
      }

      if (meta.coverUrl && typeof meta.coverUrl === "string") {
        updates.coverUrl = meta.coverUrl;
        coverManualRef.current = true;
      } else if (meta.cover && typeof meta.cover === "string") {
        updates.coverUrl = meta.cover;
        coverManualRef.current = true;
      } else {
        // Reset manual flag so auto-pick can work with new content
        coverManualRef.current = false;
      }

      setForm((prev) => ({ ...prev, ...updates }));
    };
    reader.readAsText(file);
  }

  async function handleSave(publish?: boolean) {
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      publishedAt:
        publish === true
          ? new Date().toISOString()
          : publish === false
            ? null
            : form.publishedAt,
    };

    try {
      const url = isEditing
        ? `/api/admin/articles/${initial!.id}`
        : "/api/admin/articles";
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

      router.push("/admin/articles");
      router.refresh();
    } catch {
      setError("网络错误");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("确定删除这篇文章吗？此操作不可撤销。")) return;
    setSaving(true);

    try {
      await fetch(`/api/admin/articles/${initial!.id}`, { method: "DELETE" });
      router.push("/admin/articles");
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
        {/* Main content */}
        <div className="space-y-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium">标题</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm({
                  ...form,
                  title,
                  ...(isEditing ? {} : { slug: generateSlug(title) }),
                });
              }}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="文章标题"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono"
              placeholder="article-slug"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">摘要</label>
            <textarea
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              rows={3}
              placeholder="文章摘要..."
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium">内容（Markdown）</label>
              <div>
                <input
                  ref={mdInputRef}
                  type="file"
                  accept=".md,.markdown,.mdx"
                  onChange={handleImportMarkdown}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => mdInputRef.current?.click()}
                >
                  <svg
                    className="mr-1.5 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  导入 Markdown
                </Button>
              </div>
            </div>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono"
              rows={20}
              placeholder="# 文章标题&#10;&#10;正文内容..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-4 space-y-4">
            <h3 className="font-medium">发布设置</h3>

            <div>
              <label className="mb-1.5 block text-sm font-medium">封面图</label>
              <CoverImagePicker
                value={form.coverUrl}
                onChange={handleCoverChange}
                contentImages={contentImages}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">系列</label>
              <input
                type="text"
                value={form.series}
                onChange={(e) => setForm({ ...form, series: e.target.value })}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="如：21天学习Claude"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">排序序号</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                min={0}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                系列文章按此排序，数字越小越靠前
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">标签</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                  placeholder="输入标签后回车"
                />
                <Button type="button" variant="outline" size="sm" onClick={addTag}>
                  添加
                </Button>
              </div>
              {form.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-0.5 hover:text-destructive"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isFree}
                onChange={(e) => setForm({ ...form, isFree: e.target.checked })}
                className="rounded border"
              />
              免费文章
            </label>
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
              <Button onClick={() => handleSave()} disabled={saving}>
                {saving ? "保存中..." : "保存"}
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
              {form.publishedAt && (
                <Button
                  variant="outline"
                  onClick={() => handleSave(false)}
                  disabled={saving}
                >
                  下架
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
