import type { ImgHTMLAttributes } from "react";

/**
 * Enhanced image with figure/figcaption, SVG auto-sizing, and illustration-card styling.
 * Maps to <img> elements in MDX.
 *
 * Markdown: ![描述文字](url)
 * - SVG images → wrapped in .illustration-card styled container (dark panel, top gradient line)
 * - Other images → standard figure with figcaption
 * - No alt text → bare img tag
 */
export function EnhancedImage({
  src,
  alt,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  if (!src) return null;

  const isSvg = typeof src === "string" && src.endsWith(".svg");

  const img = (
    <img
      src={src}
      alt={alt ?? ""}
      loading="lazy"
      className={`rounded-lg ${isSvg ? "w-full max-w-2xl mx-auto" : ""}`}
      {...props}
    />
  );

  // SVG images get the illustration-card treatment
  if (isSvg) {
    return (
      <figure className="illustration-card my-8 rounded-2xl border relative overflow-hidden p-6 md:p-8 bg-slate-50 dark:bg-[#0e1420] border-slate-200 dark:border-[#1e2d47]">
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent" />
        {img}
        {alt && (
          <figcaption className="mt-4 text-center text-xs font-mono text-slate-500 dark:text-slate-500">
            {alt}
          </figcaption>
        )}
      </figure>
    );
  }

  // Regular images with alt text get figure/figcaption
  if (alt) {
    return (
      <figure className="my-8">
        {img}
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {alt}
        </figcaption>
      </figure>
    );
  }

  return img;
}
