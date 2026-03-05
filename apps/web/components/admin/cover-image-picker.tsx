"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@workspace/ui/components/button";

interface CoverImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  contentImages: string[];
}

export function CoverImagePicker({
  value,
  onChange,
  contentImages,
}: CoverImagePickerProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/admin/upload/image", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (!data.success) {
          setError(data.error ?? "上传失败");
          return;
        }

        onChange(data.data.url);
      } catch {
        setError("网络错误");
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      uploadFile(file);
    }
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Current cover preview */}
      {value && (
        <div className="space-y-2">
          <div className="relative overflow-hidden rounded-lg border">
            <img
              src={value}
              alt="封面预览"
              className="h-40 w-full object-cover"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange("")}
            >
              移除封面
            </Button>
          </div>
        </div>
      )}

      {/* Images extracted from content */}
      {contentImages.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs text-muted-foreground">
            从内容中选择封面图
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {contentImages.map((url, i) => (
              <button
                key={`${url}-${i}`}
                type="button"
                onClick={() => onChange(url)}
                className={`relative overflow-hidden rounded border-2 transition-colors ${
                  value === url
                    ? "border-primary ring-1 ring-primary"
                    : "border-transparent hover:border-muted-foreground/50"
                }`}
              >
                <img
                  src={url}
                  alt={`内容图片 ${i + 1}`}
                  className="h-16 w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Upload custom image */}
      <div
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <svg
          className="mb-1 h-6 w-6 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-xs text-muted-foreground">
          {uploading ? "上传中..." : "上传自定义封面图"}
        </p>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
