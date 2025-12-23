export interface ProjectOverview {
  total_projects: number;
  status_distribution: Record<string, number>;
  data_sources_usage: {
    appStores: number;
    news: number;
    socialMedia: number;
  };
  projects: Array<{
    id: string;
    name: string;
    status: string;
    created_at: string | null;
  }>;
}

export interface DataCollectionStats {
  project_id: string;
  apps: number;
  reviews: number;
  news: number;
  tweets: number;
  total: number;
}

export interface AllDataCollectionStats {
  projects: Array<DataCollectionStats & { project_name: string }>;
  total_apps: number;
  total_reviews: number;
  total_news: number;
  total_tweets: number;
}

export interface RequirementsStats {
  project_id: string;
  user_stories: {
    total: number;
    by_source: Record<string, number>;
    with_insights: number;
    similarity_scores: {
      avg: number;
      min: number;
      max: number;
    };
  };
  ai_stories: {
    total: number;
    by_sentiment: Record<string, number>;
    confidence_scores: {
      avg: number;
      min: number;
      max: number;
    };
  };
}

export interface AllRequirementsStats {
  total_user_stories: number;
  total_ai_stories: number;
  source_distribution: Record<string, number>;
  sentiment_distribution: Record<string, number>;
}

export interface RatingsDistribution {
  project_id: string;
  total_reviews: number;
  distribution: Record<number, number>;
  average_rating: number;
}

export interface EngagementMetrics {
  project_id: string;
  total_tweets: number;
  engagement: {
    retweets: number;
    replies: number;
    likes: number;
    quotes: number;
    total: number;
  };
  average_per_tweet: {
    retweets: number;
    replies: number;
    likes: number;
    quotes: number;
  };
}

export interface NFRAnalysis {
  project_id: string;
  total_stories_with_nfr: number;
  nfr_frequency: Record<string, number>;
  unique_nfrs: number;
}

export interface ClusterStats {
  project_id: string;
  user_stories_count: number;
  ai_stories_count: number;
  message: string;
}

export interface ComparisonProject {
  project_id: string;
  project_name: string;
  status: string;
  data_collection: {
    apps: number;
    reviews: number;
    news: number;
    tweets: number;
  };
  requirements: {
    user_stories: number;
    ai_stories: number;
  };
}

export interface ComparisonData {
  projects: ComparisonProject[];
  count: number;
}
