/**
 * Seed script: Insert 41 Claude tutorial articles as drafts.
 *
 * Usage: npx tsx scripts/seed-claude-tutorials.ts
 *
 * This creates article entries with:
 * - Metadata: slug, title, summary, tags, series, sortOrder, isFree
 * - Content: Markdown skeleton template ready for filling
 * - Status: Draft (publishedAt = null)
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface TutorialDef {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  series: string;
  sortOrder: number;
  isFree: boolean;
}

// ─── Tutorial definitions ────────────────────────────────────────────────────

const beginnerSeries = "Claude 入门";
const intermediateSeries = "Claude API 开发";
const advancedSeries = "Claude 高级开发";

const tutorials: TutorialDef[] = [
  // ── Beginner (12 articles, free) ──────────────────────────────────────────
  {
    slug: "what-is-claude",
    title: "Claude 是什么？能做什么？",
    summary:
      "全面了解 Anthropic 的 Claude AI：它的核心能力、与 ChatGPT 的区别、适用场景，以及为什么越来越多专业用户选择 Claude。",
    tags: ["Claude", "入门", "AI基础"],
    series: beginnerSeries,
    sortOrder: 1,
    isFree: true,
  },
  {
    slug: "choose-model",
    title: "三个模型怎么选（Opus/Sonnet/Haiku）",
    summary:
      "Claude 4.6 系列包含 Opus、Sonnet、Haiku 三款模型。本文通过实际场景对比它们的能力、速度和价格，帮你选出最适合的模型。",
    tags: ["Claude", "模型选择", "定价"],
    series: beginnerSeries,
    sortOrder: 2,
    isFree: true,
  },
  {
    slug: "first-conversation",
    title: "第一次和 Claude 对话的正确方式",
    summary:
      "从打开 Claude.ai 到获得高质量回答，手把手教你掌握对话的基本技巧：如何提供上下文、如何追问、如何让 Claude 修正回答。",
    tags: ["Claude", "对话技巧"],
    series: beginnerSeries,
    sortOrder: 3,
    isFree: true,
  },
  {
    slug: "prompt-basics",
    title: "Prompt 基础：如何提出好问题",
    summary:
      "掌握 Prompt Engineering 的核心原则：明确指令、提供示例、设定角色、控制输出格式。从「还行」的回答到「惊艳」的回答，差距就在 Prompt 里。",
    tags: ["Prompt", "入门"],
    series: beginnerSeries,
    sortOrder: 4,
    isFree: true,
  },
  {
    slug: "format-output",
    title: "让 Claude 按格式输出（表格/列表/JSON）",
    summary:
      "学会控制 Claude 的输出格式：Markdown 表格、编号列表、JSON 结构。让 AI 的回答直接可用，不需要二次整理。",
    tags: ["Prompt", "格式化", "输出"],
    series: beginnerSeries,
    sortOrder: 5,
    isFree: true,
  },
  {
    slug: "claude-vision",
    title: "让 Claude 读图：图片理解实战",
    summary:
      "Claude 的视觉能力远超你的想象。本文通过 6 个真实场景（截图分析、图表解读、OCR、设计审查等）展示如何让 Claude 理解图片。",
    tags: ["Vision", "图片识别"],
    series: beginnerSeries,
    sortOrder: 6,
    isFree: true,
  },
  {
    slug: "claude-pdf-analysis",
    title: "让 Claude 读 PDF：文档分析实战",
    summary:
      "合同审查、论文摘要、财报分析——Claude 可以直接读取 PDF 文件并提取关键信息。本文介绍 PDF 分析的完整流程和最佳实践。",
    tags: ["PDF", "文档分析"],
    series: beginnerSeries,
    sortOrder: 7,
    isFree: true,
  },
  {
    slug: "web-search-intro",
    title: "让 Claude 搜索网络：获取实时信息",
    summary:
      "Claude 不再局限于训练数据。通过内置的 Web 搜索功能，Claude 可以获取最新信息、验证事实、查找资料。学会如何高效使用联网功能。",
    tags: ["搜索", "联网"],
    series: beginnerSeries,
    sortOrder: 8,
    isFree: true,
  },
  {
    slug: "prompt-templates-writing",
    title: "Prompt 模板库：职场写作篇",
    summary:
      "10 个即用 Prompt 模板：周报、邮件、方案、PPT 大纲、会议纪要……复制粘贴就能用，让 Claude 成为你的写作助手。",
    tags: ["Prompt", "写作", "模板"],
    series: beginnerSeries,
    sortOrder: 9,
    isFree: true,
  },
  {
    slug: "prompt-templates-data",
    title: "Prompt 模板库：数据分析篇",
    summary:
      "10 个数据分析 Prompt 模板：Excel 公式生成、SQL 查询、数据清洗、图表建议、统计分析……让 Claude 成为你的数据分析师。",
    tags: ["Prompt", "数据分析", "模板"],
    series: beginnerSeries,
    sortOrder: 10,
    isFree: true,
  },
  {
    slug: "prompt-templates-learning",
    title: "Prompt 模板库：学习总结篇",
    summary:
      "10 个学习效率 Prompt 模板：知识总结、费曼学习法、思维导图生成、多角度分析、知识点串联……让 Claude 加速你的学习。",
    tags: ["Prompt", "学习", "模板"],
    series: beginnerSeries,
    sortOrder: 11,
    isFree: true,
  },
  {
    slug: "extended-thinking",
    title: "扩展思考：让 Claude 深度推理",
    summary:
      "Claude 的扩展思考功能让 AI 在回答前进行深度推理。本文讲解何时使用、如何配置 token 预算，以及它在数学、编程、分析任务中的实际效果。",
    tags: ["扩展思考", "推理"],
    series: beginnerSeries,
    sortOrder: 12,
    isFree: true,
  },

  // ── Intermediate (15 articles) ────────────────────────────────────────────
  {
    slug: "api-quickstart",
    title: "API 快速入门：第一次 API 调用",
    summary:
      "从零开始调用 Claude API：获取 API Key、安装 SDK、发送第一条消息。Python 和 TypeScript 双语示例，5 分钟完成你的第一次 API 调用。",
    tags: ["API", "Python", "入门"],
    series: intermediateSeries,
    sortOrder: 1,
    isFree: false,
  },
  {
    slug: "messages-api-multi-turn",
    title: "Messages API 深入：多轮对话",
    summary:
      "深入理解 Messages API 的对话机制：消息角色、多轮上下文管理、system prompt、stop_reason 处理，构建真正的对话式 AI 应用。",
    tags: ["API", "多轮对话"],
    series: intermediateSeries,
    sortOrder: 2,
    isFree: false,
  },
  {
    slug: "system-prompt-design",
    title: "System Prompt 设计：给 Claude 定规矩",
    summary:
      "System Prompt 是 Claude 的行为蓝图。本文教你设计高效的 System Prompt：角色设定、输出约束、防护栏设置，以及 Claude 4.6 的最新最佳实践。",
    tags: ["System Prompt", "设计"],
    series: intermediateSeries,
    sortOrder: 3,
    isFree: false,
  },
  {
    slug: "structured-output-json",
    title: "结构化输出：让 API 返回 JSON",
    summary:
      "2025 年底推出的结构化输出功能，让 Claude API 100% 按 JSON Schema 返回数据。告别正则解析，本文介绍 strict 模式、output_config 配置和实战用法。",
    tags: ["JSON Schema", "结构化"],
    series: intermediateSeries,
    sortOrder: 4,
    isFree: false,
  },
  {
    slug: "citations-rag",
    title: "引用与 RAG：让 Claude 引用原文",
    summary:
      "构建可靠的 RAG 应用：Claude 的 Citations 功能可以自动标注回答来源，精确到段落和页码。本文讲解引用 API 配置和检索增强生成的完整方案。",
    tags: ["RAG", "引用", "检索"],
    series: intermediateSeries,
    sortOrder: 5,
    isFree: false,
  },
  {
    slug: "tool-use-basics",
    title: "工具调用入门：让 Claude 调用函数",
    summary:
      "Tool Use 是构建 AI Agent 的基础。本文从零讲解：定义工具 Schema、处理 tool_use 响应、返回 tool_result，附完整的天气查询 + 数据库查询实战。",
    tags: ["Tool Use", "Function Calling"],
    series: intermediateSeries,
    sortOrder: 6,
    isFree: false,
  },
  {
    slug: "web-search-scraping",
    title: "Web 搜索 & 抓取：构建联网 AI",
    summary:
      "使用 Claude 的 Web Search Tool 和 Web Fetch Tool 构建联网 AI 应用：实时搜索信息、抓取网页内容、提取结构化数据。",
    tags: ["Web搜索", "抓取"],
    series: intermediateSeries,
    sortOrder: 7,
    isFree: false,
  },
  {
    slug: "code-execution-tool",
    title: "代码执行工具：让 Claude 写代码并运行",
    summary:
      "Claude 的 Code Execution Tool 可以在安全沙箱中运行 Python 代码。本文讲解如何启用、使用场景（数据分析、可视化、数学验证），以及安全注意事项。",
    tags: ["代码执行", "沙箱"],
    series: intermediateSeries,
    sortOrder: 8,
    isFree: false,
  },
  {
    slug: "files-api",
    title: "文件上传：批量处理文档",
    summary:
      "Files API 让你上传文件到 Claude 平台并在多次对话中复用。本文讲解文件上传、管理、在消息中引用文件，以及批量文档处理的最佳实践。",
    tags: ["Files API", "批量"],
    series: intermediateSeries,
    sortOrder: 9,
    isFree: false,
  },
  {
    slug: "prompt-caching",
    title: "Prompt 缓存：降低成本的技巧",
    summary:
      "Prompt Caching 可以节省 90% 的重复 token 费用。本文深入讲解缓存机制、前缀匹配原理、最佳请求结构设计，以及 Claude Code 团队的实战经验。",
    tags: ["缓存", "成本优化"],
    series: intermediateSeries,
    sortOrder: 10,
    isFree: false,
  },
  {
    slug: "batch-processing",
    title: "批量处理：大规模任务省 50%",
    summary:
      "Message Batches API 让你异步处理大量请求，享受 50% 价格折扣。本文讲解创建批量任务、查询状态、获取结果，以及适用的大规模处理场景。",
    tags: ["批量API", "异步"],
    series: intermediateSeries,
    sortOrder: 11,
    isFree: false,
  },
  {
    slug: "token-management",
    title: "Token 管理：计数、优化、控制成本",
    summary:
      "理解 Claude 的 token 计费：输入/输出 token 计价、Token 计数 API 使用、Effort 参数控制思考深度、实用的成本控制策略。",
    tags: ["Token", "成本", "Effort"],
    series: intermediateSeries,
    sortOrder: 12,
    isFree: false,
  },
  {
    slug: "python-sdk-project",
    title: "Python SDK 实战项目",
    summary:
      "使用 Anthropic Python SDK 从零构建一个完整项目：智能文档问答助手。涵盖 SDK 安装、对话管理、工具调用、流式输出、错误处理的完整链路。",
    tags: ["Python", "SDK", "项目"],
    series: intermediateSeries,
    sortOrder: 13,
    isFree: false,
  },
  {
    slug: "typescript-sdk-project",
    title: "TypeScript SDK 实战项目",
    summary:
      "使用 @anthropic-ai/sdk 构建一个 Next.js AI 聊天应用：API 路由、流式响应、前端渲染、会话管理的完整 TypeScript 实战。",
    tags: ["TypeScript", "SDK", "项目"],
    series: intermediateSeries,
    sortOrder: 14,
    isFree: false,
  },
  {
    slug: "error-handling-rate-limits",
    title: "错误处理与速率限制",
    summary:
      "生产环境必备：Claude API 的错误码详解、重试策略、指数退避实现、速率限制层级、429 处理方案，以及监控告警的最佳实践。",
    tags: ["错误处理", "限流"],
    series: intermediateSeries,
    sortOrder: 15,
    isFree: false,
  },

  // ── Advanced (14 articles) ────────────────────────────────────────────────
  {
    slug: "agent-architecture",
    title: "Agent 架构设计：从单轮到自主循环",
    summary:
      "深入理解 AI Agent 的四层架构（Agent Loop → Runtime → MCP → Skills）。从单轮对话到自主决策循环，设计可靠的 Agent 系统。",
    tags: ["Agent", "架构"],
    series: advancedSeries,
    sortOrder: 1,
    isFree: false,
  },
  {
    slug: "multi-tool-orchestration",
    title: "多工具编排：让 Agent 自主选择工具",
    summary:
      "当 Agent 有 10+ 个工具可用时，如何让它自主选择正确的工具？本文讲解工具描述优化、Tool Search、工具组合策略和并行调用。",
    tags: ["Agent", "工具编排"],
    series: advancedSeries,
    sortOrder: 2,
    isFree: false,
  },
  {
    slug: "computer-use-agent",
    title: "Computer Use：桌面自动化 Agent",
    summary:
      "Claude 的 Computer Use 功能可以操控电脑：截屏识别、鼠标点击、键盘输入。本文构建一个完整的桌面自动化 Agent，实现 RPA 级别的任务自动化。",
    tags: ["Computer Use", "自动化"],
    series: advancedSeries,
    sortOrder: 3,
    isFree: false,
  },
  {
    slug: "mcp-protocol",
    title: "MCP 协议：连接外部服务",
    summary:
      "Model Context Protocol 是 AI 连接外部系统的开放标准。本文讲解 MCP 的架构设计、Server 开发、Client 集成，以及与 Claude Code 的配合使用。",
    tags: ["MCP", "协议"],
    series: advancedSeries,
    sortOrder: 4,
    isFree: false,
  },
  {
    slug: "agent-skills",
    title: "Agent Skills：扩展能力（Office/PDF）",
    summary:
      "Agent Skills 是 Claude 的专业能力模块：生成 PPT、分析 Excel、处理 PDF。本文讲解 Skills 的设计原则、自定义 Skill 开发和 MCP 的关系。",
    tags: ["Agent", "Skills"],
    series: advancedSeries,
    sortOrder: 5,
    isFree: false,
  },
  {
    slug: "memory-system",
    title: "记忆系统：跨对话持久记忆",
    summary:
      "Claude 的 Memory Tool 可以跨对话保存和检索信息。本文讲解记忆系统的架构、使用场景（个性化助手、知识积累），以及记忆管理策略。",
    tags: ["记忆", "持久化"],
    series: advancedSeries,
    sortOrder: 6,
    isFree: false,
  },
  {
    slug: "long-context-window",
    title: "1M 上下文窗口实战",
    summary:
      "Claude 支持 100 万 token 的超长上下文（Beta）。本文探索实际应用场景：整本书分析、大型代码库理解、长期对话记忆，以及性能和成本考量。",
    tags: ["上下文", "长文本"],
    series: advancedSeries,
    sortOrder: 7,
    isFree: false,
  },
  {
    slug: "context-management",
    title: "上下文管理：压缩、编辑、缓存策略",
    summary:
      "生产级 AI 应用的上下文管理三件套：Compaction（压缩摘要）、Context Editing（自动裁剪）、Prompt Caching（缓存复用）。本文讲解最优组合策略。",
    tags: ["上下文", "压缩", "编辑"],
    series: advancedSeries,
    sortOrder: 8,
    isFree: false,
  },
  {
    slug: "streaming-tool-streaming",
    title: "流式输出与细粒度工具流",
    summary:
      "构建实时 AI 体验：Server-Sent Events 流式输出、工具调用参数的细粒度流式传输，以及前端渐进式渲染的完整方案。",
    tags: ["流式", "Streaming"],
    series: advancedSeries,
    sortOrder: 9,
    isFree: false,
  },
  {
    slug: "programmatic-tool-calling",
    title: "编程式工具调用：容器内执行",
    summary:
      "Programmatic Tool Calling 让 Claude 在容器内直接执行代码，无需往返 API。本文讲解容器化工具执行的架构、安全模型和性能优势。",
    tags: ["编程式调用", "容器"],
    series: advancedSeries,
    sortOrder: 10,
    isFree: false,
  },
  {
    slug: "cloud-deployment",
    title: "云平台部署：Bedrock / Vertex AI / Azure",
    summary:
      "在三大云平台上使用 Claude：AWS Bedrock 的 Converse API、Google Vertex AI 的集成方式、Azure Foundry 的配置。对比各平台的功能差异和最佳选择。",
    tags: ["云平台", "部署"],
    series: advancedSeries,
    sortOrder: 11,
    isFree: false,
  },
  {
    slug: "cost-optimization",
    title: "成本优化全攻略",
    summary:
      "全方位降低 Claude API 费用：Prompt Caching（省 90%）、Batch API（省 50%）、Effort 参数、模型选择策略、token 优化技巧。附成本计算器和监控方案。",
    tags: ["成本", "优化"],
    series: advancedSeries,
    sortOrder: 12,
    isFree: false,
  },
  {
    slug: "claude-code-deep-dive",
    title: "Claude Code 深度使用",
    summary:
      "Claude Code 是 Anthropic 的 AI 编程助手。本文深度讲解：MCP Server 配置、Sub-Agent 多智能体协作、Hook 自动化、Skills 开发、最佳工作流。",
    tags: ["Claude Code", "开发工具"],
    series: advancedSeries,
    sortOrder: 13,
    isFree: false,
  },
  {
    slug: "production-agent-project",
    title: "生产级 Agent 项目实战",
    summary:
      "从零构建一个生产级 AI Agent：需求分析、架构设计、工具编排、错误恢复、日志监控、安全防护。完整的 Agent 项目实战指南。",
    tags: ["Agent", "生产", "项目"],
    series: advancedSeries,
    sortOrder: 14,
    isFree: false,
  },
];

// ─── Content template ────────────────────────────────────────────────────────

function generateContent(t: TutorialDef, index: number, total: number): string {
  const nextArticle =
    index < total - 1
      ? tutorials.filter((x) => x.series === t.series)[
          tutorials.filter((x) => x.series === t.series).indexOf(t) + 1
        ]
      : null;

  return `${t.summary}

## 你将学到什么

- 待填写
- 待填写
- 待填写

## 第一节：概述

<!-- TODO: 正文内容 -->

## 第二节：核心概念

<!-- TODO: 正文内容 + SVG 插图 -->

## 第三节：实战演示

<!-- TODO: 代码示例 / 操作步骤 -->

## 实战练习

> **Tip:** 动手实践是最好的学习方式。

1. 练习 1：待填写
2. 练习 2：待填写

## 关键要点

> **Note:** 本文核心总结

- 要点 1
- 要点 2
- 要点 3

## 延伸阅读

${nextArticle ? `- [下一篇：${nextArticle.title}](/articles/${nextArticle.slug})` : "- 恭喜你完成了本系列全部课程！"}
`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Seeding ${tutorials.length} Claude tutorials...`);

  let created = 0;
  let skipped = 0;

  for (const t of tutorials) {
    // Skip if already exists
    const existing = await prisma.article.findUnique({
      where: { slug: t.slug },
    });

    if (existing) {
      console.log(`  SKIP: ${t.slug} (already exists)`);
      skipped++;
      continue;
    }

    const content = generateContent(t, tutorials.indexOf(t), tutorials.length);
    const readingTime = Math.max(
      1,
      Math.ceil(content.replace(/<[^>]+>/g, "").length / 300),
    );

    await prisma.article.create({
      data: {
        slug: t.slug,
        title: t.title,
        summary: t.summary,
        content,
        tags: t.tags,
        series: t.series,
        sortOrder: t.sortOrder,
        isFree: t.isFree,
        readingTime,
        publishedAt: null, // Draft
      },
    });

    console.log(`  CREATE: ${t.slug}`);
    created++;
  }

  console.log(`\nDone: ${created} created, ${skipped} skipped.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
