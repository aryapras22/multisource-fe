/**
 * Full-screen generation progress UI.
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { GenerationStep } from "@/types/requirements"
import { Loader2 } from "lucide-react"

interface Props {
  currentStep: number
  progress: number
  steps: GenerationStep[]
}

export function GenerationProgress({ currentStep, progress, steps }: Props) {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black tracking-tight mb-4">Generating Requirements</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI is analyzing all collected data to generate comprehensive user stories and use case diagrams for your
            project.
          </p>
        </div>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-black flex items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-black" />
              Processing Your Data
            </CardTitle>
            <CardDescription className="text-lg">
              Step {currentStep + 1} of {steps.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-black">Overall Progress</span>
                <span className="text-sm text-gray-600 font-mono">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3 bg-gray-100" />
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold text-black mb-2">{steps[currentStep]?.name}</h3>
              <p className="text-sm text-gray-600">{steps[currentStep]?.description}</p>
            </div>
            <div className="space-y-3">
              {steps.map((step, index) => {
                const state =
                  index < currentStep ? "done" : index === currentStep ? "active" : "pending"
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-md ${state === "done"
                      ? "bg-green-50 border border-green-200"
                      : state === "active"
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-gray-50 border border-gray-200"
                      }`}
                  >
                    <div className="shrink-0">
                      {state === "done" ? (
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
                        className={`text-sm font-medium ${index <= currentStep ? "text-black" : "text-gray-500"
                          }`}
                      >
                        {step.name}
                      </h4>
                      <p
                        className={`text-xs ${index <= currentStep ? "text-gray-600" : "text-gray-400"
                          }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}