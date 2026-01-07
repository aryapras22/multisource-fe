import { apiGet, apiDelete } from "./apiClient";
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
  return apiGet<AppReview[]>(`/get-reviews?${q}`)
}

export async function getApps(params: { project_id: string }) {
  return apiGet<App[]>(`/get-project-apps?project_id=${params.project_id}`)
}

export async function getReviews(params: { project_id: string }) {
  return apiGet<AppReview[]>(`/get-project-app-reviews?project_id=${params.project_id}`)
}

export async function deleteReview(reviewId: string) {
  return apiDelete(`/delete-review/${reviewId}`)
}