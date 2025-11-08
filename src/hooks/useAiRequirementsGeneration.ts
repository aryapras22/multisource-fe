/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react"
import { getReviews } from "@/services/appsService"
import { getNews } from "@/services/newsService"
import { getTweets } from "@/services/socialService"
import {
  cleanContent,
  extractUserStoryWithAI,
  getClusteredAIUserStories,
  getProjectUserStoriesAI
} from "@/services/userStoryService"
import { generateAiUseCases, getAiUseCases } from "@/services/useCaseService"
import type { GenerationStep, UseCaseGeneration } from "@/types/requirements"
import { fetchDataState, updateFetchDataState } from "@/services/projectService"
import type { ClusteringData, ClusterStory } from "@/types/clustering"

interface UseAiRequirementsGenerationOptions {
  projectId?: string
  autoStart?: boolean
}

export interface AiUserStory {
  _id: string
  project_id: string
  who: string
  what: string
  why: string | null
  as_a_i_want_so_that: string
  evidence: string
  sentiment: string
  confidence: number
  content_id: string
  content_type: "review" | "news" | "tweet"
  created_at: string
  field_insight?: {
    nfr: string[]
    business_impact: string
    pain_point_jtbd: string
  }
  source_data?: {
    type: string
    title: string
    content: string
    author?: string
    link?: string
    rating?: number | null
  }
}

const aiGenerationSteps: GenerationStep[] = [
  { name: "AI Processing", description: "Aggregating sources, cleaning content, and extracting stories" },
  { name: "Finalizing Stories", description: "Structuring and mapping evidence" },
  { name: "Generating Use Cases", description: "Creating system interactions and diagrams" }
]

type StepFn = () => Promise<void>

interface StepStats {
  processed: number
  failed: number
}

