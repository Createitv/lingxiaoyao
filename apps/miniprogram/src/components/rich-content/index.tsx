import { View, Text, RichText } from "@tarojs/components";
import "./index.scss";

interface RichContentProps {
  source: string;
  className?: string;
}

/**
 * Renders Markdown content in mini program.
 * Converts basic Markdown to HTML for RichText component.
 * For complex MDX content, a build-time pre-processing step
 * should convert to JSON AST (see plan).
 */
export default function RichContent({ source, className }: RichContentProps) {
  const html = markdownToHtml(source);

  return (
    <View className={`rich-content ${className ?? ""}`}>
      <RichText nodes={html} />
    </View>
  );
}

function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Headings
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Code blocks — styled with colored-dot header like web version
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_, lang, code) => {
      const langLabel = lang
        ? `<span style="font-size:20rpx;color:#A39E99;letter-spacing:2rpx;font-family:monospace">${lang.toUpperCase()}</span>`
        : "";
      return (
        `<div style="border:1rpx solid #E8E2DC;border-radius:16rpx;overflow:hidden;margin:24rpx 0;background:#FAF8F5">` +
        `<div style="display:flex;align-items:center;justify-content:space-between;padding:16rpx 24rpx;border-bottom:1rpx solid #E8E2DC;background:rgba(245,240,235,0.5)">` +
        `<div style="display:flex;align-items:center">` +
        `<span style="display:inline-block;width:16rpx;height:16rpx;border-radius:50%;background:#ff5f56;margin-right:8rpx"></span>` +
        `<span style="display:inline-block;width:16rpx;height:16rpx;border-radius:50%;background:#ffbd2e;margin-right:8rpx"></span>` +
        `<span style="display:inline-block;width:16rpx;height:16rpx;border-radius:50%;background:#27c93f"></span>` +
        `</div>` +
        langLabel +
        `</div>` +
        `<pre style="padding:24rpx;font-size:24rpx;line-height:1.6;margin:0;white-space:pre-wrap;word-wrap:break-word"><code>${code}</code></pre>` +
        `</div>`
      );
    },
  );

  // Inline code
  html = html.replace(
    /`([^`]+)`/g,
    '<code style="background:#F0EBE5;padding:4rpx 12rpx;border-radius:8rpx;font-size:24rpx;font-family:monospace">$1</code>',
  );

  // Images (before links to avoid conflict with similar syntax)
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" style="width:100%;border-radius:12rpx;margin:16rpx 0" />',
  );

  // Links (miniprogram RichText doesn't support <a>, render as styled text)
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<span style="color:#1677ff">$1</span>',
  );

  // Blockquotes
  html = html.replace(
    /^> (.+)$/gm,
    '<p style="border-left:6rpx solid #d0d7de;padding-left:24rpx;color:#656d76;margin:16rpx 0">$1</p>',
  );

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>");
  // Clean up nested ul tags
  html = html.replace(/<\/ul>\s*<ul>/g, "");

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");

  // Paragraphs (lines not already wrapped in tags)
  html = html.replace(/^(?!<[huplo])((?!<).+)$/gm, "<p>$1</p>");

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, "");

  // Line breaks
  html = html.replace(/\n\n/g, "");

  return html;
}
