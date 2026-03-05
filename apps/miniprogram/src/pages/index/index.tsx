import { useState } from "react";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { getCourses } from "@/services/courses";
import { getArticles } from "@/services/articles";
import { SERIES_CONFIG } from "@/constants/series";
import type { Article } from "@workspace/types";
import "./index.scss";

interface CourseItem {
  slug: string;
  title: string;
  description: string;
  price: number;
  coverUrl?: string;
  totalChapters: number;
  chapters: Array<{
    index: number;
    title: string;
    isFree: boolean;
    duration: number;
  }>;
}

const FEATURES = [
  {
    icon: "\u2726",
    title: "\u7CFB\u7EDF\u89C6\u9891\u8BFE\u7A0B",
    description:
      "\u4ECE Claude \u5165\u95E8\u5230\u8FDB\u9636\uFF0C6\u5927\u6A21\u5757\u5FAA\u5E8F\u6E10\u8FDB\u3002\u6BCF\u8282\u8BFE\u914D\u5957\u5B9E\u6218\u7EC3\u4E60\uFF0C\u5B66\u5B8C\u5373\u7528\u3002",
  },
  {
    icon: "\uD83D\uDCD6",
    title: "\u514D\u8D39\u56FE\u6587\u6559\u7A0B",
    description:
      "\u6301\u7EED\u66F4\u65B0\u7684 AI \u4F7F\u7528\u6280\u5DE7\u548C Prompt \u5DE5\u7A0B\u6307\u5357\uFF0C\u5168\u90E8\u514D\u8D39\u9605\u8BFB\u3002",
  },
  {
    icon: "\uD83D\uDCBC",
    title: "\u5B9E\u6218\u6A21\u677F\u5E93",
    description:
      "\u804C\u573A\u5199\u4F5C\u3001\u6570\u636E\u5206\u6790\u3001\u6587\u6863\u9605\u8BFB\u7B49\u573A\u666F\u7684 Prompt \u6A21\u677F\uFF0C\u590D\u5236\u5373\u7528\u3002",
  },
];

