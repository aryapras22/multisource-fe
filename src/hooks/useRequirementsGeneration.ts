/**
 * Encapsulates the timed generation simulation.
 * Return values can later be wired to real async jobs.
 */
import type { GenerationStep } from "@/types/requirements"
import { useEffect, useState } from "react"

interface UseRequirementsGenerationOptions {
  steps: GenerationStep[]
  autoStart?: boolean
  stepDelayMinMs?: number
  stepDelayMaxMs?: number
}

export function useRequirementsGeneration({
  steps,
  autoStart = true,
  stepDelayMinMs = 2000,
  stepDelayMaxMs = 3000
}: UseRequirementsGenerationOptions) {
  const [isGenerating, setIsGenerating] = useState(autoStart)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isGenerating) return
    let cancelled = false
      ; (async () => {
        for (let i = 0; i < steps.length; i++) {
          if (cancelled) return
          setCurrentStep(i)
          setProgress((i / steps.length) * 100)
          const delay = stepDelayMinMs + Math.random() * (stepDelayMaxMs - stepDelayMinMs)
          await new Promise(r => setTimeout(r, delay))
        }
        if (!cancelled) {
          setProgress(100)
          await new Promise(r => setTimeout(r, 800))
          setIsGenerating(false)
        }
      })()
    return () => {
      cancelled = true
    }
  }, [isGenerating, steps, stepDelayMinMs, stepDelayMaxMs])

  return {
    isGenerating,
    currentStep,
    progress,
    totalSteps: steps.length,
    steps,
    restart: () => {
      setCurrentStep(0)
      setProgress(0)
      setIsGenerating(true)
    }
  }
}