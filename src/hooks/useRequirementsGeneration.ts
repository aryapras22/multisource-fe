/**
 * Encapsulates the timed generation simulation.
 * Return values can later be wired to real async jobs.
 */
import { getReviews } from "@/services/appsService"
import { getNews } from "@/services/newsService"
import { getTweets } from "@/services/socialService"
import { cleanContent, extractUserStory, getProjectUserStories } from "@/services/userStoryService"
import type { UserStory, GenerationStep } from "@/types/requirements"
import { useCallback, useEffect, useRef, useState } from "react"

interface UseRequirementsGenerationOptions {
  projectId?: string
  steps?: GenerationStep[]
  autoStart?: boolean
  stepDelayMinMs?: number
  stepDelayMaxMs?: number
}
export const generationSteps: GenerationStep[] = [
  { name: "Analyzing App Data", description: "Processing collected app reviews and features" },
  { name: "Processing News Articles", description: "Extracting insights from industry trends" },
  { name: "Analyzing Social Media", description: "Understanding user sentiment and discussions" },
  { name: "Generating User Stories", description: "Creating user-centered requirements" },
  { name: "Creating Use Cases", description: "Defining system interactions and workflows" },
]

export function useRequirementsGeneration({
  projectId,
  autoStart = true,
  stepDelayMinMs = 2000,
  stepDelayMaxMs = 3000
}: UseRequirementsGenerationOptions) {
  const [isGenerating, setIsGenerating] = useState(autoStart)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [userStories, setUserStories] = useState<UserStory[]>([])
  const cancelRef = useRef(false)


  const extractReviewUserStories = useCallback(async () => {
    if (!projectId) return
    const reviews = await getReviews({ project_id: projectId })
    for (const r of reviews) {
      if (cancelRef.current) break
      const cleanedText = await cleanContent({
        content_id: r._id,
        source: "review"
      })
      if (!cleanedText) continue;
      const res = await extractUserStory({
        project_id: projectId,
        source: "review",
        source_id: r._id,
        content: cleanedText
      })
      console.log(res)
    }
  }, [projectId])

  const extractNewsUserStories = useCallback(async () => {
    if (!projectId) return;
    const news = await getNews({ project_id: projectId })
    for (const n of news) {
      if (cancelRef.current) break;
      const cleanedText = await cleanContent({
        content_id: n._id,
        source: "news"
      });
      if (!cleanedText) continue;
      const res = await extractUserStory({
        project_id: projectId,
        source: "news",
        source_id: n._id,
        content: cleanedText,
      })
      console.log(res)
    }

  }, [projectId])

  const extractTweetsUserStories = useCallback(async () => {
    if (!projectId) return;
    const tweets = await getTweets({ project_id: projectId })
    for (const t of tweets) {
      if (cancelRef.current) break;
      const cleanedText = await cleanContent({
        content_id: t._id,
        source: "tweet"
      });
      if (!cleanedText) continue;
      const res = await extractUserStory({
        project_id: projectId,
        source: "tweet",
        source_id: t._id,
        content: cleanedText,
      })
      console.log(res)
    }
  }, [projectId])

  const fetchProjectUserStories = useCallback(async () => {
    if (!projectId) return;
    const userStories = await getProjectUserStories({ project_id: projectId })
    setUserStories(userStories);
  }, [projectId])


  useEffect(() => {
    if (!isGenerating) return
  }, [isGenerating, stepDelayMinMs, stepDelayMaxMs])

  return {
    isGenerating,
    currentStep,
    progress,
    userStories,
    steps: generationSteps,
    restart: () => {
      setCurrentStep(0)
      setProgress(0)
      setIsGenerating(true)
    }
  }
}