import { apiGet } from "./apiClient";
import type { SocialPost } from "@/types/collections";

export async function fetchTwitter(params: {
  project_id: string; query: string; count: number
}) {
  const q = new URLSearchParams({ project_id: params.project_id, query: params.query, count: String(params.count) }).toString()

  return apiGet<SocialPost[]>(`/get-tweets?${q}`)
}