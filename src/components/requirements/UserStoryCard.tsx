import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { UserStory } from "@/types/requirements"
import { SourcesList } from "./SourcesList"

interface Props {
  story: UserStory
}

/**
 * Single user story card.
 */
export function UserStoryCard({ story }: Props) {
  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="font-mono text-xs">
                {story._id}
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
            As a {story.who}, I want to {story.what}
            {story.why ? `, so that {story.why}.` : "."}
          </p>
        </div>
        <div>
          <h4 className="font-medium text-black mb-3">Source</h4>
          <SourcesList source={story.source_data} />
        </div>
      </CardContent>
    </Card>
  )
}
