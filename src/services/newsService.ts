import { apiGet } from "./apiClient";
import type { NewsArticle } from "@/types/collections";


export async function fetchNewsArticles(params: { project_id: string; query: string; limit: number; }) {
  const q = new URLSearchParams({ project_id: params.project_id, query: params.query, limit: String(params.limit) }).toString();

  return apiGet<NewsArticle[]>(`/get-news?${q}`)
}

export async function getNews(params: { project_id: string }) {
  return apiGet<NewsArticle[]>(`/get-project-news?project_id=${params.project_id}`)
}