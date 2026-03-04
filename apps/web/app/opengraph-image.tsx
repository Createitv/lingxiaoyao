import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "林逍遥 AI — AI 课程与教程";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #faf5f0 0%, #f5ebe0 50%, #faf5f0 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px",
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#1a1a1a",
              marginBottom: 16,
              letterSpacing: "-0.02em",
            }}
          >
            林逍遥 AI
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#c9653a",
              fontWeight: 500,
              marginBottom: 40,
            }}
          >
            AI 课程与教程
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#666",
              maxWidth: 700,
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            学习 AI 工具、Claude 使用技巧，提升日常工作效率。
          </div>
          <div
            style={{
              marginTop: 40,
              fontSize: 16,
              color: "#999",
            }}
          >
            lingxiaoyao.cn
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
