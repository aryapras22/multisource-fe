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
  who: string
  what: string
  why: string | null
  full_sentence: string
  similarity_score: number
  source: "review" | "news" | "tweet"
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
  source_data?: Source
}

export interface UseCaseGeneration {
  _id: string
  projectId: string
  generatedAt: string
  diagrams_url: string[]
  diagrams: UseCaseDiagram[]
  stats: {
    actors: number
    usecases: number
    edges: number
  }
}

export interface UseCaseDiagram {
  part: number
  total: number
  imageUrl: string
  puml: string
  rawTitle: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapUseCaseGeneration(raw: any): UseCaseGeneration {
  const diagrams: UseCaseDiagram[] = (raw.diagrams_puml || []).map((puml: string, i: number) => {
    const rawTitleLine = puml.split('\n').find(l => l.startsWith('title')) || ''
    const m = rawTitleLine.match(/\(part\s+(\d+)\/(\d+)\)/i)
    const part = m ? parseInt(m[1], 10) : i + 1
    const total = m ? parseInt(m[2], 10) : (raw.diagrams_puml?.length || part)
    return {
      part,
      total,
      imageUrl: raw.diagrams_url?.[i] || '',
      puml,
      rawTitle: rawTitleLine.replace(/^title\s+/i, '').trim(),
    }
  })

  return {
    _id: raw._id?.$oid || raw._id || '',
    projectId: raw.project_id,
    diagrams_url: raw.diagrams_url,
    generatedAt: raw.generated_at?.$date || raw.generated_at,
    diagrams,
    stats: raw.stats || { actors: 0, usecases: 0, edges: 0 },
  }
}

export interface GenerationStep {
  name: string
  description: string
}