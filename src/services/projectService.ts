import { apiGet } from "./apiClient";

interface dataState {
  reviews: boolean
  appStores: boolean
  news: boolean
  socialMedia: boolean
}

export async function fetchProjectQueries(params: {
  project_id: string
}) {
  return apiGet<string[]>(`/get-project-queries?project_id=${params.project_id}`)
}


export async function fetchDataState(params: { project_id: string }) {
  return apiGet<dataState>(`/check-project-fetch-states?project_id=${params.project_id}`)
}
