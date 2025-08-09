import { useState, useCallback } from "react"
import type { NewsArticle } from "@/types/collections"

interface CollectionState<T> {
  items: T[]
  loading: boolean
  loaded: boolean
}

export interface UseNewsCollection {
  news: CollectionState<NewsArticle>
  newsCount: number
  setNewsCount: (n: number) => void
  fetchNews: () => Promise<void>
}

const mockNews: NewsArticle[] = [
  {
    _id: "6891fec0d777fa89f353111c",
    title: "Motorola Introduces Ai Nutrition Labels For Safety Technologies",
    author: "Deepak",
    link: "https://www.snsmideast.com/motorola-introduces-ai-nutrition-labels-for-safety-technologies",
    description: "Motorola Solutions has announced it is introducing 'AI nutrition labels'...",
    content: "Motorola Solutions has announced it is introducing 'AI nutrition labels'...",
    query: "AI nutrition assistant"
  },
  {
    _id: "news-2",
    title: "AI-Powered Meal Planning Apps See 300% Growth in 2024",
    author: "Tech Food Weekly",
    link: "https://example.com/news-1",
    description: "The meal planning app market is experiencing unprecedented growth...",
    content: "The meal planning app market is experiencing unprecedented growth...",
    query: "AI meal plan customization"
  }
]

/**
 * Handles news article collection (isolates async + counts).
 */
export function useNewsCollection(): UseNewsCollection {
  const [news, setNews] = useState<CollectionState<NewsArticle>>({
    items: [],
    loading: false,
    loaded: false
  })
  const [newsCount, setNewsCount] = useState(10)

  const fetchNews = useCallback(async () => {
    setNews(s => ({ ...s, loading: true }))
    await new Promise(r => setTimeout(r, 700))
    setNews({ items: mockNews.slice(0, newsCount), loading: false, loaded: true })
  }, [newsCount])

  return { news, newsCount, setNewsCount, fetchNews }
}