import { useState, useCallback, useEffect } from "react"
import type { App, AppReview } from "@/types/collections"
import { searchApps, fetchAppReviews, getApps, getReviews } from "@/services/appsService"
import { checkAndUpdateProjectStatus, fetchDataState } from "@/services/projectService"

/**
 * Hook state shape for a generic collection with loading flags.
 */
interface CollectionState<T> {
  items: T[]
  loading: boolean
  loaded: boolean
  error?: string
}

/**
 * Public API returned by useAppsCollection for consumers (components).
 */
export interface UseAppsCollection {
  apps: CollectionState<App>
  reviews: CollectionState<AppReview>
  appCount: number
  reviewsPerApp: number
  setAppCount: (n: number) => void
  setReviewsPerApp: (n: number) => void
  findApps: () => Promise<void>
  getReviewsForApp: (appId: string | number, store: string) => Promise<void>
  getReviewsForAll: () => Promise<void>
  reviewsLoadingId: string | number | null
}


/**
 * Encapsulates all app + review collection behaviors.
 * Reduces state noise in DashboardPage.
 */
export function useAppsCollection(projectId?: string): UseAppsCollection {
  const [appsState, setAppsState] = useState<CollectionState<App>>({
    items: [],
    loading: false,
    loaded: false
  })
  const [reviewsState, setReviewsState] = useState<CollectionState<AppReview>>({
    items: [],
    loading: false,
    loaded: false
  })
  const [appCount, setAppCount] = useState(5)
  const [reviewsPerApp, setReviewsPerApp] = useState(20)
  const [reviewsLoadingId, setReviewsLoadingId] = useState<string | null | number>(null)



  useEffect(() => {
    if (!projectId) return;
    const fetchInitialData = async () => {
      setAppsState((s) => ({ ...s, loading: true }))
      setReviewsState((s) => ({ ...s, loading: true }))
      const states = await fetchDataState({ project_id: projectId })
      await checkAndUpdateProjectStatus(projectId)
      if (states.appStores) {
        const apps = await getApps({ project_id: projectId })
        setAppsState({ items: apps, loading: false, loaded: true })
      }

      if (states.reviews) {
        const reviews = await getReviews({ project_id: projectId })
        setReviewsState({ items: reviews, loading: false, loaded: true })

        for (const review of reviews) {
          setAppsState((s) => ({ ...s, items: s.items.map(a => a.appId.toString() === review.app_id ? { ...a, reviewsCollected: true } : a) }))
        }
      }
      setAppsState((s) => ({ ...s, loading: false }))
      setReviewsState((s) => ({ ...s, loading: false }))
    }
    fetchInitialData()
  }, [projectId])


  const findApps = useCallback(async (): Promise<void> => {
    if (!projectId) return;
    setAppsState(s => ({ ...s, loading: true, error: undefined }))

    try {
      const data = await searchApps({ project_id: projectId, limit: appCount })
      setAppsState({ items: data.map(a => ({ ...a, reviewsCollected: false })), loading: false, loaded: true })
    } catch (error) {
      if (error instanceof Error) {
        setAppsState(s => ({ ...s, loading: false, error: error.message }))
      } else {
        setAppsState(s => ({ ...s, loading: false, error: "An unknown error occurred" }))
      }
    }

  }, [projectId, appCount])

  const getReviewsForApp = useCallback(async (app_id: string | number, store: string) => {
    if (!projectId) return;
    setReviewsLoadingId(app_id)
    setReviewsState(s => ({ ...s, loading: true, error: undefined }))
    try {
      const data = await fetchAppReviews({
        project_id: projectId, app_id, count: reviewsPerApp,
        store
      })

      setReviewsState(s => ({
        items: [
          ...s.items,
          ...data.filter(r => !s.items.some(er => er._id === r._id))
        ],
        loading: false,
        loaded: true
      }))

      setAppsState(s => ({
        ...s,
        items: s.items.map(a => a.appId === app_id ? { ...a, reviewsCollected: true } : a)
      }))
    } catch (e) {
      if (e instanceof Error) {
        setReviewsState(s => ({ ...s, loading: false, error: e.message }))
      } else {
        setReviewsState(s => ({ ...s, loading: false, error: "An unknown error occurred" }))
      }
    } finally {
      setReviewsLoadingId(null)
    }
    await checkAndUpdateProjectStatus(projectId)


  }, [projectId, reviewsPerApp])

  const getReviewsForAll = useCallback(async () => {
    const targets = appsState.items.filter(a => !a.reviewsCollected)
    for (const app of targets) {
      await getReviewsForApp(app._id, app.store)
    }

  }, [appsState.items, getReviewsForApp])

  return {
    apps: appsState,
    reviews: reviewsState,
    appCount,
    reviewsPerApp,
    setAppCount,
    setReviewsPerApp,
    findApps,
    getReviewsForApp,
    getReviewsForAll,
    reviewsLoadingId
  }
}