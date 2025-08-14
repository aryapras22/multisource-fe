/**
 * Tab content for user stories.
 */
import type { UserStory } from "@/types/requirements"
import { UserStoryCard } from "./UserStoryCard"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Props {
  stories: UserStory[]
}

export function UserStoriesList({ stories }: Props) {
  const groupedStories = stories.reduce(
    (acc, story) => {
      const type = story.source_data.type || "other"
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(story)
      return acc
    },
    {} as Record<string, UserStory[]>
  )

  const sourceOrder = ["news", "review", "tweet"]
  const sortedGroups = Object.keys(groupedStories).sort((a, b) => {
    const aIndex = sourceOrder.indexOf(a)
    const bIndex = sourceOrder.indexOf(b)
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b)
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1
    return aIndex - bIndex
  })

  if (sortedGroups.length === 0) {
    return null
  }

  return (
    <Tabs defaultValue={sortedGroups[0]} className="w-full">
      <TabsList>
        {sortedGroups.map(type => (
          <TabsTrigger key={type} value={type} className="capitalize flex items-center gap-2">
            {type}
            <Badge variant="secondary">{groupedStories[type].length}</Badge>
          </TabsTrigger>
        ))}
      </TabsList>
      {sortedGroups.map(type => (
        <TabsContent key={type} value={type} className="mt-6">
          <div className="space-y-6">
            {groupedStories[type].map(story => (
              <UserStoryCard key={story._id} story={story} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}