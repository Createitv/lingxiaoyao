import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "30天学习CSR — Claude 学习路线",
  description:
    "30天系统学习 Claude，从零基础到高效使用。每天一个任务，循序渐进掌握 AI 对话技巧。",
};

interface DayTask {
  day: number;
  title: string;
  description: string;
  slug?: string; // link to article if exists
  type: "article" | "practice" | "review" | "project";
}

const STUDY_PLAN: { week: string; subtitle: string; days: DayTask[] }[] = [
  {
    week: "Week 1",
    subtitle: "基础认知",
    days: [
      {
        day: 1,
        title: "Claude 是什么？能做什么？",
        description: "了解 Claude 的核心能力、使用场景和与其他 AI 的区别。",
        slug: "what-is-claude",
        type: "article",
      },
      {
        day: 2,
        title: "三个模型怎么选",
        description: "理解 Opus、Sonnet、Haiku 的差异，学会按需选择模型。",
        slug: "choose-model",
        type: "article",
      },
      {
        day: 3,
        title: "第一次和 Claude 对话",
        description: "学习正确的对话方式，完成你的第一次高质量交互。",
        slug: "first-conversation",
        type: "article",
      },
      {
        day: 4,
        title: "Prompt 基础：如何提出好问题",
        description: "掌握 Prompt 的 4 个核心要素：角色、任务、背景、格式。",
        slug: "prompt-basics",
        type: "article",
      },
      {
        day: 5,
        title: "自由对话练习",
        description:
          "用前 4 天学到的技巧，尝试 5 个不同场景的对话练习。",
        type: "practice",
      },
      {
        day: 6,
        title: "让 Claude 按格式输出",
        description: "学会让 Claude 输出表格、列表、JSON 等结构化格式。",
        slug: "format-output",
        type: "article",
      },
      {
        day: 7,
        title: "第一周复习与总结",
        description: "回顾基础概念，完成综合练习测试。",
        type: "review",
      },
    ],
  },
  {
    week: "Week 2",
    subtitle: "多模态能力",
    days: [
      {
        day: 8,
        title: "让 Claude 读图",
        description: "图片理解实战：截图分析、表格识别、图表解读。",
        slug: "claude-vision",
        type: "article",
      },
      {
        day: 9,
        title: "让 Claude 读 PDF",
        description: "文档分析实战：合同审阅、论文摘要、报告提取。",
        slug: "claude-pdf-analysis",
        type: "article",
      },
      {
        day: 10,
        title: "让 Claude 搜索网络",
        description: "学会让 Claude 获取实时信息，告别知识截止日期。",
        slug: "web-search-intro",
        type: "article",
      },
      {
        day: 11,
        title: "多模态综合练习",
        description:
          "结合图片、PDF 和网络搜索，完成一个真实工作场景任务。",
        type: "practice",
      },
      {
        day: 12,
        title: "Prompt 模板：职场写作篇",
        description: "邮件、报告、公文写作的即用 Prompt 模板。",
        slug: "prompt-templates-writing",
        type: "article",
      },
      {
        day: 13,
        title: "Prompt 模板：数据分析篇",
        description: "Excel 处理、数据可视化建议、趋势分析模板。",
        slug: "prompt-templates-data",
        type: "article",
      },
      {
        day: 14,
        title: "第二周复习与总结",
        description: "回顾多模态能力，整理个人 Prompt 模板库。",
        type: "review",
      },
    ],
  },
  {
    week: "Week 3",
    subtitle: "进阶技巧",
    days: [
      {
        day: 15,
        title: "Prompt 模板：学习总结篇",
        description: "读书笔记、知识梳理、学习计划生成模板。",
        slug: "prompt-templates-learning",
        type: "article",
      },
      {
        day: 16,
        title: "扩展思考：深度推理",
        description: "让 Claude 进行深度分析和多步推理的高级技巧。",
        slug: "extended-thinking",
        type: "article",
      },
      {
        day: 17,
        title: "技巧组合练习",
        description:
          "将所有学到的技巧组合使用，处理一个完整的工作项目。",
        type: "practice",
      },
      {
        day: 18,
        title: "项目实战 Day 1：需求分析",
        description:
          "选择一个实际工作问题，用 Claude 进行需求拆解和方案设计。",
        type: "project",
      },
      {
        day: 19,
        title: "项目实战 Day 2：内容生产",
        description:
          "使用 Claude 完成项目的主体内容创作和数据处理。",
        type: "project",
      },
      {
        day: 20,
        title: "项目实战 Day 3：优化迭代",
        description:
          "对产出物进行迭代优化，学习多轮对话的高效技巧。",
        type: "project",
      },
      {
        day: 21,
        title: "第三周复习与总结",
        description: "项目复盘，总结进阶技巧的最佳实践。",
        type: "review",
      },
    ],
  },
  {
    week: "Week 4",
    subtitle: "融会贯通",
    days: [
      {
        day: 22,
        title: "建立个人 Prompt 库",
        description:
          "整理你的高频使用场景，创建可复用的 Prompt 模板库。",
        type: "practice",
      },
      {
        day: 23,
        title: "工作流自动化探索",
        description:
          "探索如何将 Claude 融入日常工作流，减少重复劳动。",
        type: "practice",
      },
      {
        day: 24,
        title: "复杂任务拆解",
        description:
          "学习如何将大型复杂任务拆解为 Claude 可处理的子任务。",
        type: "practice",
      },
      {
        day: 25,
        title: "毕业项目 Day 1：选题与规划",
        description:
          "选择一个有挑战性的项目，制定完整的 AI 辅助执行计划。",
        type: "project",
      },
      {
        day: 26,
        title: "毕业项目 Day 2：执行与实现",
        description: "全面运用所学技巧，完成项目核心部分。",
        type: "project",
      },
      {
        day: 27,
        title: "毕业项目 Day 3：打磨与交付",
        description: "润色产出物，准备项目展示。",
        type: "project",
      },
      {
        day: 28,
        title: "学习成果回顾",
        description:
          "回顾 28 天的学习历程，记录核心收获和待提升方向。",
        type: "review",
      },
      {
        day: 29,
        title: "进阶学习路线",
        description:
          "了解 Claude API 开发、Agent 构建等进阶方向，规划下一步。",
        type: "review",
      },
      {
        day: 30,
        title: "毕业：你的 AI 学习宣言",
        description:
          "撰写你的 AI 学习心得，分享给社区，开启持续成长之路。",
        type: "review",
      },
    ],
  },
];

