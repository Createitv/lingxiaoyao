export interface SeriesConfig {
  slug: string;
  name: string;
  description: string;
}

export const SERIES_CONFIG: SeriesConfig[] = [
  {
    slug: "21-day-claude",
    name: "21天学习Claude",
    description:
      "从零基础到高效使用，每天一个任务，21 天系统掌握 Claude 对话技巧。",
  },
];

export function getSeriesConfigBySlug(
  slug: string,
): SeriesConfig | undefined {
  return SERIES_CONFIG.find((s) => s.slug === slug);
}

export function getSeriesConfigByName(
  name: string,
): SeriesConfig | undefined {
  return SERIES_CONFIG.find((s) => s.name === name);
}
