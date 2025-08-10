import type { UserStory } from "@/types/requirements";
import { apiPost, apiGet } from "./apiClient";


export async function extractUserStory(body: {
  source: string;
  project_id: string,
  source_id: string;
  content: string;
  min_similarity?: string;
  dedupe?: boolean
}) {
  return apiPost(`/extract-user-story`, body)
}

export async function getProjectUserStories(params: { project_id: string }) {
  return apiGet<UserStory[]>(`/get-project-user-stories?project_id=${params.project_id}`)
}

export async function cleanContent(params: { content_id: string; source: string }) {
  switch (params.source) {
    case "review":
      return apiGet<string>(`/clean-app-review?review_id=${params.content_id}`)
    case "news":
      return apiGet<string>(`/clean-news?news_id=${params.content_id}`)
    case "tweet":
      return apiGet<string>(`/clean-tweet?tweet_id=${params.content_id}`)
    default:
      return null
  }
}