/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react"
import { getReviews } from "@/services/appsService"
import { getNews } from "@/services/newsService"
import { getTweets } from "@/services/socialService"
import { cleanContent, extractUserStory, getProjectUserStories } from "@/services/userStoryService"
import type { UserStory, GenerationStep, UseCaseGeneration } from "@/types/requirements"
import { fetchDataState, updateFetchDataState } from "@/services/projectService"
import { generateUseCases, getUseCases } from "@/services/useCaseService"

interface UseRequirementsGenerationOptions {
  projectId?: string
  autoStart?: boolean
}

export const generationSteps: GenerationStep[] = [
  { name: "Analyzing App Data", description: "Processing collected app reviews and features" },
  { name: "Processing News Articles", description: "Extracting insights from industry trends" },
  { name: "Analyzing Social Media", description: "Understanding user sentiment and discussions" },
  { name: "Generating User Stories", description: "Creating user-centered requirements" },
  { name: "Creating Use Cases", description: "Defining system interactions and workflows" }, // placeholder
]

type StepFn = () => Promise<void>

interface StepStats {
  processed: number
  failed: number
}

export function useRequirementsGeneration({
  projectId,
  autoStart = true
}: UseRequirementsGenerationOptions) {
  const [isGenerating, setIsGenerating] = useState(autoStart)
  const [isComplete, setIsComplete] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [userStories, setUserStories] = useState<UserStory[]>([])
  const [useCases, setUseCases] = useState<Partial<UseCaseGeneration>>({
    diagrams_url: []
  })
  const [stepErrors, setStepErrors] = useState<(string | null)[]>(
    () => Array(generationSteps.length).fill(null)
  )
  const [stepStats, setStepStats] = useState<StepStats[]>(
    () => Array(generationSteps.length).fill(0).map(() => ({ processed: 0, failed: 0 }))
  )

  const cancelRef = useRef(false)
  const runningRef = useRef(false)

  const totalSteps = generationSteps.length
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
      // ensure step ends at 100% if fn didn't already
      setStepProgress(stepIndex, 1)
    } catch (e: any) {
      setStepErrors(prev => {
        const next = [...prev]
        next[stepIndex] = e?.message || "Unknown error"
        return next
      })
      // mark step complete so overall progress can continue
      setStepProgress(stepIndex, 1)
    }
  }

  const loopExtract = async <T extends { _id: string }>(
    items: T[],
    stepIndex: number,
    source: "review" | "news" | "tweet"
  ) => {
    const len = items.length
    if (len === 0) {
      setStepProgress(stepIndex, 1)
      return
    }
    for (let i = 0; i < len; i++) {
      if (cancelRef.current) break
      try {
        const item = items[i]
        const cleanedText = await cleanContent({ content_id: item._id, source })
        if (!cleanedText) {
          recordItemResult(stepIndex, false)
        } else {
          await extractUserStory({
            project_id: projectId!,
            source,
            source_id: item._id,
            content: cleanedText
          })
          recordItemResult(stepIndex, true)
        }
      } catch {
        recordItemResult(stepIndex, false)
      }
      setStepProgress(stepIndex, (i + 1) / len)
    }
  }

  // Step implementations
  const stepReviews: StepFn = useCallback(async () => {
    if (!projectId) return
    const reviews = await getReviews({ project_id: projectId })
    await loopExtract(reviews, 0, "review")
  }, [projectId])

  const stepNews: StepFn = useCallback(async () => {
    if (!projectId) return
    const news = await getNews({ project_id: projectId })
    await loopExtract(news, 1, "news")
  }, [projectId])

  const stepTweets: StepFn = useCallback(async () => {
    if (!projectId) return
    const tweets = await getTweets({ project_id: projectId })
    await loopExtract(tweets, 2, "tweet")
  }, [projectId])

  const stepFetchStories: StepFn = useCallback(async () => {
    if (!projectId) return
    setStepProgress(3, 0)
    const stories = await getProjectUserStories({ project_id: projectId })
    setUserStories(stories)
    await updateFetchDataState({ project_id: projectId, userStories: true })
    setStepProgress(3, 1)
  }, [projectId])

  const stepUseCasesPlaceholder: StepFn = useCallback(async () => {
    if (!projectId) return
    setStepProgress(4, 0)
    const useCases = await generateUseCases({ project_id: projectId })
    if (useCases) {
      setUseCases(useCases)
      await updateFetchDataState({ project_id: projectId, useCase: true })
    }
    setStepProgress(4, 1)
  }, [])

  const stepFns: StepFn[] = [
    stepReviews,
    stepNews,
    stepTweets,
    stepFetchStories,
    stepUseCasesPlaceholder
  ]

  const fetchInitialData = useCallback(async () => {
    if (!projectId) return
    try {
      const states = await fetchDataState({ project_id: projectId })
      if (states.userStories) {
        const stories = await getProjectUserStories({ project_id: projectId })
        setUserStories(stories)
        if (states.useCase) {
          const cases = await getUseCases({ project_id: projectId })
          if (cases) {
            setUseCases(cases)
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
          const initial = await fetchInitialData()
          console.log("initial :", initial)
          if (!initial) {
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
  }, [isGenerating, projectId, currentStep, stepFns])

  // Controls
  const restart = () => {
    if (runningRef.current) return
    setCurrentStep(0)
    setProgress(0)
    setUserStories([])
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
    userStories,
    steps: generationSteps,
    useCases,
    // diagnostics
    stepErrors,
    stepStats,
    // controls
    start,
    restart,
    cancel
  }
}