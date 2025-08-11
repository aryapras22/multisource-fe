import type { AiUserStory } from "@/hooks/useAiRequirementsGeneration"
import { AiUserStoryCard } from "./AiUserStory"

interface Props {
  stories: AiUserStory[]
}

export function AiUserStoriesList({ stories }: Props) {
  return (
    <div className="space-y-6">
      {stories.map(story => (
        <AiUserStoryCard key={story._id} story={story} />
      ))}
    </div>
  )
}