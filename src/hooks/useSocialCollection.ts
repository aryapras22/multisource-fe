import { useState, useCallback, useEffect } from "react"
import type { SocialPost } from "@/types/collections"
import { checkAndUpdateProjectStatus, fetchDataState, fetchProjectQueries } from "@/services/projectService"
import { fetchTwitter, getTweets, deleteTweet } from "@/services/socialService"

interface CollectionState<T> {
  items: T[]
  loading: boolean
  loaded: boolean
  error?: string
}

export interface UseSocialCollection {
  social: CollectionState<SocialPost>
  socialCount: number
  setSocialCount: (n: number) => void
  scrapeSocial: () => Promise<void>
  deleteSocial: (tweetId: string) => Promise<void>
}

/**
 * Social posts scraping abstraction.
 */
export function useSocialCollection(projectId?: string): UseSocialCollection {
  const [social, setSocial] = useState<CollectionState<SocialPost>>({
    items: [],
    loading: false,
    loaded: false
  })
  const [socialCount, setSocialCount] = useState(15)


  useEffect(() => {
    if (!projectId) return
    setSocial((s) => ({ ...s, loading: true }))

    const fetchInitialData = async () => {
      const state = await fetchDataState({ project_id: projectId })
      await checkAndUpdateProjectStatus(projectId)
      if (state.socialMedia) {
        const tweets = await getTweets({ project_id: projectId })
        setSocial({ items: tweets, loading: false, loaded: true })
      }
      setSocial((s) => ({ ...s, loading: false }))
    }
    fetchInitialData()
  }, [projectId])

  const scrapeSocial = useCallback(async () => {
    if (!projectId) return
    setSocial(s => ({ ...s, loading: true }))
    try {
      const queries = await fetchProjectQueries({ project_id: projectId })
      const tweets = []
      for (const q of queries) {
        const data = await fetchTwitter({ project_id: projectId, query: q, count: socialCount })
        tweets.push(...data)
      }
      setSocial({ items: tweets, loading: false, loaded: true })
    } catch (e) {
      if (e instanceof Error) {
        setSocial(s => ({ ...s, loading: false, error: e.message }))
      } else {
        setSocial(s => ({ ...s, loading: false, error: "An unknown error occurred" }))
      }
    }
    await checkAndUpdateProjectStatus(projectId)
  }, [projectId, socialCount])

  const deleteSocial = useCallback(async (tweetId: string) => {
    if (!projectId) return

    try {
      await deleteTweet(tweetId)
      // Remove from local state
      setSocial(s => ({
        ...s,
        items: s.items.filter(post => post._id !== tweetId)
      }))
      await checkAndUpdateProjectStatus(projectId)
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
    }
  }, [projectId])

  return { social, socialCount, setSocialCount, scrapeSocial, deleteSocial }
}