import type { UserStory } from "@/types/requirements";
import { apiPost, apiGet } from "./apiClient";


interface Insight {
  nfr: string[]
  business_impact: string
  pain_point_jtbd: string
}

interface GenerateInsightResponse {
  story_id: string
  project_id: string
  insight: Insight
}

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

export async function getProjectUserStoryIds(params: { project_id: string }) {
  return apiGet<string[]>(`/get-project-user-story-ids?project_id=${params.project_id}`)
}

export async function removeDuplicateStories(params: { project_id: string }) {
  return apiPost(`/clean-duplicates?project_id=${params.project_id}`)
}



export async function generateStoryInsight(params: { story_id: string }) {
  return apiPost<GenerateInsightResponse>(`/stories/generate-insight/${params.story_id}`)
}

export async function extractUserStoryWithAI(body: {
  content_type: string;
  project_id: string,
  content_id: string;
  content: string;
  persist?: boolean
}) {
  return apiPost(`/ai/generate-user-stories`, body)
}


export async function getProjectUserStoriesAI(params: { project_id: string }) {
  return apiGet(`/ai/user-stories?project_id=${params.project_id}`)
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