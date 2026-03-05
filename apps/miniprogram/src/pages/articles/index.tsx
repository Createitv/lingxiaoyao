import { useState } from "react";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { getArticles } from "@/services/articles";
import type { Article } from "@workspace/types";
import "./index.scss";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useDidShow(() => {
    loadArticles();
  });

  async function loadArticles() {
    setLoading(true);
    const list = await getArticles();
    setArticles(list);
    setLoading(false);
  }

  const allSeries = [...new Set(articles.map((a) => a.series).filter(Boolean))] as string[];

  const filtered = selectedSeries
    ? articles.filter((a) => a.series === selectedSeries)
    : articles;

  function goToArticle(slug: string) {
    Taro.navigateTo({ url: `/pages/article/index?slug=${slug}` });
  }

  return (
    <ScrollView scrollY className="articles-page">
      <View className="page-header">
        <Text className="page-title">教程文章</Text>
      </View>

      {/* Series Filter */}
      {allSeries.length > 0 && (
        <ScrollView scrollX className="tag-filter">
          <View className="tag-list">
            <Text
              className={`tag-item ${!selectedSeries ? "active" : ""}`}
              onClick={() => setSelectedSeries(null)}
            >
              全部
            </Text>
            {allSeries.map((series) => (
              <Text
                key={series}
                className={`tag-item ${selectedSeries === series ? "active" : ""}`}
                onClick={() =>
                  setSelectedSeries(series === selectedSeries ? null : series)
                }
              >
                {series}
              </Text>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Article List */}
      <View className="article-list">
        {filtered.map((article) => (
          <View
            key={article.slug}
            className="article-card"
            onClick={() => goToArticle(article.slug)}
          >
            {article.coverUrl && (
              <Image
                className="article-cover"
                src={article.coverUrl}
                mode="aspectFill"
              />
            )}
            <View className="article-body">
              <View className="article-meta">
                {article.series && (
                  <Text className="meta-series">{article.series}</Text>
                )}
                <Text className="meta-time">约 {article.readingTime} 分钟</Text>
              </View>
              <Text className="article-title">{article.title}</Text>
              <Text className="article-summary">{article.summary}</Text>
            </View>
          </View>
        ))}

        {filtered.length === 0 && !loading && (
          <View className="empty-state">
            <Text className="empty-text">暂无文章</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
