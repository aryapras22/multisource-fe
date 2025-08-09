import { apiGet } from "./apiClient";

export async function fetchProjectQueries(params: {
  project_id: string
}) {

  return apiGet<string[]>(`/get-project-queries?project_id=${params.project_id}`)

}
