/**
 * Generate SVG illustrations for all 41 Claude tutorial articles.
 *
 * Pipeline: Generate SVG → Save to disk → Upload to COS → Insert into article content → Update DB
 *
 * Usage:
 *   npx tsx scripts/generate-article-svgs.ts              # all articles
 *   npx tsx scripts/generate-article-svgs.ts what-is-claude  # single article
 *   npx tsx scripts/generate-article-svgs.ts --dry-run     # preview, no upload/DB
 */

import { PrismaClient } from "@prisma/client";
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import COS from "cos-nodejs-sdk-v5";
import { config } from "dotenv";

import {
  comparisonChart,
  barChart,
  tierCards,
  flowDiagram,
  pricingTable,
  layeredStack,
  featureGrid,
  timeline,
} from "./svg-templates";

config({ path: join(process.cwd(), "apps/web/.env") });
config({ path: join(process.cwd(), "apps/web/.env.local") });

const prisma = new PrismaClient();
const ILLUSTRATIONS_DIR = join(process.cwd(), "illustrations");

// ─── COS upload ──────────────────────────────────────────────────────────────

function getCOS(): COS {
  return new COS({
    SecretId: process.env.TENCENT_SECRET_ID!,
    SecretKey: process.env.TENCENT_SECRET_KEY!,
  });
}

