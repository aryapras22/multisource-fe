import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRequirementsGeneration } from "@/hooks/useRequirementsGeneration"
import { RequirementsHeader } from "@/components/requirements/RequirementsHeader"
import { StatsOverview } from "@/components/requirements/StatsOverview"
import { UserStoriesList } from "@/components/requirements/UserStoriesList"
import { UseCasesGrid } from "@/components/requirements/UseCasesGrid"
import { GenerationProgress } from "@/components/requirements/GenerationProgress"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const placeholderUseCases: any[] = []

export default function RequirementsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("user-stories")

  const {
    isGenerating,
    currentStep,
    progress,
    steps,
    userStories,
    stepErrors,
    stepStats,
    isComplete,
    restart,
    cancel
  } = useRequirementsGeneration({
    projectId: id,
    autoStart: true
  })

  const handleExport = () => alert("Export triggered.")
  const handleStartDevelopment = () => alert("Start development planning.")
  const handleBack = () => {
    if (id) navigate(`/project/${id}/dashboard`)
    else navigate("/")
  }

  if (isGenerating) {
    return (
      <GenerationProgress
        currentStep={currentStep}
        progress={progress}
        steps={steps}
        stepErrors={stepErrors}
        stepStats={stepStats}
        onCancel={cancel}
      />
    )
  }

  const errorCount = stepErrors.filter(Boolean).length
  const storiesCount = userStories.length

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto py-8">
        <RequirementsHeader
          onBack={handleBack}
          onExport={handleExport}
          onStartPlanning={handleStartDevelopment}
          userStoriesCount={storiesCount}
          useCasesCount={placeholderUseCases.length}
        />

        <div className="flex items-start justify-between mb-4 gap-4">
          <StatsOverview
            userStoriesCount={storiesCount}
            useCasesCount={placeholderUseCases.length}
          />
          {isComplete && (
            <button
              onClick={restart}
              className="text-sm px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              Regenerate
            </button>
          )}
        </div>

        {errorCount > 0 && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Completed with {errorCount} step error{errorCount > 1 ? "s" : ""}. You can regenerate to retry.
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger value="user-stories" className="data-[state=active]:bg-white data-[state=active]:text-black">
              User Stories ({storiesCount})
            </TabsTrigger>
            <TabsTrigger value="use-cases" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Use Case Diagrams ({placeholderUseCases.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="user-stories" className="mt-6">
            {storiesCount > 0 ? (
              <UserStoriesList stories={userStories} />
            ) : (
              <div className="text-sm text-gray-600 border rounded-md p-6">
                No user stories generated.
              </div>
            )}
          </TabsContent>
          <TabsContent value="use-cases" className="mt-6">
            <UseCasesGrid useCases={placeholderUseCases} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}