export default function IndexPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [seriesArticleCounts, setSeriesArticleCounts] = useState<
    Record<string, number>
  >({});

  useDidShow(() => {
    loadData();
  });

  async function loadData() {
    const [courseList, articleList] = await Promise.all([
      getCourses(),
      getArticles(),
    ]);
    setCourses(courseList);
    setArticles(articleList.slice(0, 3));

    const counts: Record<string, number> = {};
    articleList.forEach((a) => {
      if (a.series) {
        counts[a.series] = (counts[a.series] || 0) + 1;
      }
    });
    setSeriesArticleCounts(counts);
  }

  function goToCourse(slug: string) {
    Taro.navigateTo({ url: `/pages/course-detail/index?slug=${slug}` });
  }

  function goToArticle(slug: string) {
    Taro.navigateTo({ url: `/pages/article/index?slug=${slug}` });
  }

  function goToSeries(seriesName: string) {
    Taro.navigateTo({
      url: `/pages/articles/index?series=${encodeURIComponent(seriesName)}`,
    });
  }

  return (
    <ScrollView scrollY className="index-page">
      {/* ── Hero ── */}
      <View className="hero">
        <View className="hero-grid-overlay" />
        <Text className="hero-label">AI LEARNING PLATFORM</Text>
        <Text className="hero-title">AI 不只是工具，</Text>
        <Text className="hero-title hero-highlight">更是一种思维方式</Text>
        <Text className="hero-subtitle">
          从零开始系统学习 Claude，掌握 AI 时代的核心技能。
          视频课程与图文教程结合，让每个人都能把 AI 用到工作中。
        </Text>
        <View className="hero-buttons">
          <View
            className="btn-primary"
            onClick={() =>
              Taro.switchTab({ url: "/pages/courses/index" })
            }
          >
            <Text className="btn-primary-text">开始学习</Text>
          </View>
          <View
            className="btn-outline"
            onClick={() =>
              Taro.navigateTo({ url: "/pages/articles/index" })
            }
          >
            <Text className="btn-outline-text">浏览免费教程</Text>
          </View>
        </View>
      </View>

      {/* ── Quick Navigation ── */}
      <View className="quick-nav">
        <View className="nav-grid">
          <View
            className="nav-item"
            onClick={() =>
              Taro.switchTab({ url: "/pages/courses/index" })
            }
          >
            <View className="nav-icon nav-icon-courses">
              <Text className="nav-icon-emoji">{"\uD83C\uDF93"}</Text>
            </View>
            <Text className="nav-label">课程</Text>
          </View>
          <View
            className="nav-item"
            onClick={() =>
              Taro.navigateTo({ url: "/pages/articles/index" })
            }
          >
            <View className="nav-icon nav-icon-articles">
              <Text className="nav-icon-emoji">{"\uD83D\uDCDA"}</Text>
            </View>
            <Text className="nav-label">教程</Text>
          </View>
          <View
            className="nav-item"
            onClick={() => goToSeries("21天学习Claude")}
          >
            <View className="nav-icon nav-icon-series">
              <Text className="nav-icon-emoji">{"\uD83D\uDCC5"}</Text>
            </View>
            <Text className="nav-label">21天学Claude</Text>
          </View>
          <View
            className="nav-item"
            onClick={() =>
              Taro.navigateTo({ url: "/pages/search/index" })
            }
          >
            <View className="nav-icon nav-icon-search">
              <Text className="nav-icon-emoji">{"\uD83D\uDD0D"}</Text>
            </View>
            <Text className="nav-label">搜索</Text>
          </View>
        </View>
      </View>

      {/* ── What You'll Learn ── */}
      <View className="section features-section">
        <Text className="section-header-center">在这里，你可以</Text>
        <View className="feature-cards">
          {FEATURES.map((f) => (
            <View key={f.title} className="feature-card">
              <View className="feature-icon">
                <Text className="feature-icon-text">{f.icon}</Text>
              </View>
              <Text className="feature-title">{f.title}</Text>
              <Text className="feature-desc">{f.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Courses ── */}
      {courses.length > 0 && (
        <View className="section courses-section">
          <View className="section-header-row">
            <View>
              <Text className="section-label">Courses</Text>
              <Text className="section-title">精选课程</Text>
            </View>
            <Text
              className="view-all"
              onClick={() =>
                Taro.switchTab({ url: "/pages/courses/index" })
              }
            >
              查看全部 →
            </Text>
          </View>
          <View className="course-list">
            {courses.map((course) => {
              const totalDuration =
                course.chapters?.reduce((acc, ch) => acc + ch.duration, 0) ??
                0;
              return (
                <View
                  key={course.slug}
                  className="course-card"
                  onClick={() => goToCourse(course.slug)}
                >
                  {course.coverUrl ? (
                    <Image
                      className="course-cover"
                      src={course.coverUrl}
                      mode="aspectFill"
                    />
                  ) : (
                    <View className="course-cover-fallback">
                      <Text className="fallback-icon">{"\u2726"}</Text>
                    </View>
                  )}
                  <View className="course-info">
                    <Text className="course-title">{course.title}</Text>
                    <Text className="course-desc">{course.description}</Text>
                    <View className="course-meta">
                      <Text className="course-chapters">
                        {course.totalChapters} 节课
                        {totalDuration > 0 ? ` / ${totalDuration} 分钟` : ""}
                      </Text>
                      <Text className="course-price">
                        {course.price === 0
                          ? "免费"
                          : `¥${(course.price / 100).toFixed(0)}`}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* ── Series ── */}
      {SERIES_CONFIG.length > 0 && (
        <View className="section series-section">
          <View className="section-header-row">
            <View>
              <Text className="section-label">Series</Text>
              <Text className="section-title">学习系列</Text>
            </View>
          </View>
          <View className="series-list">
            {SERIES_CONFIG.map((s) => (
              <View
                key={s.slug}
                className="series-card"
                onClick={() => goToSeries(s.name)}
              >
                <View className="series-badge">
                  <Text className="series-badge-text">
                    {seriesArticleCounts[s.name] ?? 0} 篇
                  </Text>
                </View>
                <Text className="series-name">{s.name}</Text>
                <Text className="series-desc">{s.description}</Text>
                <Text className="series-cta">开始学习 →</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* ── Latest Articles ── */}
      {articles.length > 0 && (
        <View className="section articles-section">
          <View className="section-header-row">
            <View>
              <Text className="section-label">Articles</Text>
              <Text className="section-title">最新教程</Text>
            </View>
            <Text
              className="view-all"
              onClick={() =>
                Taro.navigateTo({ url: "/pages/articles/index" })
              }
            >
              查看全部 →
            </Text>
          </View>
          <View className="article-list">
            {articles.map((article) => (
              <View
                key={article.slug}
                className="article-card"
                onClick={() => goToArticle(article.slug)}
              >
                <View className="article-tags-row">
                  {article.tags?.slice(0, 2).map((tag) => (
                    <Text key={tag} className="article-tag">
                      {tag}
                    </Text>
                  ))}
                </View>
                <Text className="article-title">{article.title}</Text>
                <Text className="article-summary">{article.summary}</Text>
                <View className="article-meta">
                  <Text className="article-date">
                    {new Date(article.date).toLocaleDateString("zh-CN", {
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                  <Text className="article-time">
                    约 {article.readingTime} 分钟
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* ── Bottom CTA ── */}
      <View className="bottom-cta">
        <Text className="cta-title">
          准备好开始你的 AI 学习之旅了吗？
        </Text>
        <Text className="cta-subtitle">
          无论你是刚接触 AI 的新手，还是想要深入掌握 Claude
          的进阶用户，这里都有适合你的学习路径。
        </Text>
        <View className="cta-buttons">
          <View
            className="btn-primary"
            onClick={() =>
              Taro.switchTab({ url: "/pages/courses/index" })
            }
          >
            <Text className="btn-primary-text">浏览课程</Text>
          </View>
          <View
            className="btn-outline-dark"
            onClick={() =>
              Taro.navigateTo({ url: "/pages/articles/index" })
            }
          >
            <Text className="btn-outline-dark-text">了解更多</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
