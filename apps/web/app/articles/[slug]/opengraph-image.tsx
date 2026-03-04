import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/content/articles";

export const runtime = "nodejs";
export const alt = "文章";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ArticleOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const title = article?.title ?? "文章";
  const tags = article?.tags ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #faf5f0 0%, #f5ebe0 50%, #faf5f0 100%)",
          fontFamily: "sans-serif",
          padding: "60px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 24,
            }}
          >
            {tags.slice(0, 3).map((tag) => (
              <div
                key={tag}
                style={{
                  fontSize: 16,
                  color: "#c9653a",
                  background: "rgba(201, 101, 58, 0.1)",
                  padding: "6px 16px",
                  borderRadius: 20,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "#1a1a1a",
              lineHeight: 1.3,
              letterSpacing: "-0.02em",
              maxWidth: 900,
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 600, color: "#1a1a1a" }}>
            林逍遥 AI
          </div>
          <div style={{ fontSize: 18, color: "#999" }}>lingxiaoyao.cn</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
