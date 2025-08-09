import { useState, useCallback } from "react"
import type { SocialPost } from "@/types/collections"
import { fetchProjectQueries } from "@/services/projectService"
import { fetchTwitter } from "@/services/socialService"

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
  }, [projectId, socialCount])

  return { social, socialCount, setSocialCount, scrapeSocial }
}