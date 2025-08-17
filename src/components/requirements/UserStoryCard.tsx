import {
  AlertCircle,
  Brain,
  CheckCircle2,
  ExternalLink,
  Lightbulb,
  Target,
  TrendingUp,
  User,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { UserStory } from "@/types/requirements"
import { SourcesList } from "./SourcesList"

interface Props {
  story: UserStory
}

/**
 * Single user story card, styled similarly to the AI-generated story card.
 */
export function UserStoryCard({ story }: Props) {
  const getSimilarityColor = (score: number) => {
    if (score >= 0.8) return "bg-green-50 text-green-700 border-green-200"
    if (score >= 0.6) return "bg-yellow-50 text-yellow-700 border-yellow-200"
    return "bg-red-50 text-red-700 border-red-200"
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "news":
        return "📰"
      case "review":
        return "⭐"
      case "tweet":
        return "💬"
      default:
        return "📄"
    }
  }

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Header badges */}
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="font-mono text-xs">
                {story._id.substring(0, 8)}
              </Badge>
              <Badge variant="outline" className={getSimilarityColor(story.similarity_score)}>
                {Math.round(story.similarity_score * 100)}% similarity
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {getContentTypeIcon(story.source)} {story.source}
              </Badge>
            </div>

            {/* Who, What, Why sections with icons */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 flex-shrink-0">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Who</p>
                  <p className="text-base text-gray-900">{story.who}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 flex-shrink-0">
                  <Target className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">What</p>
                  <p className="text-base text-gray-900">{story.what}</p>
                </div>
              </div>

              {story.why && (
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 flex-shrink-0">
                    <Lightbulb className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Why</p>
                    <p className="text-base text-gray-900">{story.why}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* User Story Statement */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            User Story Statement
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed italic">
            "As a {story.who}, I want to {story.what}
            {story.why ? `, so that ${story.why}` : ""}.
          </p>
        </div>

        {/* Insights Section */}
        {story.insight && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Business Insights
            </h4>
            <div className="space-y-4">
              {story.insight.business_impact && (
                <div className="border-l-4 border-blue-200 pl-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Business Impact</p>
                  <p className="text-sm text-gray-600">{story.insight.business_impact}</p>
                </div>
              )}

              {story.insight.pain_point_jtbd && (
                <div className="border-l-4 border-orange-200 pl-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Pain Point / Job to be Done</p>
                  <p className="text-sm text-gray-600">{story.insight.pain_point_jtbd}</p>
                </div>
              )}

              {story.insight.nfr && story.insight.nfr.length > 0 && (
                <div className="border-l-4 border-green-200 pl-4">
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
            </div>
          </div>
        )}

        {/* Evidence Section */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Evidence
          </h4>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{story.full_sentence}</p>
          </div>
        </div>

        {/* Source Section */}
        {story.source_data && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Source
            </h4>
            <SourcesList source={story.source_data} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}