async function uploadBuffer(cos: COS, buffer: Buffer, cosKey: string): Promise<string> {
  const bucket = process.env.TENCENT_COS_BUCKET!;
  const region = process.env.TENCENT_COS_REGION!;
  await new Promise<void>((resolve, reject) => {
    cos.putObject(
      { Bucket: bucket, Region: region, Key: cosKey, Body: buffer, ContentType: "image/svg+xml" },
      (err) => (err ? reject(err) : resolve()),
    );
  });
  return "https://" + bucket + ".cos." + region + ".myqcloud.com/" + cosKey;
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface SvgIllustration {
  filename: string; // e.g. "diagram-1.svg"
  caption: string;  // alt text, used in markdown ![caption](url)
  svg: string;      // raw SVG string
}

interface ArticleIllustrations {
  slug: string;
  illustrations: SvgIllustration[];
}

// ─── Article illustration definitions ────────────────────────────────────────

function getAllArticleIllustrations(): ArticleIllustrations[] {
  return [
    // ══════════════════════════════════════════════════════════════════════════
    //  BEGINNER SERIES (12 articles)
    // ══════════════════════════════════════════════════════════════════════════

    {
      slug: "what-is-claude",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "Claude 核心能力总览",
          svg: tierCards({
            title: "Claude 核心能力",
            cards: [
              { label: "文本生成", icon: "📝", items: ["长文写作", "代码生成", "翻译润色", "创意内容"], color: "#00d4ff" },
              { label: "分析理解", icon: "🔍", items: ["文档分析", "数据解读", "逻辑推理", "知识问答"], color: "#7c3aed" },
              { label: "多模态", icon: "🖼️", items: ["图片理解", "PDF 解析", "代码审查", "视觉推理"], color: "#10b981" },
            ],
          }),
        },
        {
          filename: "diagram-2.svg",
          caption: "Claude vs ChatGPT 对比",
          svg: comparisonChart({
            title: "Claude vs ChatGPT 核心差异",
            leftLabel: "Claude",
            rightLabel: "ChatGPT",
            items: [
              { label: "上下文窗口", left: "200K tokens", right: "128K tokens" },
              { label: "代码能力", left: "极强 (SWE-bench)", right: "强" },
              { label: "长文写作", left: "风格自然", right: "模板感" },
              { label: "安全性", left: "Constitutional AI", right: "RLHF" },
              { label: "中文理解", left: "优秀", right: "优秀" },
              { label: "图片生成", left: "不支持", right: "DALL·E" },
            ],
          }),
        },
      ],
    },

    {
      slug: "choose-model",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "Claude 模型对比",
          svg: pricingTable({
            title: "Claude 4.6 系列模型对比",
            headers: ["指标", "Opus", "Sonnet", "Haiku"],
            rows: [
              { cells: ["智能水平", "最高", "高", "基础"], highlight: true },
              { cells: ["响应速度", "慢 (15-30s)", "中 (3-8s)", "快 (<1s)"] },
              { cells: ["输入价格", "$15/M", "$3/M", "$0.80/M"] },
              { cells: ["输出价格", "$75/M", "$15/M", "$4/M"] },
              { cells: ["上下文窗口", "200K", "200K", "200K"] },
              { cells: ["最佳场景", "复杂推理", "日常开发", "批量处理"] },
            ],
          }),
        },
        {
          filename: "diagram-2.svg",
          caption: "模型选择决策流程",
          svg: flowDiagram({
            title: "如何选择 Claude 模型",
            steps: [
              { label: "评估任务", description: "复杂度" },
              { label: "速度需求", description: "延迟要求" },
              { label: "预算限制", description: "成本考量" },
              { label: "选择模型", description: "最佳匹配" },
            ],
          }),
        },
      ],
    },

    {
      slug: "first-conversation",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "高效对话流程",
          svg: flowDiagram({
            title: "与 Claude 高效对话的流程",
            steps: [
              { label: "明确意图", description: "你想做什么" },
              { label: "提供背景", description: "上下文信息" },
              { label: "设定格式", description: "期望输出" },
              { label: "迭代追问", description: "优化结果" },
            ],
          }),
        },
        {
          filename: "diagram-2.svg",
          caption: "好问题 vs 坏问题",
          svg: comparisonChart({
            title: "提问质量对比",
            leftLabel: "❌ 模糊提问",
            rightLabel: "✅ 精确提问",
            items: [
              { label: "范围", left: "帮我写代码", right: "用 Python 实现快排" },
              { label: "上下文", left: "有个 Bug", right: "第 15 行报 TypeError" },
              { label: "格式", left: "总结一下", right: "用 3 个要点总结" },
              { label: "角色", left: "（无）", right: "你是资深前端工程师" },
            ],
            leftColor: "#ef4444",
            rightColor: "#10b981",
          }),
        },
      ],
    },

    {
      slug: "prompt-basics",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "Prompt 工程四大原则",
          svg: tierCards({
            title: "Prompt Engineering 四大原则",
            cards: [
              { label: "明确指令", icon: "🎯", items: ["具体描述任务", "指定输出格式", "设定约束条件"], color: "#00d4ff" },
              { label: "提供示例", icon: "📋", items: ["Few-shot 示例", "输入输出对", "格式参考"], color: "#7c3aed" },
              { label: "角色设定", icon: "🎭", items: ["专业角色", "行为约束", "知识边界"], color: "#f59e0b" },
            ],
          }),
        },
        {
          filename: "diagram-2.svg",
          caption: "Prompt 优化迭代流程",
          svg: flowDiagram({
            title: "Prompt 迭代优化流程",
            direction: "vertical",
            steps: [
              { label: "初始 Prompt", description: "第一版指令" },
              { label: "执行测试", description: "查看输出" },
              { label: "分析差距", description: "与预期对比" },
              { label: "调整优化", description: "修改指令" },
              { label: "验证结果", description: "达到预期" },
            ],
          }),
        },
      ],
    },

    {
      slug: "format-output",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "输出格式类型对比",
          svg: featureGrid({
            title: "Claude 输出格式能力",
            columns: ["Markdown", "JSON", "XML"],
            rows: [
              { feature: "表格数据", values: ["yes", "yes", "yes"] },
              { feature: "嵌套结构", values: ["partial", "yes", "yes"] },
              { feature: "人类可读", values: ["yes", "partial", "no"] },
              { feature: "程序解析", values: ["partial", "yes", "yes"] },
              { feature: "适合展示", values: ["yes", "no", "no"] },
            ],
          }),
        },
      ],
    },

    {
      slug: "claude-vision",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "Claude 视觉能力场景",
          svg: tierCards({
            title: "Claude 视觉分析六大场景",
            cards: [
              { label: "识别分析", icon: "🔍", items: ["截图分析", "OCR 文字识别", "设计审查"], color: "#00d4ff" },
              { label: "数据解读", icon: "📊", items: ["图表解读", "数据可视化", "趋势分析"], color: "#7c3aed" },
              { label: "创意协作", icon: "🎨", items: ["UI/UX 评审", "草图理解", "风格迁移"], color: "#10b981" },
            ],
          }),
        },
      ],
    },

    {
      slug: "claude-pdf-analysis",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "PDF 分析流程",
          svg: flowDiagram({
            title: "Claude PDF 分析流程",
            steps: [
              { label: "上传 PDF", description: "拖拽或粘贴" },
              { label: "解析内容", description: "文字+图表" },
              { label: "提取信息", description: "结构化数据" },
              { label: "生成摘要", description: "关键结论" },
            ],
          }),
        },
      ],
    },

    {
      slug: "web-search-intro",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "Claude 联网搜索流程",
          svg: flowDiagram({
            title: "Claude 联网搜索工作流",
            steps: [
              { label: "用户提问", description: "触发搜索" },
              { label: "Web 搜索", description: "获取结果" },
              { label: "内容分析", description: "提取信息" },
              { label: "综合回答", description: "引用来源" },
            ],
            color: "#00d4ff",
          }),
        },
      ],
    },

    {
      slug: "prompt-templates-writing",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "职场写作 Prompt 模板分类",
          svg: barChart({
            title: "职场写作场景效率提升",
            items: [
              { label: "周报撰写", value: 90, displayValue: "提效 90%" },
              { label: "邮件回复", value: 85, displayValue: "提效 85%" },
              { label: "方案报告", value: 75, displayValue: "提效 75%" },
              { label: "PPT 大纲", value: 80, displayValue: "提效 80%" },
              { label: "会议纪要", value: 95, displayValue: "提效 95%" },
            ],
            barColor: "#10b981",
          }),
        },
      ],
    },

    {
      slug: "prompt-templates-data",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "数据分析 Prompt 模板",
          svg: tierCards({
            title: "数据分析 Prompt 模板分类",
            cards: [
              { label: "数据处理", icon: "🔧", items: ["Excel 公式", "数据清洗", "格式转换"], color: "#00d4ff" },
              { label: "数据查询", icon: "🔍", items: ["SQL 生成", "条件筛选", "聚合统计"], color: "#7c3aed" },
              { label: "数据洞察", icon: "📊", items: ["趋势分析", "图表建议", "报告生成"], color: "#f59e0b" },
            ],
          }),
        },
      ],
    },

    {
      slug: "prompt-templates-learning",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "学习方法模板",
          svg: timeline({
            title: "AI 辅助学习路径",
            events: [
              { label: "知识概览", description: "让 Claude 生成知识地图", tag: "入门" },
              { label: "费曼学习法", description: "用自己的话复述概念", tag: "理解" },
              { label: "多角度分析", description: "从不同视角理解问题", tag: "深化" },
              { label: "实践练习", description: "让 Claude 出题检验", tag: "巩固" },
              { label: "知识串联", description: "建立知识间的联系", tag: "体系" },
            ],
            color: "#10b981",
          }),
        },
      ],
    },

    {
      slug: "extended-thinking",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "扩展思考工作原理",
          svg: flowDiagram({
            title: "Extended Thinking 工作原理",
            steps: [
              { label: "接收问题", description: "用户输入" },
              { label: "深度推理", description: "思考链展开" },
              { label: "自我验证", description: "检查逻辑" },
              { label: "输出答案", description: "高质量结果" },
            ],
            color: "#7c3aed",
          }),
        },
        {
          filename: "diagram-2.svg",
          caption: "扩展思考 Token 预算",
          svg: barChart({
            title: "思考 Token 预算 vs 输出质量",
            items: [
              { label: "1K tokens", value: 40, displayValue: "基础质量" },
              { label: "4K tokens", value: 65, displayValue: "良好质量" },
              { label: "16K tokens", value: 85, displayValue: "高质量" },
              { label: "64K tokens", value: 95, displayValue: "最佳质量" },
              { label: "128K tokens", value: 100, displayValue: "极致质量" },
            ],
            barColor: "#7c3aed",
          }),
        },
      ],
    },

    // ══════════════════════════════════════════════════════════════════════════
    //  INTERMEDIATE SERIES (15 articles)
    // ══════════════════════════════════════════════════════════════════════════

    {
      slug: "api-quickstart",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "API 调用流程",
          svg: flowDiagram({
            title: "Claude API 调用流程",
            steps: [
              { label: "获取 Key", description: "Console 控制台" },
              { label: "安装 SDK", description: "pip / npm" },
              { label: "编写代码", description: "消息请求" },
              { label: "获取响应", description: "AI 回复" },
            ],
            color: "#00d4ff",
          }),
        },
        {
          filename: "diagram-2.svg",
          caption: "SDK 对比",
          svg: comparisonChart({
            title: "Python SDK vs TypeScript SDK",
            leftLabel: "Python",
            rightLabel: "TypeScript",
            items: [
              { label: "包名", left: "anthropic", right: "@anthropic-ai/sdk" },
              { label: "安装", left: "pip install", right: "npm install" },
              { label: "异步", left: "AsyncAnthropic", right: "原生 async" },
              { label: "类型安全", left: "Pydantic", right: "TypeScript 类型" },
              { label: "流式 API", left: "with stream", right: ".stream()" },
            ],
          }),
        },
      ],
    },

    {
      slug: "messages-api-multi-turn",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "多轮对话消息结构",
          svg: layeredStack({
            title: "Messages API 消息结构",
            layers: [
              { label: "System Prompt", description: "系统指令（可选）", color: "#7c3aed" },
              { label: "User Message 1", description: "用户第一条消息", color: "#00d4ff" },
              { label: "Assistant Message 1", description: "Claude 回复", color: "#10b981" },
              { label: "User Message 2", description: "用户追问", color: "#00d4ff" },
              { label: "Assistant Message 2", description: "Claude 继续回复", color: "#10b981" },
            ],
          }),
        },
        {
          filename: "diagram-2.svg",
          caption: "stop_reason 处理",
          svg: pricingTable({
            title: "stop_reason 类型说明",
            headers: ["stop_reason", "含义", "处理方式"],
            rows: [
              { cells: ["end_turn", "正常结束", "直接使用回复"] },
              { cells: ["max_tokens", "达到上限", "可续写或截断"] },
              { cells: ["stop_sequence", "触发停止词", "按需处理"] },
              { cells: ["tool_use", "调用工具", "执行并返回结果"], highlight: true },
            ],
          }),
        },
      ],
    },

    {
      slug: "system-prompt-design",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "System Prompt 设计框架",
          svg: layeredStack({
            title: "System Prompt 四层设计框架",
            layers: [
              { label: "角色定义 (Role)", description: "你是一位资深...专家", color: "#00d4ff" },
              { label: "行为规则 (Rules)", description: "总是/永远不要...", color: "#7c3aed" },
              { label: "输出格式 (Format)", description: "JSON/Markdown/步骤", color: "#f59e0b" },
              { label: "防护栏 (Guardrails)", description: "边界+拒绝策略", color: "#ef4444" },
            ],
          }),
        },
      ],
    },

    {
      slug: "structured-output-json",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "结构化输出流程",
          svg: flowDiagram({
            title: "结构化输出 (Strict Mode) 流程",
            steps: [
              { label: "定义 Schema", description: "JSON Schema" },
              { label: "设置 Config", description: "output_config" },
              { label: "发送请求", description: "API 调用" },
              { label: "保证输出", description: "100% 合规" },
            ],
            color: "#00d4ff",
          }),
        },
        {
          filename: "diagram-2.svg",
          caption: "结构化输出 vs 传统方式",
          svg: comparisonChart({
            title: "结构化输出 vs Prompt 引导",
            leftLabel: "Prompt 引导",
            rightLabel: "Strict Mode",
            items: [
              { label: "合规率", left: "~85%", right: "100%" },
              { label: "需要解析", left: "是 (正则/JSON)", right: "否 (直接用)" },
              { label: "嵌套结构", left: "容易出错", right: "完美支持" },
              { label: "类型安全", left: "手动验证", right: "自动保证" },
              { label: "开发效率", left: "需要重试逻辑", right: "直接使用" },
            ],
            leftColor: "#f59e0b",
            rightColor: "#10b981",
          }),
        },
      ],
    },

    {
      slug: "citations-rag",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "RAG 系统架构",
          svg: flowDiagram({
            title: "RAG + Citations 架构",
            steps: [
              { label: "文档存储", description: "向量数据库" },
              { label: "检索匹配", description: "语义搜索" },
              { label: "上下文注入", description: "文档片段" },
              { label: "生成回答", description: "引用标注" },
            ],
            color: "#7c3aed",
          }),
        },
      ],
    },

    {
      slug: "tool-use-basics",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "Tool Use 调用循环",
          svg: flowDiagram({
            title: "Tool Use 调用循环",
            direction: "vertical",
            steps: [
              { label: "1. 发送消息 + 工具定义", description: "API 请求" },
              { label: "2. Claude 选择工具", description: "tool_use 响应" },
              { label: "3. 执行工具函数", description: "本地代码" },
              { label: "4. 返回 tool_result", description: "继续对话" },
              { label: "5. Claude 生成最终回答", description: "end_turn" },
            ],
            color: "#00d4ff",
          }),
        },
        {
          filename: "diagram-2.svg",
          caption: "工具定义结构",
          svg: layeredStack({
            title: "工具定义 Schema 结构",
            layers: [
              { label: "name", description: "工具名称 (snake_case)", color: "#00d4ff" },
              { label: "description", description: "功能描述 (越详细越好)", color: "#7c3aed" },
              { label: "input_schema", description: "JSON Schema 参数定义", color: "#10b981" },
              { label: "cache_control", description: "缓存控制 (可选)", color: "#f59e0b" },
            ],
          }),
        },
      ],
    },

    {
      slug: "web-search-scraping",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "联网 AI 架构",
          svg: flowDiagram({
            title: "联网 AI 工具链",
            steps: [
              { label: "用户查询", description: "自然语言" },
              { label: "Web Search", description: "搜索引擎" },
              { label: "Web Fetch", description: "页面抓取" },
              { label: "内容整合", description: "结构化数据" },
              { label: "回答生成", description: "引用来源" },
            ],
          }),
        },
      ],
    },

    {
      slug: "code-execution-tool",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "代码执行沙箱架构",
          svg: layeredStack({
            title: "Code Execution 沙箱架构",
            layers: [
              { label: "Claude API", description: "请求入口", color: "#00d4ff" },
              { label: "Tool Router", description: "工具路由", color: "#7c3aed" },
              { label: "Python Sandbox", description: "安全隔离环境", color: "#10b981" },
              { label: "执行结果", description: "stdout + 文件", color: "#f59e0b" },
            ],
          }),
        },
        {
          filename: "diagram-2.svg",
          caption: "代码执行适用场景",
          svg: barChart({
            title: "代码执行典型场景",
            items: [
              { label: "数据分析", value: 95, displayValue: "最常用" },
              { label: "数据可视化", value: 85, displayValue: "图表生成" },
              { label: "数学验证", value: 80, displayValue: "精确计算" },
              { label: "格式转换", value: 70, displayValue: "文件处理" },
              { label: "原型验证", value: 60, displayValue: "代码测试" },
            ],
            barColor: "#10b981",
          }),
        },
      ],
    },

    {
      slug: "files-api",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "Files API 使用流程",
          svg: flowDiagram({
            title: "Files API 使用流程",
            steps: [
              { label: "上传文件", description: "POST /files" },
              { label: "获取 file_id", description: "唯一标识" },
              { label: "在消息中引用", description: "content block" },
              { label: "多次复用", description: "跨对话使用" },
            ],
          }),
        },
      ],
    },

    {
      slug: "prompt-caching",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "Prompt 缓存原理",
          svg: flowDiagram({
            title: "Prompt Caching 工作原理",
            steps: [
              { label: "首次请求", description: "创建缓存" },
              { label: "前缀匹配", description: "命中缓存" },
              { label: "增量处理", description: "只算新 token" },
              { label: "节省 90%", description: "大幅降本" },
            ],
            color: "#10b981",
          }),
        },
        {
          filename: "diagram-2.svg",
          caption: "缓存成本对比",
          svg: barChart({
            title: "缓存 vs 非缓存成本 (Sonnet, 每 M tokens)",
            items: [
              { label: "非缓存输入", value: 3.0, displayValue: "$3.00" },
              { label: "缓存写入", value: 3.75, displayValue: "$3.75" },
              { label: "缓存命中", value: 0.3, displayValue: "$0.30" },
              { label: "输出", value: 15.0, displayValue: "$15.00" },
            ],
            barColor: "#00d4ff",
          }),
        },
      ],
    },

    {
      slug: "batch-processing",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "批量处理流程",
          svg: flowDiagram({
            title: "Message Batches API 流程",
            direction: "vertical",
            steps: [
              { label: "创建批量任务", description: "POST /messages/batches" },
              { label: "上传请求列表", description: "最多 100K 请求" },
              { label: "异步处理", description: "24h 内完成" },
              { label: "查询状态", description: "GET /batches/{id}" },
              { label: "获取结果", description: "逐条下载" },
            ],
          }),
        },
        {
          filename: "diagram-2.svg",
          caption: "批量处理 vs 实时调用",
          svg: comparisonChart({
            title: "批量 API vs 实时 API",
            leftLabel: "实时 API",
            rightLabel: "批量 API",
            items: [
              { label: "价格", left: "标准价", right: "省 50%" },
              { label: "延迟", left: "秒级", right: "24h 内" },
              { label: "并发", left: "受限流控", right: "无限" },
              { label: "适用场景", left: "交互式", right: "离线处理" },
            ],
            leftColor: "#f59e0b",
            rightColor: "#10b981",
          }),
        },
      ],
    },

    {
      slug: "token-management",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "Token 计费结构",
          svg: pricingTable({
            title: "Claude 4.6 Token 定价 (每百万 Token)",
            headers: ["Token 类型", "Opus", "Sonnet", "Haiku"],
            rows: [
              { cells: ["输入 Token", "$15", "$3", "$0.80"] },
              { cells: ["输出 Token", "$75", "$15", "$4"] },
              { cells: ["缓存写入", "$18.75", "$3.75", "$1"] },
              { cells: ["缓存命中", "$1.50", "$0.30", "$0.08"], highlight: true },
              { cells: ["批量输入", "$7.50", "$1.50", "$0.40"] },
              { cells: ["批量输出", "$37.50", "$7.50", "$2"] },
            ],
          }),
        },
        {
          filename: "diagram-2.svg",
          caption: "成本优化策略",
          svg: barChart({
            title: "各优化策略节省比例",
            items: [
              { label: "Prompt Caching", value: 90, displayValue: "节省 90%" },
              { label: "Batch API", value: 50, displayValue: "节省 50%" },
              { label: "Effort 参数", value: 40, displayValue: "节省 40%" },
              { label: "模型降级", value: 80, displayValue: "节省 80%" },
              { label: "Token 裁剪", value: 30, displayValue: "节省 30%" },
            ],
            barColor: "#f59e0b",
          }),
        },
      ],
    },

    {
      slug: "python-sdk-project",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "智能文档问答助手架构",
          svg: layeredStack({
            title: "智能文档问答助手架构",
            layers: [
              { label: "CLI 用户界面", description: "Rich 终端渲染", color: "#00d4ff" },
              { label: "对话管理器", description: "多轮上下文维护", color: "#7c3aed" },
              { label: "工具调用层", description: "文件读取+搜索", color: "#10b981" },
              { label: "Anthropic SDK", description: "API 通信", color: "#f59e0b" },
              { label: "Claude API", description: "AI 推理引擎", color: "#ef4444" },
            ],
          }),
        },
      ],
    },

    {
      slug: "typescript-sdk-project",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "Next.js AI 聊天应用架构",
          svg: layeredStack({
            title: "Next.js AI 聊天应用架构",
            layers: [
              { label: "React 前端", description: "聊天 UI + 流式渲染", color: "#00d4ff" },
              { label: "Next.js API Routes", description: "/api/chat 端点", color: "#7c3aed" },
              { label: "@anthropic-ai/sdk", description: "TypeScript SDK", color: "#10b981" },
              { label: "Claude API", description: "消息处理 + 工具调用", color: "#f59e0b" },
            ],
          }),
        },
      ],
    },

    {
      slug: "error-handling-rate-limits",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "错误处理策略",
          svg: pricingTable({
            title: "Claude API 错误码与处理策略",
            headers: ["状态码", "含义", "重试策略"],
            rows: [
              { cells: ["400", "请求格式错误", "修复后重试"] },
              { cells: ["401", "认证失败", "检查 API Key"] },
              { cells: ["429", "速率限制", "指数退避重试"], highlight: true },
              { cells: ["500", "服务器错误", "等待后重试"] },
              { cells: ["529", "过载", "较长等待重试"], highlight: true },
            ],
          }),
        },
        {
          filename: "diagram-2.svg",
          caption: "指数退避流程",
          svg: flowDiagram({
            title: "指数退避重试策略",
            steps: [
              { label: "请求失败", description: "捕获错误" },
              { label: "等待 1s", description: "第 1 次" },
              { label: "等待 2s", description: "第 2 次" },
              { label: "等待 4s", description: "第 3 次" },
              { label: "放弃/告警", description: "达到上限" },
            ],
            color: "#ef4444",
          }),
        },
      ],
    },

    // ══════════════════════════════════════════════════════════════════════════
    //  ADVANCED SERIES (14 articles)
    // ══════════════════════════════════════════════════════════════════════════

    {
      slug: "agent-architecture",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "Agent 四层架构",
          svg: layeredStack({
            title: "AI Agent 四层架构",
            layers: [
              { label: "Skills 层", description: "专业能力模块", color: "#f59e0b" },
              { label: "MCP 协议层", description: "外部工具连接", color: "#7c3aed" },
              { label: "Runtime 运行时", description: "执行环境+状态", color: "#00d4ff" },
              { label: "Agent Loop 核心", description: "自主决策循环", color: "#10b981" },
            ],
          }),
        },
        {
          filename: "diagram-2.svg",
          caption: "Agent 决策循环",
          svg: flowDiagram({
            title: "Agent 自主决策循环",
            direction: "vertical",
            steps: [
              { label: "接收任务", description: "用户指令或事件" },
              { label: "分析规划", description: "拆解子任务" },
              { label: "选择工具", description: "匹配最佳工具" },
              { label: "执行动作", description: "调用工具/生成" },
              { label: "评估结果", description: "是否完成?" },
              { label: "迭代/完成", description: "继续或返回" },
            ],
            color: "#7c3aed",
          }),
        },
      ],
    },

    {
      slug: "multi-tool-orchestration",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "多工具编排策略",
          svg: tierCards({
            title: "多工具编排三大策略",
            cards: [
              { label: "工具搜索", icon: "🔍", items: ["动态加载", "语义匹配", "按需注入"], color: "#00d4ff" },
              { label: "工具组合", icon: "🔗", items: ["串行调用", "并行执行", "条件分支"], color: "#7c3aed" },
              { label: "错误恢复", icon: "🛡️", items: ["重试机制", "降级方案", "人工介入"], color: "#f59e0b" },
            ],
          }),
        },
      ],
    },

    {
      slug: "computer-use-agent",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "Computer Use 工作流",
          svg: flowDiagram({
            title: "Computer Use 操作循环",
            direction: "vertical",
            steps: [
              { label: "截屏识别", description: "获取屏幕状态" },
              { label: "分析界面", description: "理解 UI 元素" },
              { label: "规划操作", description: "决定下一步" },
              { label: "执行动作", description: "点击/输入/拖拽" },
              { label: "验证结果", description: "截屏确认" },
            ],
            color: "#00d4ff",
          }),
        },
        {
          filename: "diagram-2.svg",
          caption: "Computer Use 三大工具",
          svg: tierCards({
            title: "Computer Use 内置工具",
            cards: [
              { label: "computer", icon: "🖥️", items: ["截屏", "鼠标操作", "键盘输入", "坐标定位"], color: "#00d4ff" },
              { label: "text_editor", icon: "📝", items: ["文件读写", "内容替换", "代码编辑"], color: "#7c3aed" },
              { label: "bash", icon: "💻", items: ["命令执行", "脚本运行", "系统操作"], color: "#10b981" },
            ],
          }),
        },
      ],
    },

    {
      slug: "mcp-protocol",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "MCP 协议架构",
          svg: layeredStack({
            title: "MCP 协议三层架构",
            layers: [
              { label: "MCP Client (Host)", description: "Claude Code / IDE 插件", color: "#00d4ff" },
              { label: "MCP Protocol", description: "JSON-RPC 双向通信", color: "#7c3aed" },
              { label: "MCP Server", description: "工具+资源+Prompt 提供", color: "#10b981" },
              { label: "外部服务", description: "数据库/API/文件系统", color: "#f59e0b" },
            ],
          }),
        },
      ],
    },

    {
      slug: "agent-skills",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "Agent Skills 能力矩阵",
          svg: featureGrid({
            title: "Agent Skills 能力矩阵",
            columns: ["读取", "生成", "编辑"],
            rows: [
              { feature: "PDF 文档", values: ["yes", "no", "no"] },
              { feature: "Word 文档", values: ["yes", "yes", "yes"] },
              { feature: "Excel 表格", values: ["yes", "yes", "yes"] },
              { feature: "PowerPoint", values: ["yes", "yes", "partial"] },
              { feature: "代码文件", values: ["yes", "yes", "yes"] },
              { feature: "图片文件", values: ["yes", "partial", "no"] },
            ],
          }),
        },
      ],
    },

    {
      slug: "memory-system",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "记忆系统架构",
          svg: layeredStack({
            title: "Claude 记忆系统三层架构",
            layers: [
              { label: "工作记忆", description: "当前对话上下文 (200K)", color: "#00d4ff" },
              { label: "短期记忆", description: "CLAUDE.md 项目指令", color: "#7c3aed" },
              { label: "长期记忆", description: "Memory Tool 持久存储", color: "#10b981" },
            ],
          }),
        },
        {
          filename: "diagram-2.svg",
          caption: "记忆管理策略",
          svg: flowDiagram({
            title: "记忆管理最佳实践",
            steps: [
              { label: "信息获取", description: "对话中学习" },
              { label: "判断价值", description: "是否值得记?" },
              { label: "分类存储", description: "按主题组织" },
              { label: "定期清理", description: "删除过期信息" },
            ],
            color: "#10b981",
          }),
        },
      ],
    },

    {
      slug: "long-context-window",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "上下文窗口大小对比",
          svg: barChart({
            title: "各模型上下文窗口对比",
            items: [
              { label: "GPT-4o", value: 128, displayValue: "128K" },
              { label: "Claude 3.5", value: 200, displayValue: "200K" },
              { label: "Gemini 1.5", value: 1000, displayValue: "1M" },
              { label: "Claude (Beta)", value: 1000, displayValue: "1M" },
            ],
            barColor: "#7c3aed",
          }),
        },
      ],
    },

    {
      slug: "context-management",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "上下文管理三件套",
          svg: tierCards({
            title: "上下文管理三大策略",
            cards: [
              { label: "Compaction", icon: "📦", items: ["自动压缩", "保留关键信息", "节省 token"], color: "#00d4ff" },
              { label: "Context Editing", icon: "✂️", items: ["自动裁剪", "优先级排序", "动态调整"], color: "#7c3aed" },
              { label: "Prompt Caching", icon: "💾", items: ["前缀缓存", "复用计算", "降低成本"], color: "#10b981" },
            ],
          }),
        },
      ],
    },

    {
      slug: "streaming-tool-streaming",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "流式输出事件类型",
          svg: timeline({
            title: "SSE 流式事件序列",
            events: [
              { label: "message_start", description: "消息开始", tag: "初始" },
              { label: "content_block_start", description: "内容块开始", tag: "块" },
              { label: "content_block_delta", description: "增量文本", tag: "数据" },
              { label: "content_block_stop", description: "内容块结束", tag: "块" },
              { label: "message_delta", description: "消息元数据更新", tag: "元" },
              { label: "message_stop", description: "消息完成", tag: "结束" },
            ],
            color: "#00d4ff",
          }),
        },
      ],
    },

    {
      slug: "programmatic-tool-calling",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "编程式工具调用架构",
          svg: comparisonChart({
            title: "标准 Tool Use vs 编程式调用",
            leftLabel: "标准 Tool Use",
            rightLabel: "编程式调用",
            items: [
              { label: "执行位置", left: "客户端", right: "容器内" },
              { label: "网络往返", left: "每次工具调用", right: "无需往返" },
              { label: "延迟", left: "高 (多次 API)", right: "低 (单次)" },
              { label: "安全模型", left: "客户端控制", right: "沙箱隔离" },
              { label: "适��场景", left: "外部 API", right: "计算密集" },
            ],
            leftColor: "#f59e0b",
            rightColor: "#10b981",
          }),
        },
      ],
    },

    {
      slug: "cloud-deployment",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "三大云平台对比",
          svg: featureGrid({
            title: "云平台 Claude 集成对比",
            columns: ["Bedrock", "Vertex AI", "Azure"],
            rows: [
              { feature: "Opus 4.6", values: ["yes", "yes", "partial"] },
              { feature: "Sonnet 4.6", values: ["yes", "yes", "yes"] },
              { feature: "Tool Use", values: ["yes", "yes", "yes"] },
              { feature: "流式输出", values: ["yes", "yes", "yes"] },
              { feature: "Batch API", values: ["yes", "partial", "no"] },
              { feature: "Computer Use", values: ["partial", "partial", "no"] },
            ],
          }),
        },
      ],
    },

    {
      slug: "cost-optimization",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "成本优化策略金字塔",
          svg: layeredStack({
            title: "成本优化策略优先级",
            layers: [
              { label: "1. Prompt Caching", description: "节省 90% 重复成本", color: "#10b981" },
              { label: "2. Batch API", description: "离线任务省 50%", color: "#00d4ff" },
              { label: "3. 模型选择", description: "Haiku 替代 Sonnet", color: "#7c3aed" },
              { label: "4. Effort 参数", description: "减少��考 token", color: "#f59e0b" },
              { label: "5. Token 优化", description: "精简 Prompt", color: "#ef4444" },
            ],
          }),
        },
        {
          filename: "diagram-2.svg",
          caption: "月度成本对比",
          svg: barChart({
            title: "优化前后月度成本 (10K 请求/天)",
            items: [
              { label: "未优化", value: 5000, displayValue: "$5,000" },
              { label: "+缓存", value: 2000, displayValue: "$2,000" },
              { label: "+批量", value: 1200, displayValue: "$1,200" },
              { label: "+模型降级", value: 500, displayValue: "$500" },
              { label: "全面优化", value: 300, displayValue: "$300" },
            ],
            barColor: "#10b981",
          }),
        },
      ],
    },

    {
      slug: "claude-code-deep-dive",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "Claude Code 架构",
          svg: layeredStack({
            title: "Claude Code 架构全景",
            layers: [
              { label: "Skills 技能", description: "commit/review/pdf", color: "#f59e0b" },
              { label: "Hooks 钩子", description: "自动化事件响应", color: "#7c3aed" },
              { label: "MCP Servers", description: "外部工具连接", color: "#00d4ff" },
              { label: "Sub-Agent 多智能体", description: "并行任务处理", color: "#10b981" },
              { label: "Agent Loop", description: "核心决策引擎", color: "#ef4444" },
            ],
          }),
        },
        {
          filename: "diagram-2.svg",
          caption: "Claude Code 工作流",
          svg: flowDiagram({
            title: "Claude Code 开发工作流",
            steps: [
              { label: "理解需求", description: "读代码+分析" },
              { label: "制定计划", description: "Plan Mode" },
              { label: "编写代码", description: "Edit/Write" },
              { label: "测试验证", description: "运行测试" },
              { label: "提交代码", description: "/commit" },
            ],
            color: "#00d4ff",
          }),
        },
      ],
    },

    {
      slug: "production-agent-project",
      illustrations: [
        {
          filename: "diagram-1.svg",
          caption: "生产级 Agent 架构",
          svg: layeredStack({
            title: "生产级 Agent 系统架构",
            layers: [
              { label: "监控告警", description: "日志+指标+Trace", color: "#ef4444" },
              { label: "安全防护", description: "输入过滤+输出审查", color: "#f59e0b" },
              { label: "错误恢复", description: "重试+降级+断路器", color: "#7c3aed" },
              { label: "工具编排", description: "多工具协调执行", color: "#00d4ff" },
              { label: "核心 Agent", description: "决策循环引擎", color: "#10b981" },
            ],
          }),
        },
        {
          filename: "diagram-2.svg",
          caption: "Agent 开发清单",
          svg: timeline({
            title: "生产级 Agent 开发路线图",
            events: [
              { label: "需求分析", description: "定义 Agent 的目标和边界", tag: "Week 1" },
              { label: "架构设计", description: "工具定义+错误处理", tag: "Week 2" },
              { label: "核心开发", description: "Agent Loop + 工具集成", tag: "Week 3" },
              { label: "安全加固", description: "输入验证+防护栏", tag: "Week 4" },
              { label: "测试部署", description: "压测+灰度+监控", tag: "Week 5" },
            ],
            color: "#7c3aed",
          }),
        },
      ],
    },
  ];
}

