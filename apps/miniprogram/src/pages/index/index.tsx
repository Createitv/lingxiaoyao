import { useState } from "react";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { getCourses } from "@/services/courses";
import { getArticles } from "@/services/articles";
import type { Article } from "@workspace/types";
import "./index.scss";

interface CourseItem {
  slug: string;
  title: string;
  description: string;
  price: number;
  coverUrl?: string;
  totalChapters: number;
  chapters: Array<{ index: number; title: string; isFree: boolean; duration: number }>;
}

export default function IndexPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

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
  }

  function goToCourse(slug: string) {
    Taro.navigateTo({ url: `/pages/course-detail/index?slug=${slug}` });
  }

  function goToArticle(slug: string) {
    Taro.navigateTo({ url: `/pages/article/index?slug=${slug}` });
  }

  return (
    <ScrollView scrollY className="index-page">
      {/* Hero Section */}
      <View className="hero">
        <Text className="hero-title">AI 不只是工具，</Text>
        <Text className="hero-title hero-highlight">更是一种思维方式</Text>
        <Text className="hero-subtitle">
          从零开始系统学习 Claude，掌握 AI 时代的核心技能。
        </Text>
      </View>

      {/* Search Entry */}
      <View
        className="search-entry"
        onClick={() => Taro.navigateTo({ url: "/pages/search/index" })}
      >
        <Text className="search-icon">🔍</Text>
        <Text className="search-placeholder">搜索文章、课程...</Text>
      </View>

      {/* Courses Section */}
      <View className="section">
        <Text className="section-title">精选课程</Text>
        <View className="course-list">
          {courses.map((course) => {
            const totalDuration = course.chapters?.reduce((acc, ch) => acc + ch.duration, 0) ?? 0;
            return (
              <View
                key={course.slug}
                className="course-card"
                onClick={() => goToCourse(course.slug)}
              >
                {course.coverUrl && (
                  <Image
                    className="course-cover"
                    src={course.coverUrl}
                    mode="aspectFill"
                  />
                )}
                <View className="course-info">
                  <Text className="course-title">{course.title}</Text>
                  <Text className="course-desc">{course.description}</Text>
                  <View className="course-meta">
                    <Text className="course-chapters">
                      {course.totalChapters} 节{totalDuration > 0 ? ` · ${totalDuration} 分钟` : " · 视频课程"}
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

      {/* Latest Articles */}
      {articles.length > 0 && (
        <View className="section">
          <Text className="section-title">最新教程</Text>
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
    </ScrollView>
  );
}
