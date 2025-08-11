import { apiGet, apiPost } from "./apiClient";

interface DataState {
  reviews: boolean
  appStores: boolean
  news: boolean
  socialMedia: boolean
  userStories?: boolean
  useCase?: boolean
  aiUserStories?: boolean
  aiUseCase?: boolean
}

export interface UpdateFetchStateRequest {
  project_id: string
  appStores?: boolean
  news?: boolean
  socialMedia?: boolean
  reviews?: boolean
  userStories?: boolean
  useCase?: boolean
  aiUserStories?: boolean
  aiUseCase?: boolean
}

export async function fetchProjectQueries(params: {
  project_id: string
}) {
  return apiGet<string[]>(`/get-project-queries?project_id=${params.project_id}`)
}

export async function fetchDataState(params: { project_id: string }) {
  return apiGet<DataState>(`/check-project-fetch-states?project_id=${params.project_id}`)
}

export async function updateFetchDataState(body: UpdateFetchStateRequest) {
  return apiPost<DataState>("/update-project-fetch-state", body)
}