// ─── Main logic ──────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const targetSlug = args.find((a) => !a.startsWith("--"));

  // Validate env (unless dry run)
  if (!dryRun) {
    for (const key of ["TENCENT_SECRET_ID", "TENCENT_SECRET_KEY", "TENCENT_COS_BUCKET", "TENCENT_COS_REGION"]) {
      if (!process.env[key]) {
        console.error("Missing env: " + key);
        process.exit(1);
      }
    }
  }

  const cos = dryRun ? (null as any) : getCOS();
  const baseUrl = process.env.NEXT_PUBLIC_COS_BASE_URL || "https://" + process.env.TENCENT_COS_BUCKET + ".cos." + process.env.TENCENT_COS_REGION + ".myqcloud.com";

  let allArticles = getAllArticleIllustrations();
  if (targetSlug) {
    allArticles = allArticles.filter((a) => a.slug === targetSlug);
    if (allArticles.length === 0) {
      console.error("Article not found: " + targetSlug);
      process.exit(1);
    }
  }

  console.log("Processing " + allArticles.length + " articles" + (dryRun ? " (DRY RUN)" : "") + "...\n");

  let totalSvgs = 0;
  let totalUpdated = 0;

  for (const article of allArticles) {
    console.log("── " + article.slug + " (" + article.illustrations.length + " SVGs) ──");

    // 1. Save SVGs to disk
    const slugDir = join(ILLUSTRATIONS_DIR, article.slug);
    mkdirSync(slugDir, { recursive: true });

    const svgUrls: { caption: string; url: string }[] = [];

    for (const ill of article.illustrations) {
      const localPath = join(slugDir, ill.filename);
      writeFileSync(localPath, ill.svg, "utf-8");
      console.log("  SAVE: " + ill.filename);

      // 2. Upload to COS
      const cosKey = "illustrations/" + article.slug + "/" + ill.filename;
      let url: string;

      if (dryRun) {
        url = baseUrl + "/" + cosKey;
        console.log("  SKIP UPLOAD (dry run): " + cosKey);
      } else {
        const buffer = Buffer.from(ill.svg, "utf-8");
        url = await uploadBuffer(cos, buffer, cosKey);
        console.log("  UPLOAD: " + url);
      }

      svgUrls.push({ caption: ill.caption, url });
      totalSvgs++;
    }

    // 3. Insert SVG references into article content
    if (!dryRun && svgUrls.length > 0) {
      const dbArticle = await prisma.article.findUnique({ where: { slug: article.slug } });
      if (!dbArticle) {
        console.log("  WARN: article not in DB, skipping content update");
        continue;
      }

      let content = dbArticle.content;

      // Build markdown image references
      const imageMarkdown = svgUrls
        .map((s) => "\n![" + s.caption + "](" + s.url + ")\n")
        .join("\n");

      // Insert after first ## heading (after intro paragraph)
      const firstH2 = content.indexOf("\n## ");
      if (firstH2 > 0) {
        // Find end of the first h2 line
        const endOfH2Line = content.indexOf("\n", firstH2 + 1);
        if (endOfH2Line > 0) {
          // Check if SVG images are already inserted
          if (!content.includes("illustrations/" + article.slug + "/")) {
            content =
              content.slice(0, endOfH2Line + 1) +
              "\n" + imageMarkdown + "\n" +
              content.slice(endOfH2Line + 1);

            await prisma.article.update({
              where: { slug: article.slug },
              data: { content },
            });
            console.log("  DB: content updated with " + svgUrls.length + " SVG references");
            totalUpdated++;
          } else {
            console.log("  DB: SVGs already in content, skipping");
          }
        }
      } else {
        console.log("  WARN: no ## heading found, skipping content update");
      }
    }

    console.log("");
  }

  console.log("Done: " + totalSvgs + " SVGs generated, " + totalUpdated + " articles updated.");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Failed:", err);
  prisma.$disconnect();
  process.exit(1);
});
