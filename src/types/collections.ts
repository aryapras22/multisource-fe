/**
 * Shared domain types for the dashboard data collections.
 * Keeping them in one place avoids circular imports and duplication.
 */
export interface App {
  _id: string
  appName: string
  appId: string | number
  developer: string
  icon: string
  url: string
  ratingScore: number
  app_desc: string
  store: "apple" | "google"
  reviewsCollected: boolean
}



export interface AppReview {
  _id: string
  reviewer: string
  rating: number
  review: string
  app_id: string
  store: "apple" | "google"
}

export interface NewsArticle {
  _id: string
  title: string
  author: string
  link: string
  description: string
  content: string
  query: string
}

export interface SocialPost {
  _id: string
  tweet_id: string
  url: string
  text: string
  retweet_count: number
  reply_count: number
  like_count: number
  quote_count: number
  created_at: string
  lang: string
  author: {
    username: string
    name: string
    id: string
    profile_picture: string
    description: string
    location: string
    followers: number
    following: number
    is_blue_verified: boolean
    verified_type: string | null
  }
  entities: {
    hashtags: { indices: number[]; text: string }[]
  }
  query: string
}