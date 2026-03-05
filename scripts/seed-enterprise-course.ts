/**
 * Seed script: Insert "AI 企业定制方案" course with chapters.
 *
 * Usage: npx tsx scripts/seed-enterprise-course.ts
 *
 * Creates the enterprise course and 6 chapters.
 * Uses upsert to avoid duplicates if run multiple times.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COURSE_SLUG = "ai-enterprise-custom";

const courseData = {
  slug: COURSE_SLUG,
  title: "AI 企业定制方案 — 让团队效率翻倍",
  description:
    "为企业量身打造的 AI 落地方案，涵盖团队培训、工作流重塑和专属 AI 工具定制，助力企业快速实现 AI 赋能，显著提升团队生产力。",
  price: 599900, // ¥5,999 in cents
  coverUrl: "/courses/ai-enterprise-custom.svg",
  content: `## 为什么企业需要定制化 AI 培训？

通用的 AI 课程只能教会员工"怎么用 AI"，但无法解决**你的企业**面临的具体问题。我们的企业定制方案从**业务场景出发**，为你的团队量身打造一套可落地、可度量的 AI 工作体系。

## 课程包含什么？

### 模块一：AI 能力诊断与规划（2天）
- 深入了解企业现有工作流和痛点
- 识别 AI 可替代 / 可辅助的高价值环节
- 输出《企业 AI 落地路线图》

### 模块二：团队 AI 技能培训（3天）
- 按岗位定制 Prompt 模板库（运营 / 销售 / 产品 / 技术）
- 实战工作坊：用真实工作任务进行 AI 协作训练
- Claude / ChatGPT / 国产大模型全覆盖，不绑定单一工具

### 模块三：AI 工作流落地（2天）
- 搭建团队专属 AI 知识库与 Prompt 资产库
- 将 AI 融入现有工具链（飞书 / 钉钉 / 企业微信 / Notion）
- 自动化工作流设计：周报生成、数据分析、客户跟进、内容创作

### 模块四：专属 AI 工具开发（可选）
- 基于企业需求定制 AI Agent / 智能助手
- API 集成方案设计与实施
- 内部知识库 RAG 系统搭建

### 模块五：持续跟踪与优化（1个月）
- 每周一次线上答疑与复盘
- 效果数据跟踪与优化建议
- 团队 AI 使用报告

## 预期效果

| 指标 | 目标 |
|------|------|
| 团队 AI 使用率 | 从 < 20% 提升至 > 80% |
| 重复性工作耗时 | 减少 40%~60% |
| 内容产出效率 | 提升 3~5 倍 |
| 人均工作产出 | 提升 30% 以上 |

## 适合哪些企业？

- 10~500 人规模的中小企业
- 希望系统性导入 AI 而非零散尝试的团队
- 有明确效率提升诉求的运营、营销、产品团队
- 正在数字化转型、寻找 AI 切入点的传统企业

## 服务形式

- **线下授课 + 远程跟踪**，覆盖一二线城市
- 支持 **5~50 人** 团队规模
- 培训周期 **7~14 天**（含 1 个月跟踪期）
- 提供完整培训材料和企业专属文档`,
};

interface ChapterDef {
  index: number;
  title: string;
  isFree: boolean;
  duration: number;
  content: string;
}

const chapters: ChapterDef[] = [
  {
    index: 1,
    title: "企业 AI 转型概览：为什么现在是最佳时机",
    isFree: true,
    duration: 15,
    content: `## 企业 AI 转型概览

2024-2025 年是企业 AI 落地的分水岭。大语言模型能力飞速迭代，成本持续下降，落地门槛大幅降低。本章将帮助你理解：

### 本章要点
- **AI 技术成熟度**：从 GPT-4 到 Claude 4，大模型已具备处理复杂业务场景的能力
- **成本优势**：API 调用成本较两年前下降超过 90%，中小企业也能用得起
- **竞争压力**：同行已在用 AI 降本增效，不行动就是落后
- **人才缺口**：AI 应用人才供不应求，内部培养是最快路径

### 案例分享
- 某电商团队引入 AI 后，客服响应效率提升 300%
- 某咨询公司用 AI 辅助研究分析，项目交付周期缩短 40%
- 某内容团队借助 AI 工作流，月产出量翻 5 倍`,
  },
  {
    index: 2,
    title: "AI 能力诊断：找到你的高价值场景",
    isFree: true,
    duration: 20,
    content: `## AI 能力诊断

不是所有业务环节都适合用 AI。本章教你用系统化方法找到 ROI 最高的 AI 应用场景。

### 诊断框架
1. **业务流程梳理**：列出团队核心工作流的每一个环节
2. **AI 适配评估**：用「重复性 × 耗时 × 标准化程度」三维矩阵评分
3. **优先级排序**：从高分场景开始，快速验证 AI 价值

### 常见高价值场景
- **内容生产**：文案、报告、方案撰写 → AI 辅助起草 + 人工审核
- **数据分析**：报表解读、趋势预测 → AI 自动生成分析报告
- **客户服务**：常见问题回复、工单分类 → AI 智能分流 + 辅助回复
- **知识管理**：文档检索、经验沉淀 → AI 驱动的企业知识库

### 实操练习
以你自己的团队为例，完成一份 AI 能力诊断表，输出 Top 3 优先落地场景。`,
  },
  {
    index: 3,
    title: "团队 Prompt 工程：按岗位定制 AI 协作模板",
    isFree: false,
    duration: 25,
    content: `## 团队 Prompt 工程

通用 Prompt 无法满足企业需求。本章将教你如何为不同岗位设计专属 Prompt 模板。

### 岗位模板设计原则
1. **角色锚定**：明确 AI 在该岗位的角色定位（助手 / 审核者 / 创作者）
2. **输出标准化**：统一格式和质量要求，确保团队产出一致
3. **上下文预设**：将企业知识、品牌调性、行业术语预置到模板中

### 分岗位模板示例

**运营岗**
- 活动方案生成器：输入目标 + 预算 → 输出完整活动方案
- 社媒内容日历：输入主题 + 平台 → 输出一周内容排期

**销售岗**
- 客户跟进话术：输入客户画像 + 阶段 → 输出个性化跟进方案
- 竞品分析：输入竞品信息 → 输出结构化对比报告

**产品岗**
- 需求文档助手：输入用户反馈 → 输出 PRD 初稿
- 用户故事生成：输入功能描述 → 输出完整用户故事

**技术岗**
- 代码审查辅助：提交代码 → AI 输出 Review 建议
- 技术方案评审：输入需求 → 输出技术方案对比`,
  },
  {
    index: 4,
    title: "AI 工作流实战：从周报到客户分析的自动化",
    isFree: false,
    duration: 30,
    content: `## AI 工作流实战

学会 Prompt 只是起点，真正的效率提升来自将 AI 融入工作流。本章通过 4 个真实场景，手把手搭建自动化工作流。

### 场景一：智能周报生成
- 输入：本周工作日志 / 聊天记录 / 项目进展
- 处理：AI 自动提取关键成果 + 生成结构化周报
- 输出：格式统一的周报，直接发送

### 场景二：客户画像分析
- 输入：CRM 数据 + 沟通记录
- 处理：AI 分析客户特征、购买意向、流失风险
- 输出：客户分层报告 + 个性化跟进建议

### 场景三：会议纪要自动化
- 输入：会议录音 / 文字记录
- 处理：AI 提取关键决策、待办事项、责任人
- 输出：结构化会议纪要 + 待办清单

### 场景四：内容批量生产
- 输入：核心观点 + 目标平台
- 处理：AI 生成多平台适配内容（公众号 / 小红书 / 抖音脚本）
- 输出：一稿多投的完整内容包

### 工具集成
- 飞书 / 钉钉机器人 + AI API
- 企业微信 + 自动化工作流
- Notion / 语雀 + AI 插件`,
  },
  {
    index: 5,
    title: "专属工具开发：AI Agent 与知识库搭建",
    isFree: false,
    duration: 25,
    content: `## 专属工具开发

当标准 AI 工具无法满足需求时，定制开发是最终解决方案。本章介绍三种企业 AI 工具的构建方式。

### 方案一：企业知识库（RAG）
- 将内部文档、Wiki、历史邮件等结构化为 AI 可检索的知识库
- 员工提问 → AI 基于企业知识库回答，而非通用知识
- 技术栈：向量数据库 + Embedding + Claude API

### 方案二：AI Agent（智能助手）
- 自主完成多步骤任务的 AI 程序
- 示例：自动收集竞品信息 → 分析 → 生成报告 → 发送邮件
- 适用场景：重复性高、流程固定、需要多系统协作的任务

### 方案三：业务集成
- 将 AI 能力嵌入现有业务系统
- CRM 集成：自动生成客户沟通建议
- ERP 集成：智能库存预测与补货建议
- OA 集成：自动化审批流程辅助

### 实施路径
1. 需求评审 → 确定 MVP 范围
2. 原型开发 → 2~4 周交付可用版本
3. 试运行 → 收集反馈优化
4. 全面推广 → 持续迭代`,
  },
  {
    index: 6,
    title: "持续优化：如何度量 AI 投入产出比",
    isFree: false,
    duration: 20,
    content: `## 持续优化与效果度量

AI 落地不是一次性项目，而是持续优化的过程。本章教你建立一套可量化的 AI 效果评估体系。

### 核心度量指标

**效率指标**
- 任务完成时间：AI 辅助前后对比
- 人均产出量：内容 / 方案 / 代码的产出数量变化
- 重复工作占比：AI 替代后的释放比例

**质量指标**
- 输出质量评分：客户满意度 / 内部评审分数
- 错误率变化：AI 辅助后的失误率对比
- 创新产出：AI 激发的新想法和新方案数量

**成本指标**
- API 调用成本 vs 节省的人力成本
- 培训投入 vs 效率提升的经济价值
- ROI 计算公式与案例

### 持续优化框架
1. **月度复盘**：分析 AI 使用数据，识别低效环节
2. **模板迭代**：根据实际效果优化 Prompt 模板库
3. **能力扩展**：逐步将 AI 应用到更多业务场景
4. **知识沉淀**：将最佳实践固化为团队标准流程

### 常见问题与应对
- "员工不愿意用" → 从痛点场景切入，让员工尝到甜头
- "效果不如预期" → 检查 Prompt 质量和场景适配度
- "担心数据安全" → 企业私有化部署方案
- "AI 生成内容有误" → 建立人机协作审核机制`,
  },
];

async function main() {
  console.log("Seeding enterprise course...");

  // Upsert course
  const course = await prisma.course.upsert({
    where: { slug: COURSE_SLUG },
    update: {
      title: courseData.title,
      description: courseData.description,
      price: courseData.price,
      coverUrl: courseData.coverUrl,
      content: courseData.content,
      totalChapters: chapters.length,
    },
    create: {
      slug: courseData.slug,
      title: courseData.title,
      description: courseData.description,
      price: courseData.price,
      coverUrl: courseData.coverUrl,
      content: courseData.content,
      totalChapters: chapters.length,
      publishedAt: new Date(),
    },
  });

  console.log(`  Course: ${course.title} → ${course.id}`);

  // Upsert chapters
  for (const ch of chapters) {
    const existing = await prisma.chapter.findFirst({
      where: { courseId: course.id, index: ch.index },
    });

    if (existing) {
      await prisma.chapter.update({
        where: { id: existing.id },
        data: {
          title: ch.title,
          content: ch.content,
          isFree: ch.isFree,
          duration: ch.duration,
        },
      });
      console.log(`  Updated chapter ${ch.index}: ${ch.title}`);
    } else {
      await prisma.chapter.create({
        data: {
          courseId: course.id,
          index: ch.index,
          title: ch.title,
          content: ch.content,
          videoId: "",
          isFree: ch.isFree,
          duration: ch.duration,
        },
      });
      console.log(`  Created chapter ${ch.index}: ${ch.title}`);
    }
  }

  console.log("\nDone! Enterprise course seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
