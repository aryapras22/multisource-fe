import { useState, useCallback, useEffect } from "react"
import type { NewsArticle } from "@/types/collections"
import { fetchNewsArticles, getNews, deleteNewsArticle } from "@/services/newsService"
import { checkAndUpdateProjectStatus, fetchDataState, fetchProjectQueries } from "@/services/projectService"

interface CollectionState<T> {
  items: T[]
  loading: boolean
  loaded: boolean
  error?: string
}

export interface UseNewsCollection {
  news: CollectionState<NewsArticle>
  newsCount: number
  setNewsCount: (n: number) => void
  fetchNews: () => Promise<void>
  deleteNews: (newsId: string) => Promise<void>
}

/**
 * Handles news article collection (isolates async + counts).
 */
export function useNewsCollection(projectId?: string): UseNewsCollection {
  const [news, setNews] = useState<CollectionState<NewsArticle>>({
    items: [],
    loading: false,
    loaded: false
  })
  const [newsCount, setNewsCount] = useState(10)

  useEffect(() => {
    if (!projectId) return;
    const fetchInitialData = async () => {
      setNews((s) => ({ ...s, loading: true }))
      const states = await fetchDataState({ project_id: projectId })
      await checkAndUpdateProjectStatus(projectId)
      if (states.news) {
        const news = await getNews({ project_id: projectId })
        setNews({ items: news, loading: false, loaded: true })
      }
      setNews((s) => ({ ...s, loading: false }))
    }
    fetchInitialData()
  }, [projectId])

  const fetchNews = useCallback(async () => {
    if (!projectId) return
    setNews(s => ({ ...s, loading: true }))

    try {
      const queries = await fetchProjectQueries({ project_id: projectId })
      if (queries.length === 0) return
      const articles = []
      for (const q of queries) {
        const data = await fetchNewsArticles({ project_id: projectId, query: q, count: newsCount })
        articles.push(...data)
      }
      setNews({ items: articles, loading: false, loaded: true })
    } catch (error) {
      if (error instanceof Error) {
        setNews(s => ({ ...s, loading: false, error: error.message }))
      }
    }
    await checkAndUpdateProjectStatus(projectId)
  }, [projectId, newsCount])

  const deleteNews = useCallback(async (newsId: string) => {
    if (!projectId) return

    try {
      await deleteNewsArticle(newsId)
      // Remove from local state
      setNews(s => ({
        ...s,
        items: s.items.filter(article => article._id !== newsId)
      }))
      await checkAndUpdateProjectStatus(projectId)
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
    }
  }, [projectId])

  return { news, newsCount, setNewsCount, fetchNews, deleteNews }
}