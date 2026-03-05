/**
 * Seed script: Insert 21 "21天学习Claude" series articles.
 *
 * Usage: npx tsx scripts/seed-series-articles.ts
 *
 * Creates 21 articles with titles and summaries, published and ordered.
 * Uses upsert to avoid duplicates if run multiple times.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SERIES_NAME = "21天学习Claude";

interface ArticleDef {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  sortOrder: number;
}

const articles: ArticleDef[] = [
  // Week 1: 基础入门
  {
    slug: "21-day-claude-day-01",
    title: "Day 1：认识 Claude — 它是什么，能做什么？",
    summary:
      "了解 Claude 的核心能力、使用场景，以及它和 ChatGPT 等 AI 的区别。完成你的第一次 Claude 对话。",
    tags: ["入门", "Claude"],
    sortOrder: 1,
  },
  {
    slug: "21-day-claude-day-02",
    title: "Day 2：Claude 模型家族 — Opus、Sonnet、Haiku 怎么选？",
    summary:
      "理解三个模型的定位、价格和适用场景，学会按需选择最合适的模型。",
    tags: ["入门", "模型选择"],
    sortOrder: 2,
  },
  {
    slug: "21-day-claude-day-03",
    title: "Day 3：第一次高质量对话 — 和 Claude 正确地聊天",
    summary:
      "学会对话礼仪、上下文管理，掌握让 Claude 给出高质量回答的沟通技巧。",
    tags: ["入门", "对话技巧"],
    sortOrder: 3,
  },
  {
    slug: "21-day-claude-day-04",
    title: "Day 4：Prompt 基础 — 角色、任务、背景、格式",
    summary:
      "掌握 Prompt 四要素框架（角色、任务、背景、格式），从此告别「问不出好答案」。",
    tags: ["Prompt", "入门"],
    sortOrder: 4,
  },
  {
    slug: "21-day-claude-day-05",
    title: "Day 5：结构化输出 — 让 Claude 按格式回答",
    summary:
      "学会让 Claude 输出表格、列表、JSON、Markdown 等结构化格式，提升内容可用性。",
    tags: ["Prompt", "结构化"],
    sortOrder: 5,
  },
  {
    slug: "21-day-claude-day-06",
    title: "Day 6：多轮对话技巧 — 追问、纠正与迭代优化",
    summary:
      "如何通过多轮对话逐步逼近理想结果，掌握迭代式提问和纠正技巧。",
    tags: ["对话技巧", "Prompt"],
    sortOrder: 6,
  },
  {
    slug: "21-day-claude-day-07",
    title: "Day 7：周复习 + 实战：用 Claude 完成一篇职场写作",
    summary:
      "综合运用前 6 天技巧，独立用 Claude 完成一个完整的职场写作任务。",
    tags: ["实战", "写作"],
    sortOrder: 7,
  },
  // Week 2: 进阶能力
  {
    slug: "21-day-claude-day-08",
    title: "Day 8：Claude 读图 — 图片分析与视觉理解",
    summary:
      "图片理解实战：截图分析、表格识别、图表解读，充分利用 Claude 的视觉能力。",
    tags: ["视觉", "多模态"],
    sortOrder: 8,
  },
  {
    slug: "21-day-claude-day-09",
    title: "Day 9：Claude 读文档 — PDF 分析与信息提取",
    summary:
      "文档分析实战：合同审阅、论文摘要、报告关键信息提取，让 Claude 成为你的文档助手。",
    tags: ["文档分析", "多模态"],
    sortOrder: 9,
  },
  {
    slug: "21-day-claude-day-10",
    title: "Day 10：联网搜索 — 让 Claude 获取实时信息",
    summary:
      "使用 Web Search 功能获取最新资讯，告别知识截止日期限制。",
    tags: ["联网搜索", "实时信息"],
    sortOrder: 10,
  },
  {
    slug: "21-day-claude-day-11",
    title: "Day 11：Prompt 模板 — 职场写作篇",
    summary:
      "邮件、报告、公文、方案的即用 Prompt 模板，拿来就能用，职场效率翻倍。",
    tags: ["Prompt模板", "写作"],
    sortOrder: 11,
  },
  {
    slug: "21-day-claude-day-12",
    title: "Day 12：Prompt 模板 — 数据分析篇",
    summary:
      "Excel 处理、趋势分析、数据可视化建议的实战模板，让 Claude 帮你做数据分析。",
    tags: ["Prompt模板", "数据分析"],
    sortOrder: 12,
  },
  {
    slug: "21-day-claude-day-13",
    title: "Day 13：Prompt 模板 — 学习总结篇",
    summary:
      "读书笔记、知识梳理、学习计划生成的高效模板，用 Claude 加速学习效率。",
    tags: ["Prompt模板", "学习"],
    sortOrder: 13,
  },
  {
    slug: "21-day-claude-day-14",
    title: "Day 14：周复习 + 实战：用 Claude 完成一个分析项目",
    summary:
      "结合多模态能力和 Prompt 模板，完成一个真实工作场景的数据分析任务。",
    tags: ["实战", "数据分析"],
    sortOrder: 14,
  },
  // Week 3: 高效应用
  {
    slug: "21-day-claude-day-15",
    title: "Day 15：深度推理 — Extended Thinking 的威力",
    summary:
      "让 Claude 进行深度分析和多步推理，解决复杂问题，体验 Extended Thinking 的强大能力。",
    tags: ["高级", "推理"],
    sortOrder: 15,
  },
  {
    slug: "21-day-claude-day-16",
    title: "Day 16：Projects 功能 — 打造你的专属知识库",
    summary:
      "上传文档建立项目上下文，让 Claude 成为你的专属领域顾问。",
    tags: ["高级", "Projects"],
    sortOrder: 16,
  },
  {
    slug: "21-day-claude-day-17",
    title: "Day 17：建立个人 Prompt 库 — 可复用的模板体系",
    summary:
      "整理高频使用场景，创建属于自己的可复用 Prompt 模板库，形成个人 AI 工作流。",
    tags: ["效率", "Prompt"],
    sortOrder: 17,
  },
  {
    slug: "21-day-claude-day-18",
    title: "Day 18：工作流整合 — 让 Claude 融入日常工作",
    summary:
      "探索如何将 Claude 融入日常工作流，系统性减少重复劳动，提升整体效率。",
    tags: ["效率", "工作流"],
    sortOrder: 18,
  },
  {
    slug: "21-day-claude-day-19",
    title: "Day 19：毕业项目 Day 1 — 选题与规划",
    summary:
      "选择一个实际工作问题，用 Claude 进行需求拆解和方案设计。",
    tags: ["项目", "实战"],
    sortOrder: 19,
  },
  {
    slug: "21-day-claude-day-20",
    title: "Day 20：毕业项目 Day 2 — 执行与交付",
    summary:
      "全面运用所学技巧，完成项目核心部分并打磨产出物。",
    tags: ["项目", "实战"],
    sortOrder: 20,
  },
  {
    slug: "21-day-claude-day-21",
    title: "Day 21：毕业总结 — 回顾成长，展望进阶之路",
    summary:
      "总结 21 天的学习收获，了解 API 开发、Agent 等进阶方向，规划下一步学习路线。",
    tags: ["总结", "进阶"],
    sortOrder: 21,
  },
];

async function main() {
  console.log(`Seeding ${articles.length} series articles...`);

  for (const def of articles) {
    const result = await prisma.article.upsert({
      where: { slug: def.slug },
      update: {
        title: def.title,
        summary: def.summary,
        tags: def.tags,
        series: SERIES_NAME,
        sortOrder: def.sortOrder,
      },
      create: {
        slug: def.slug,
        title: def.title,
        summary: def.summary,
        content: "",
        tags: def.tags,
        series: SERIES_NAME,
        sortOrder: def.sortOrder,
        isFree: true,
        readingTime: 1,
        publishedAt: new Date(),
      },
    });
    console.log(
      `  ${result.sortOrder > 0 ? `Day ${String(result.sortOrder).padStart(2, "0")}` : ""} ${result.title} → ${result.id}`,
    );
  }

  console.log("\nDone! All series articles seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
