/**
 * Full-screen generation progress UI.
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { GenerationStep } from "@/types/requirements"
import { Loader2 } from "lucide-react"

interface StepStats {
  processed: number
  failed: number
}

interface Props {
  currentStep: number
  progress: number
  steps: GenerationStep[]
  stepErrors: (string | null)[]
  stepStats: StepStats[]
  onCancel?: () => void
}

export function GenerationProgress({
  currentStep,
  progress,
  steps,
  stepErrors,
  stepStats,
  onCancel
}: Props) {
  const errorCount = stepErrors.filter(Boolean).length

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black tracking-tight mb-3">Generating Requirements</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Analyzing collected data sources to produce user stories and (placeholder) use cases.
          </p>
          {errorCount > 0 && (
            <div className="mt-4 inline-block rounded-md bg-red-50 px-3 py-1 text-sm text-red-700 border border-red-200">
              {errorCount} step{errorCount > 1 ? "s" : ""} reporting errors (continuing)
            </div>
          )}
        </div>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-black flex items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-black" />
              Processing Data
            </CardTitle>
            <CardDescription className="text-lg">
              Step {Math.min(currentStep + 1, steps.length)} of {steps.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-black">Overall Progress</span>
                <span className="text-sm text-gray-700 font-mono">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3 bg-gray-100" />
            </div>

            <div className="space-y-3">
              {steps.map((step, index) => {
                const state =
                  index < currentStep ? "done" : index === currentStep ? "active" : "pending"
                const hasError = !!stepErrors[index]
                const stats = stepStats[index]
                const rowBase =
                  state === "done"
                    ? "bg-green-50 border-green-200"
                    : state === "active"
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50 border-gray-200"
                const rowError =
                  hasError ? "bg-red-50 border-red-300" : rowBase

                return (
                  <div
                    key={index}
                    className={`flex flex-col gap-1 p-3 rounded-md border transition-colors ${rowError}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        {hasError ? (
                          <div className="h-5 w-5 rounded-full bg-red-600 flex items-center justify-center text-white text-[10px] font-bold">
                            !
                          </div>
                        ) : state === "done" ? (
                          <div className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center">
                            <div className="h-2 w-2 bg-white rounded-full" />
                          </div>
                        ) : state === "active" ? (
                          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`text-sm font-medium ${hasError
                            ? "text-red-700"
                            : index <= currentStep
                              ? "text-black"
                              : "text-gray-500"
                            }`}
                        >
                          {step.name}
                        </h4>
                        <p
                          className={`text-xs ${hasError
                            ? "text-red-600"
                            : index <= currentStep
                              ? "text-gray-600"
                              : "text-gray-400"
                            }`}
                        >
                          {hasError ? stepErrors[index] : step.description}
                        </p>
                        {(stats.processed > 0 || stats.failed > 0) && (
                          <div className="text-[11px] font-mono mt-1">
                            <span className="text-gray-700">
                              {stats.processed + stats.failed} items
                            </span>
                            {stats.processed > 0 && (
                              <span className="ml-2 text-green-700">
                                ok:{stats.processed}
                              </span>
                            )}
                            {stats.failed > 0 && (
                              <span className="ml-2 text-red-700">
                                failed:{stats.failed}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {onCancel && (
              <div className="flex justify-end">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}