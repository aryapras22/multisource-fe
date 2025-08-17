export interface ClusterStory {
  _id: string
  who: string
  what: string
  why: string | null
  full_sentence: string | null
  similarity_score: number
  source: "news" | "review" | "tweet" | "social"
  source_id: string
  project_id: string
  insight?: {
    nfr: string[]
    business_impact: string
    pain_point_jtbd: string
    fit_score?: {
      score: number
      explanation: string
    }
  }
}

export interface Cluster {
  cluster_id: number
  representative_story: ClusterStory
  stories: ClusterStory[]
  size: number
  sources: string[]
}

export interface ClusteringData {
  project_id: string
  clusters: Cluster[]
}

export interface Position {
  x: number
  y: number
}

export interface DraggableStory extends ClusterStory {
  position: Position
  clusterId: number
  isRepresentative: boolean
}
