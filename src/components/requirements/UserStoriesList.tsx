/**
 * Tab content for user stories.
 */
import type { UserStory } from "@/types/requirements"
import { UserStoryCard } from "./UserStoryCard"

interface Props {
  stories: UserStory[]
}

export function UserStoriesList({ stories }: Props) {
  return (
    <div className="space-y-6">
      {stories.map(story => (
        <UserStoryCard key={story._id} story={story} />
      ))}
    </div>
  )
}