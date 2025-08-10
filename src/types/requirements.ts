/**
 * Domain types for requirements features.
 * Centralizes shared interfaces so components stay lean.
 */
export interface Source {
  type: "news" | "review" | "tweet"
  title: string
  author?: string
  content: string
  link?: string
  rating?: number
}

export interface UserStory {
  _id: string
  title: string
  who: string
  what: string
  why: string | null
  sources: Source
}

export interface UseCase {
  id: string
  title: string
  diagramUrl: string
}

export interface GenerationStep {
  name: string
  description: string
}