/**
 * Displays summary stats (counts).
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, FileText } from "lucide-react"

interface Props {
  userStoriesCount: number
  useCasesCount: number
}

export function StatsOverview({ userStoriesCount, useCasesCount }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-black flex items-center gap-2">
            <User className="h-5 w-5" />
            User Stories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-black mb-2">{userStoriesCount}</div>
          <p className="text-sm text-gray-600">User-centered requirements with source traceability</p>
        </CardContent>
      </Card>
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-black flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Use Case Diagrams
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-black mb-2">{useCasesCount}</div>
          <p className="text-sm text-gray-600">Visual system interaction diagrams</p>
        </CardContent>
      </Card>
    </div>
  )
}