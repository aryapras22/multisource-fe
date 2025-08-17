/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Top header section with navigation + actions.
 */
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Target } from "lucide-react"

interface Props {
  onBack: () => void
  onExport: () => void
  onStartPlanning: () => void
  userStoriesCount: number
  useCasesCount: number
}

export function RequirementsHeader({
  onBack,
  onExport,
  onStartPlanning
}: Props) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack} className="border-gray-300 hover:bg-gray-50">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-4xl font-bold text-black tracking-tight">Generated Requirements</h1>
          <p className="text-gray-600 mt-2">
            AI-generated user stories and use case diagrams based on your comprehensive data analysis.
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onExport} className="border-gray-300 hover:bg-gray-50 bg-transparent">
          <Download className="h-4 w-4 mr-2" />
          Export (PDF, DOCX, PNG)
        </Button>
        {/* <Button onClick={onStartPlanning} className="bg-black hover:bg-gray-800 text-white">
          <Target className="h-4 w-4 mr-2" />
          Start Development Planning
        </Button> */}
      </div>
    </div>
  )
}