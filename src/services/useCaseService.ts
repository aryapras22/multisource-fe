import { apiGet, apiPost } from "./apiClient";

export async function generateUseCases(body: {
  project_id: string
}) {
  return apiPost(`/usecases/diagram`, body)
}

export async function getUseCases(params: { project_id: string }) {
  return apiGet(`/usecases/diagram/${params.project_id}`)
}


export async function generateAiUseCases(body: {
  project_id: string
}) {
  return apiPost(`/usecases/diagram/ai`, body)
}

export async function getAiUseCases(params: { project_id: string }) {
  return apiGet(`/usecases/diagram/ai/${params.project_id}`)
}