export function useAiRequirementsGeneration({
  projectId,
  autoStart = true
}: UseAiRequirementsGenerationOptions) {
  const [isGenerating, setIsGenerating] = useState(autoStart)
  const [isComplete, setIsComplete] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [clusters, setClusters] = useState<ClusteringData>()
  const [aiUserStories, setAiUserStories] = useState<AiUserStory[]>([])
  const [aiUseCases, setAiUseCases] = useState<Partial<UseCaseGeneration>>({
    diagrams_url: []
  })

  const [stepErrors, setStepErrors] = useState<(string | null)[]>(
    () => Array(aiGenerationSteps.length).fill(null)
  )
  const [stepStats, setStepStats] = useState<StepStats[]>(
    () => Array(aiGenerationSteps.length).fill(0).map(() => ({ processed: 0, failed: 0 }))
  )

  const cancelRef = useRef(false)
  const runningRef = useRef(false)

  const transformRawStory = (rawStory: any): ClusterStory => {
    return {
      ...rawStory,
      full_sentence: rawStory.as_a_i_want_so_that,
      similarity_score: rawStory.confidence,
      source: rawStory.content_type,
      source_id: rawStory.content_id,
      insight: rawStory.field_insight
        ? {
          ...rawStory.field_insight,
          fit_score: {
            score: rawStory.confidence,
            explanation: `Derived from story confidence score.`
          }
        }
        : undefined
    }
  }


  const transformClusterData = (rawData: any): ClusteringData => {
    return {
      ...rawData,
      project_id: rawData.project_id,
      clusters: rawData.clusters.map((cluster: any) => ({
        ...cluster,
        representative_story: transformRawStory(cluster.representative_story),
        stories: cluster.stories.map(transformRawStory)
      }))

    }
  }


  const totalSteps = aiGenerationSteps.length
  const setStepProgress = (stepIndex: number, innerFraction: number) => {
    setProgress(Number((((stepIndex + innerFraction) / totalSteps) * 100).toFixed(2)))
  }

  const recordItemResult = (stepIndex: number, ok: boolean) => {
    setStepStats(prev => {
      const next = [...prev]
      const stats = { ...next[stepIndex] }
      if (ok) stats.processed += 1
      else stats.failed += 1
      next[stepIndex] = stats
      return next
    })
  }

  const safeExecute = async (stepIndex: number, fn: StepFn) => {
    try {
      setStepProgress(stepIndex, 0)
      await fn()
      setStepProgress(stepIndex, 1)
    } catch (e: any) {
      setStepErrors(prev => {
        const next = [...prev]
        next[stepIndex] = e?.message || "Unknown error"
        return next
      })
      setStepProgress(stepIndex, 1)
    }
  }

  const stepProcessAndExtract: StepFn = useCallback(async () => {
    if (!projectId) return
    const [reviews, news, tweets] = await Promise.all([
      getReviews({ project_id: projectId }),
      getNews({ project_id: projectId }),
      getTweets({ project_id: projectId })
    ])
    const allContent = [
      ...reviews.map(item => ({ ...item, source: "review" as const })),
      ...news.map(item => ({ ...item, source: "news" as const })),
      ...tweets.map(item => ({ ...item, source: "tweet" as const }))
    ]

    for (let i = allContent.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allContent[i], allContent[j]] = [allContent[j], allContent[i]]
    }

    const limit = parseInt(import.meta.env.VITE_AI_STORY_GENERATION_LIMIT || '70', 10)
    const selectedContent = allContent.slice(0, limit);

    const total = allContent.length
    if (total === 0) {
      setStepProgress(0, 1)
      return
    }

    for (let i = 0; i < selectedContent.length; i++) {
      if (cancelRef.current) break
      const item = selectedContent[i]
      try {
        const cleaned = await cleanContent({ content_id: item._id, source: item.source })
        if (cleaned) {
          await extractUserStoryWithAI({
            project_id: projectId,
            content_type: item.source,
            content_id: item._id,
            content: cleaned,
            persist: true
          })
          recordItemResult(0, true)
        } else {
          recordItemResult(0, false)
        }
      } catch {
        recordItemResult(0, false)
      }
      setStepProgress(0, (i + 1) / total)
    }
  }, [projectId])

  // Step 2: Fetch stories
  const stepFetchStories: StepFn = useCallback(async () => {
    if (!projectId) return
    setStepProgress(1, 0)
    const stories = await getProjectUserStoriesAI({ project_id: projectId }) as AiUserStory[]
    setAiUserStories(stories)
    await updateFetchDataState({ project_id: projectId, aiUserStories: true })
    setStepProgress(1, 1)
  }, [projectId])

  // Step 3: Generate Use Cases
  const stepGenerateUseCases: StepFn = useCallback(async () => {
    if (!projectId) return
    setStepProgress(2, 0)
    const useCases = await generateAiUseCases({ project_id: projectId })
    if (useCases) {
      setAiUseCases(useCases)
      await updateFetchDataState({ project_id: projectId, aiUseCase: true })
    }
    const rawClusters = await getClusteredAIUserStories({ project_id: projectId })
    if (rawClusters) {
      const transformed = transformClusterData(rawClusters)
      setClusters(transformed)
    }
    setStepProgress(2, 1)
  }, [projectId])

  const stepFns: StepFn[] = [stepProcessAndExtract, stepFetchStories, stepGenerateUseCases]

  const fetchInitialData = useCallback(async () => {
    if (!projectId) return false
    try {
      const states = await fetchDataState({ project_id: projectId })
      if (states.aiUserStories) {
        const stories = await getProjectUserStoriesAI({ project_id: projectId }) as AiUserStory[]
        setAiUserStories(stories)

        const rawClusters = await getClusteredAIUserStories({ project_id: projectId })
        if (rawClusters) {
          const transformed = transformClusterData(rawClusters)
          setClusters(transformed)
        }

        if (states.aiUseCase) {
          const cases = await getAiUseCases({ project_id: projectId })
          if (cases) {
            setAiUseCases(cases)
          }
        }

        setIsComplete(true)
        setIsGenerating(false)
        setProgress(100)

        return true
      }
      return false
    } catch (e) {
      console.error(e)
      return false
    }
  }, [projectId])

  // Runner
  useEffect(() => {
    if (!isGenerating || runningRef.current || !projectId) return
    runningRef.current = true
    cancelRef.current = false
    setIsComplete(false)

      ; (async () => {
        try {
          const initialDataLoaded = await fetchInitialData()

          if (!initialDataLoaded) {
            if (cancelRef.current) return
            for (let i = currentStep; i < stepFns.length; i++) {
              if (cancelRef.current) break
              setCurrentStep(i)
              await safeExecute(i, stepFns[i])
            }
            if (!cancelRef.current) {
              setProgress(100)
              setIsComplete(true)
              setIsGenerating(false)
            }
          }
        } finally {
          runningRef.current = false
        }
      })()
  }, [isGenerating, projectId, currentStep, stepFns, fetchInitialData])

  // Controls
  const restart = () => {
    if (runningRef.current) return
    setCurrentStep(0)
    setProgress(0)
    setAiUserStories([])
    setAiUseCases({ diagrams_url: [] })
    setIsComplete(false)
    setStepErrors(Array(totalSteps).fill(null))
    setStepStats(Array(totalSteps).fill(0).map(() => ({ processed: 0, failed: 0 })))
    setIsGenerating(true)
  }

  const cancel = () => {
    cancelRef.current = true
    setIsGenerating(false)
  }

  const start = () => {
    if (runningRef.current) return
    setIsGenerating(true)
  }

  return {
    // status
    isGenerating,
    isComplete,
    currentStep,
    progress,
    // data
    aiUserStories,
    aiUseCases,
    clusters,
    steps: aiGenerationSteps,
    // diagnostics
    stepErrors,
    stepStats,
    // controls
    start,
    restart,
    cancel
  }
}