const typeConfig = {
  article: {
    label: "阅读",
    color:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  practice: {
    label: "练习",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  review: {
    label: "复习",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  project: {
    label: "项目",
    color:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    dot: "bg-violet-500",
  },
};

export default function StudyPlanPage() {
  return (
    <div className="px-6 py-8 lg:px-10 max-w-4xl">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M3 10h18" />
            </svg>
            30 天计划
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          30天学习CSR
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          CSR = Claude Study Roadmap。从零基础到高效使用，每天一个任务，30
          天系统掌握 Claude 对话技巧。
        </p>

        {/* Legend */}
        <div className="mt-5 flex flex-wrap gap-3">
          {Object.entries(typeConfig).map(([key, cfg]) => (
            <span
              key={key}
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-12">
        {STUDY_PLAN.map((section) => (
          <section key={section.week}>
            {/* Week header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-bold">
                {section.week.replace("Week ", "W")}
              </div>
              <div>
                <h2 className="font-semibold text-lg leading-tight">
                  {section.week}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {section.subtitle}
                </p>
              </div>
            </div>

            {/* Day cards */}
            <div className="relative ml-5 border-l-2 border-border pl-6 space-y-4">
              {section.days.map((task) => {
                const cfg = typeConfig[task.type];
                const inner = (
                  <div className="group relative rounded-lg border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm">
                    {/* Timeline dot */}
                    <div
                      className={`absolute -left-[31px] top-5 w-3 h-3 rounded-full border-2 border-background ${cfg.dot}`}
                    />

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-muted-foreground">
                            Day {String(task.day).padStart(2, "0")}
                          </span>
                          <span
                            className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${cfg.color}`}
                          >
                            {cfg.label}
                          </span>
                        </div>
                        <h3 className="font-medium text-sm leading-snug group-hover:text-primary transition-colors">
                          {task.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          {task.description}
                        </p>
                      </div>

                      {task.slug && (
                        <span className="shrink-0 mt-1 text-muted-foreground group-hover:text-primary transition-colors">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                );

                if (task.slug) {
                  return (
                    <Link
                      key={task.day}
                      href={`/articles/${task.slug}`}
                      className="block"
                    >
                      {inner}
                    </Link>
                  );
                }

                return (
                  <div key={task.day}>
                    {inner}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-14 rounded-xl border bg-gradient-to-br from-primary/5 via-transparent to-primary/5 p-6 text-center">
        <h3 className="font-semibold text-lg mb-2">
          准备好开始了吗？
        </h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
          从 Day 1 开始你的 Claude 学习之旅，30 天后你将成为 AI 对话高手。
        </p>
        <Link
          href="/articles/what-is-claude"
          className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium transition-colors hover:bg-primary/90"
        >
          开始 Day 1
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
