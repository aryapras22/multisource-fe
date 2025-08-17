import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  User,
  Target,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Calendar,
  Brain,
} from "lucide-react"
import type { AiUserStory } from "@/hooks/useAiRequirementsGeneration"


interface Props {
  story: AiUserStory
}

/**
 * Enhanced card component for displaying AI-generated user stories.
 */
export function AiUserStoryCard({ story }: Props) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "negative":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-50 text-green-700 border-green-200"
    if (confidence >= 0.6) return "bg-yellow-50 text-yellow-700 border-yellow-200"
    return "bg-red-50 text-red-700 border-red-200"
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "news":
        return "📰"
      case "review":
        return "⭐"
      case "social":
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
              <Badge variant="outline" className={getSentimentColor(story.sentiment)}>
                {story.sentiment}
              </Badge>
              <Badge variant="outline" className={getConfidenceColor(story.confidence)}>
                {Math.round(story.confidence * 100)}% confidence
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {getContentTypeIcon(story.content_type)} {story.content_type}
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
            "
            {story.as_a_i_want_so_that ||
              `As a ${story.who}, I want to ${story.what}${story.why ? `, so that ${story.why}` : ""}.`}
            "
          </p>
        </div>

        {/* Insights Section */}
        {story.field_insight && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Business Insights
            </h4>
            <div className="space-y-4">
              {story.field_insight.business_impact && (
                <div className="border-l-4 border-blue-200 pl-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Business Impact</p>
                  <p className="text-sm text-gray-600">{story.field_insight.business_impact}</p>
                </div>
              )}

              {story.field_insight.pain_point_jtbd && (
                <div className="border-l-4 border-orange-200 pl-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Pain Point / Job to be Done</p>
                  <p className="text-sm text-gray-600">{story.field_insight.pain_point_jtbd}</p>
                </div>
              )}

              {story.field_insight.nfr && story.field_insight.nfr.length > 0 && (
                <div className="border-l-4 border-green-200 pl-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Non-Functional Requirements</p>
                  <div className="flex flex-wrap gap-2">
                    {story.field_insight.nfr.map((req) => (
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
            <p className="text-sm text-gray-700 leading-relaxed">{story.evidence}</p>
          </div>
        </div>

        {/* Source Section */}
        {story.source_data && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Source
            </h4>
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900 text-sm mb-1">{story.source_data.title}</h5>
                  {story.source_data.author && (
                    <p className="text-xs text-gray-500 mb-2">by {story.source_data.author}</p>
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  {getContentTypeIcon(story.source_data.type)} {story.source_data.type}
                </Badge>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-3">
                {story.source_data.content}

                {/* {story.source_data.content.substring(0, 1000)} */}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {new Date(story.created_at).toLocaleDateString()}
                </div>
                {story.source_data.link && (
                  <Button variant="outline" size="sm" asChild className="h-7 text-xs bg-transparent">
                    <a
                      href={story.source_data.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Source
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
