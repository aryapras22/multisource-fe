"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

import { Search, Users, Star, Crown, FileText, MessageSquare, Newspaper } from "lucide-react"
import type { ClusteringData, ClusterStory } from "@/types/clustering"
import { StoryDetailModal } from "./StoryDetailModal"


interface Props {
  data: ClusteringData
}

function StoryCard({
  story,
  isRepresentative = false,
  onClick,
}: {
  story: ClusterStory
  isRepresentative?: boolean
  onClick?: () => void
}) {
  const getSourceIcon = (source: string) => {
    switch (source) {
      case "news":
        return <Newspaper className="h-3 w-3" />
      case "review":
        return <Star className="h-3 w-3" />
      case "tweet":
      case "social":
        return <MessageSquare className="h-3 w-3" />
      default:
        return <FileText className="h-3 w-3" />
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

  return (
    <Card
      className={`${isRepresentative ? "border-2 border-blue-300 bg-blue-50" : "border border-gray-200"
        } cursor-pointer hover:shadow-md transition-shadow duration-200`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              {story._id.substring(0, 8)}
            </Badge>
            {isRepresentative && (
              <Badge className="bg-blue-600 text-white text-xs flex items-center gap-1">
                <Crown className="h-3 w-3" />
                Representative
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-xs flex items-center gap-1 ${getSourceColor(story.source)}`}>
              {getSourceIcon(story.source)}
              {story.source}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {Math.round(story.similarity_score * 100)}%
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-700">
            <span className="font-bold text-black">As a</span>{" "}
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
            .
          </p>

          {story.insight && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className={`text-xs ${story.insight.fit_score && story.insight.fit_score.score >= 0.8
                    ? "bg-green-50 text-green-700 border-green-200"
                    : story.insight.fit_score && story.insight.fit_score.score >= 0.6
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : "bg-red-50 text-red-700 border-red-200"
                    }`}
                >
                  {story.insight.fit_score
                    ? `${Math.round(story.insight.fit_score.score * 100)}% confidence`
                    : "Analyzed"}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                <span className="font-medium">Business Impact:</span> {story.insight.business_impact}
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Pain Point:</span> {story.insight.pain_point_jtbd}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function ClusterView({ data }: Props) {
  const [selectedCluster, setSelectedCluster] = useState<number | "all">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStory, setSelectedStory] = useState<ClusterStory | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleStoryClick = (story: ClusterStory) => {
    setSelectedStory(story)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedStory(null)
  }

  const filteredClusters = data.clusters
    .filter((cluster) => {
      if (selectedCluster !== "all" && cluster.cluster_id !== selectedCluster) {
        return false
      }

      if (searchTerm === "") return true

      const searchLower = searchTerm.toLowerCase()
      return (
        cluster.representative_story.who.toLowerCase().includes(searchLower) ||
        cluster.representative_story.what.toLowerCase().includes(searchLower) ||
        (cluster.representative_story.why && cluster.representative_story.why.toLowerCase().includes(searchLower)) ||
        cluster.stories.some(
          (story) =>
            story.who.toLowerCase().includes(searchLower) ||
            story.what.toLowerCase().includes(searchLower) ||
            (story.why && story.why.toLowerCase().includes(searchLower)),
        )
      )
    })
    .sort((a, b) => b.size - a.size) // Sort by size descending

  const totalStories = data.clusters.reduce((sum, cluster) => sum + cluster.size, 0)
  const clustersWithInsights = data.clusters.filter((c) => c.representative_story.insight).length

  return (
    <>
      <>
        {/* Header */}
        <Card className="border border-gray-200 space-y-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-black">User Story Clusters</CardTitle>
                <p className="text-gray-600 mt-1">
                  {data.clusters.length} clusters containing {totalStories} user stories
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {clustersWithInsights} analyzed
                </Badge>
                <Badge variant="outline" className="font-mono text-xs">
                  {data.project_id.substring(0, 8)}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search user stories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={selectedCluster.toString()}
                onValueChange={(value) => setSelectedCluster(value === "all" ? "all" : Number.parseInt(value))}
              >
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Filter by cluster" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clusters ({data.clusters.length})</SelectItem>
                  {data.clusters
                    .sort((a, b) => b.size - a.size)
                    .map((cluster) => (
                      <SelectItem key={cluster.cluster_id} value={cluster.cluster_id.toString()}>
                        Cluster #{cluster.cluster_id}: {cluster.representative_story.what} ({cluster.size} stories)
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Showing {filteredClusters.length} of {data.clusters.length} clusters
            </p>
          </CardContent>
        </Card>

        {/* Clusters */}
        <div className="space-y-8">
          {filteredClusters.map((cluster) => {
            const childStories = cluster.stories.filter((story) => story._id !== cluster.representative_story._id)

            return (
              <Card key={cluster.cluster_id} className="border border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                      <Badge variant="outline" className="text-base px-3 py-1">
                        Cluster #{cluster.cluster_id}
                      </Badge>
                      <span className="text-gray-600">•</span>
                      <span className="text-lg">{cluster.size} Stories</span>
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {cluster.sources.map((source) => (
                        <Badge key={source} variant="secondary" className="text-xs">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Representative Story */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Crown className="h-5 w-5 text-blue-600" />
                      Representative Story
                    </h3>
                    <StoryCard
                      story={cluster.representative_story}
                      isRepresentative={true}
                      onClick={() => handleStoryClick(cluster.representative_story)}
                    />
                  </div>

                  {/* Child Stories */}
                  {childStories.length > 0 && (
                    <>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Users className="h-5 w-5 text-gray-600" />
                          Related Stories ({childStories.length})
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {childStories.map((story) => (
                            <StoryCard key={story._id} story={story} onClick={() => handleStoryClick(story)} />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredClusters.length === 0 && (
          <Card className="border border-gray-200">
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No clusters found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search terms or cluster filter.</p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Clear Search
                </button>
                <button
                  onClick={() => setSelectedCluster("all")}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Show All Clusters
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Story Detail Modal */}
        <StoryDetailModal story={selectedStory} isOpen={isModalOpen} onClose={handleCloseModal} />
      </>
    </>
  )
}
