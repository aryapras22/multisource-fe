import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AiUserStory } from "@/hooks/useAiRequirementsGeneration"
import { SourcesList } from "@/components/requirements/SourcesList"

interface Props {
  story: AiUserStory
}

/**
 * Card component for displaying AI-generated user stories.
 */
export function AiUserStoryCard({ story }: Props) {
  // Create source data object for SourcesList component
  const sourceData = story.source_data || {
    type: story.content_type,
    title: `Evidence (${story.content_type})`,
    content: story.evidence,
    author: undefined
  }

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="font-mono text-xs">
                {story._id.substring(0, 8)}
              </Badge>

              {/* Add sentiment and confidence as subtle indicators */}
              <Badge variant="outline" className={
                story.sentiment === "positive" ? "bg-green-50 text-green-700 border-green-200" :
                  story.sentiment === "negative" ? "bg-red-50 text-red-700 border-red-200" :
                    "bg-blue-50 text-blue-700 border-blue-200"
              }>
                Sentiment: {story.sentiment}
              </Badge>
              <Badge variant="outline">
                Confidence Score: {Math.round(story.confidence * 100)}%
              </Badge>
            </div>

            {/* Separated Who, What, Why sections */}
            <div className="space-y-2 text-black">
              <p className="text-base">
                <span className="font-semibold">Who:</span> {story.who}
              </p>
              <p className="text-base">
                <span className="font-semibold">What:</span> {story.what}
              </p>
              {story.why && (
                <p className="text-base">
                  <span className="font-semibold">Why:</span> {story.why}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-black mb-2">User Story Statement</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {story.as_a_i_want_so_that || `As a ${story.who}, I want to ${story.what}${story.why ? `, so that ${story.why}` : ''}.`}
          </p>
        </div>
        <div>
          <h4 className="font-medium text-black mb-2">Evidence</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {story.evidence}
          </p>
        </div>
        <div>
          <h4 className="font-medium text-black mb-3">Source</h4>
          <SourcesList source={sourceData} />
        </div>
      </CardContent>
    </Card>
  )
}