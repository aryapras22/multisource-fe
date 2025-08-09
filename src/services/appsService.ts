import { apiGet } from "./apiClient";
import type { App, AppReview } from "@/types/collections";

export async function searchApps(params: { project_id: string; limit: number }) {

  const q = new URLSearchParams({ project_id: params.project_id, limit: String(params.limit) }).toString()
  return apiGet<App[]>(`/get-apps?${q}`)

}

export async function fetchAppReviews(params: { project_id: string; store: string; app_id: string | number; count: number }) {
  const q = new URLSearchParams({
    ...params,
    app_id: String(params.app_id),
    count: String(params.count)
  }).toString();
  //http://localhost:8001/get-reviews?project_id=eb8bad69-8876-48fa-8e53-5760f8ab3687&store=google&app_id=fr.icuisto.icuisto&count=10
  return apiGet<AppReview[]>(`/get-reviews?${q}`)

}