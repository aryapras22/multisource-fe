import { apiGet, apiPost } from "./apiClient";

export async function generateUseCases(body: {
  project_id: string
}) {
  return apiPost(`/usecases/diagram`, body)
}

export async function getUseCases(params: { project_id: string }) {
  return apiGet(`/usecases/diagram/${params.project_id}`)
}