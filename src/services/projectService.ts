import { apiGet, apiPatch, apiPost } from "./apiClient";

export type ProjectStatus = "new" | "fetching" | "analyzing" | "complete" | "error"

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

export interface UpdateProjectStatusRequest {
  project_id: string
  status: string
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

export function getProjectStatus(fetchState: DataState): ProjectStatus {
  const hasAllSources =
    fetchState.appStores && fetchState.reviews && fetchState.news && fetchState.socialMedia
  const hasAllRequirements = fetchState.userStories && fetchState.useCase

  if (hasAllSources && hasAllRequirements) {
    return "complete"
  }
  if (hasAllSources) {
    return "analyzing"
  }
  // Note: 'fetching' status would likely be managed in the component state
  // during API calls, but you could add logic for it here if needed.
  return "new"
}


export async function updateProjectStatus(body: UpdateProjectStatusRequest) {
  // Assuming an apiPatch method exists for PATCH requests.
  // If not, this might need to be apiPost depending on your apiClient setup.
  return apiPatch("/update-project-status", body)
}

export async function checkAndUpdateProjectStatus(projectId: string) {
  if (!projectId) return

  try {
    // 1. Get the latest data fetch state
    const fetchState = await fetchDataState({ project_id: projectId })

    // 2. Determine the new status based on the state
    const newStatus = getProjectStatus(fetchState)

    // 3. Update the project with the new status
    // This assumes you have a ProjectModel type defined for the response.
    const updatedProject = await updateProjectStatus({
      project_id: projectId,
      status: newStatus,
    })

    return updatedProject
  } catch (error) {
    console.error("Failed to check and update project status:", error)
    // Optionally re-throw or handle the error as needed
    throw error
  }
}

export async function getProjectSummary(params: { project_id: string }) {
  return apiGet(`/projects/${params.project_id}/all-data`)
}