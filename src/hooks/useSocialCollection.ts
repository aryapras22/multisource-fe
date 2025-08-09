import { useState, useCallback } from "react"
import type { SocialPost } from "@/types/collections"

interface CollectionState<T> {
  items: T[]
  loading: boolean
  loaded: boolean
}

export interface UseSocialCollection {
  social: CollectionState<SocialPost>
  socialCount: number
  setSocialCount: (n: number) => void
  scrapeSocial: () => Promise<void>
}

const mockSocialPosts: SocialPost[] = [
  {
    _id: "689350909f6179020e4a8d89",
    tweet_id: "1614295896640094208",
    url: "https://x.com/tiffany_peltier/status/1614295896640094208",
    text: "I just asked #ChatGPT to create a meal plan for 3 lunches and 4 dinners...",
    retweet_count: 27,
    reply_count: 19,
    like_count: 419,
    quote_count: 15,
    created_at: "Sat Jan 14 16:18:28 +0000 2023",
    lang: "en",
    author: {
      username: "tiffany_peltier",
      name: "Tiffany Peltier, Ph.D.🌸",
      id: "229271282",
      profile_picture: "https://pbs.twimg.com/profile_images/1398709247504945153/t2mezMYr_normal.jpg",
      description: "",
      location: "Norman, OK",
      followers: 9557,
      following: 4371,
      is_blue_verified: false,
      verified_type: null
    },
    entities: { hashtags: [{ indices: [13, 21], text: "ChatGPT" }] },
    query: "AI meal plan customization"
  },
  {
    _id: "social-2",
    tweet_id: "1614295896640094210",
    url: "https://x.com/foodtechinsider/status/1614295896640094210",
    text: "The future of nutrition is here! AI nutrition assistants are becoming incredibly sophisticated.",
    retweet_count: 234,
    reply_count: 67,
    like_count: 892,
    quote_count: 42,
    created_at: "Sat Jan 14 17:10:11 +0000 2023",
    lang: "en",
    author: {
      username: "foodtechinsider",
      name: "FoodTech Insider",
      id: "1122334455",
      profile_picture: "",
      description: "",
      location: "",
      followers: 12450,
      following: 120,
      is_blue_verified: false,
      verified_type: null
    },
    entities: { hashtags: [] },
    query: "AI nutrition assistant"
  }
]

/**
 * Social posts scraping abstraction.
 */
export function useSocialCollection(): UseSocialCollection {
  const [social, setSocial] = useState<CollectionState<SocialPost>>({
    items: [],
    loading: false,
    loaded: false
  })
  const [socialCount, setSocialCount] = useState(15)

  const scrapeSocial = useCallback(async () => {
    setSocial(s => ({ ...s, loading: true }))
    await new Promise(r => setTimeout(r, 650))
    setSocial({ items: mockSocialPosts.slice(0, socialCount), loading: false, loaded: true })
  }, [socialCount])

  return { social, socialCount, setSocialCount, scrapeSocial }
}