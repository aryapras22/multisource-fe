import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  User,
  Target,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Brain,
  FileText,
  MessageSquare,
  Newspaper,
  Star,
} from "lucide-react"
import type { ClusterStory } from "@/types/clustering"

interface Props {
  story: ClusterStory | null
  isOpen: boolean
  onClose: () => void
}

export function StoryDetailModal({ story, isOpen, onClose }: Props) {
  if (!story) return null

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "news":
        return <Newspaper className="h-4 w-4" />
      case "review":
        return <Star className="h-4 w-4" />
      case "tweet":
      case "social":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case "news":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "review":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "tweet":
      case "social":
        return "bg-purple-50 text-purple-700 border-purple-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-50 text-green-700 border-green-200"
    if (confidence >= 0.6) return "bg-yellow-50 text-yellow-700 border-yellow-200"
    return "bg-red-50 text-red-700 border-red-200"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>User Story Details</span>
            <Badge variant="outline" className="font-mono text-sm">
              {story._id.substring(0, 8)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6 pr-4">
            {/* Header badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={getSourceColor(story.source)}>
                {getSourceIcon(story.source)}
                <span className="ml-1">{story.source}</span>
              </Badge>
              <Badge variant="outline" className="text-sm">
                {Math.round(story.similarity_score * 100)}% similarity
              </Badge>
              {story.insight?.fit_score && (
                <Badge variant="outline" className={getConfidenceColor(story.insight.fit_score.score)}>
                  {Math.round(story.insight.fit_score.score * 100)}% confidence
                </Badge>
              )}
            </div>

            {/* Who, What, Why sections with enhanced colors */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 flex-shrink-0">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-600 mb-1">Who</p>
                  <p className="text-lg text-blue-800 font-medium">{story.who}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 flex-shrink-0">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-600 mb-1">What</p>
                  <p className="text-lg text-green-800 font-medium">{story.what}</p>
                </div>
              </div>

              {story.why && (
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-purple-600 mb-1">Why</p>
                    <p className="text-lg text-purple-800 font-medium">{story.why}</p>
                  </div>
                </div>
              )}
            </div>

            {/* User Story Statement */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                User Story Statement
              </h4>
              <p className="text-base text-gray-700 leading-relaxed italic">
                "<span className="font-bold text-black">As a</span>{" "}
                <span className="text-blue-700 font-medium">{story.who}</span>,{" "}
                <span className="font-bold text-black">I want to</span>{" "}
                <span className="text-green-700 font-medium">{story.what}</span>
                {story.why && (
                  <>
                    {" "}
                    <span className="font-bold text-black">so that</span>{" "}
                    <span className="text-purple-700 font-medium">{story.why}</span>
                  </>
                )}
                ."
              </p>
            </div>

            {/* Insights Section */}
            {story.insight && (
              <>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Business Insights
                  </h4>
                  <div className="space-y-4">
                    {story.insight.business_impact && (
                      <div className="border-l-4 border-blue-200 pl-4 bg-blue-50 p-3 rounded-r-lg">
                        <p className="text-sm font-medium text-gray-700 mb-1">Business Impact</p>
                        <p className="text-sm text-gray-600">{story.insight.business_impact}</p>
                      </div>
                    )}

                    {story.insight.pain_point_jtbd && (
                      <div className="border-l-4 border-orange-200 pl-4 bg-orange-50 p-3 rounded-r-lg">
                        <p className="text-sm font-medium text-gray-700 mb-1">Pain Point / Job to be Done</p>
                        <p className="text-sm text-gray-600">{story.insight.pain_point_jtbd}</p>
                      </div>
                    )}

                    {story.insight.nfr && story.insight.nfr.length > 0 && (
                      <div className="border-l-4 border-green-200 pl-4 bg-green-50 p-3 rounded-r-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">Non-Functional Requirements</p>
                        <div className="flex flex-wrap gap-2">
                          {story.insight.nfr.map((req) => (
                            <Badge key={req} variant="secondary" className="text-xs">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {story.insight.fit_score && (
                      <div className="border-l-4 border-purple-200 pl-4 bg-purple-50 p-3 rounded-r-lg">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Fit Score: {Math.round(story.insight.fit_score.score * 100)}%
                        </p>
                        <p className="text-sm text-gray-600">{story.insight.fit_score.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}



            {/* Technical Details */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Technical Details
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Story ID</p>
                  <p className="font-mono text-gray-900">{story._id}</p>
                </div>
                <div>
                  <p className="text-gray-600">Source ID</p>
                  <p className="font-mono text-gray-900">{story.source_id}</p>
                </div>
                <div>
                  <p className="text-gray-600">Project ID</p>
                  <p className="font-mono text-gray-900">{story.project_id}</p>
                </div>
                <div>
                  <p className="text-gray-600">Similarity Score</p>
                  <p className="font-mono text-gray-900">{story.similarity_score && story.similarity_score.toFixed(4)}</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
