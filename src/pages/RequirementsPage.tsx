import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockUseCases, mockUserStories } from "@/data/mockRequirements"
import { useRequirementsGeneration } from "@/hooks/useRequirementsGeneration"
import { RequirementsHeader } from "@/components/requirements/RequirementsHeader"
import { StatsOverview } from "@/components/requirements/StatsOverview"
import { UserStoriesList } from "@/components/requirements/UserStoriesList"
import { UseCasesGrid } from "@/components/requirements/UseCasesGrid"
import { GenerationProgress } from "@/components/requirements/GenerationProgress"

export default function RequirementsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("user-stories")

  const { isGenerating, currentStep, progress, steps } = useRequirementsGeneration({
    projectId: id,
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
      />
    )
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto py-8">
        <RequirementsHeader
          onBack={handleBack}
          onExport={handleExport}
          onStartPlanning={handleStartDevelopment}
          userStoriesCount={mockUserStories.length}
          useCasesCount={mockUseCases.length}
        />
        <StatsOverview
          userStoriesCount={mockUserStories.length}
          useCasesCount={mockUseCases.length}
        />
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger value="user-stories" className="data-[state=active]:bg-white data-[state=active]:text-black">
              User Stories ({mockUserStories.length})
            </TabsTrigger>
            <TabsTrigger value="use-cases" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Use Case Diagrams ({mockUseCases.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="user-stories" className="mt-6">
            <UserStoriesList stories={mockUserStories} />
          </TabsContent>
          <TabsContent value="use-cases" className="mt-6">
            <UseCasesGrid useCases={mockUseCases} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
// ...existing code...