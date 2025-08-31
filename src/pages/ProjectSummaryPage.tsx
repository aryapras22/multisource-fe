import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2, MessageSquare, Newspaper, Store, Terminal, XCircle } from "lucide-react"
import type { App, AppReview, NewsArticle, SocialPost } from "@/types/collections"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import type { AiUserStory } from "@/hooks/useAiRequirementsGeneration"
import type { UserStory, UseCaseGeneration } from "@/types/requirements"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getProjectSummary } from "@/services/projectService"
import { AppCard } from "@/components/dashboard/AppCard"
import { Skeleton } from "@/components/ui/skeleton"
import { ReviewsList } from "@/components/dashboard/ReviewsList"
import { NewsArticleCard } from "@/components/dashboard/NewsArticleCard"
import { SocialPostCard } from "@/components/dashboard/SocialPostCard"
import type { ClusteringData } from "@/types/clustering"
import { getClusteredAIUserStories, getClusteredUserStories } from "@/services/userStoryService"
import { ClusterView } from "@/components/stories-clusters/ClusterView"
import { DiagramsGrid } from "@/components/requirements/UseCasesGrid"
import { Badge } from "@/components/ui/badge"
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tooltip } from "@radix-ui/react-tooltip"

interface Project {
  _id: string
  name: string
  case_study: string
  queries: string[]
  status: string
  created_at: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchState: any
}

interface ProjectSummaryData {
  project: Project
  apps: App[]
  reviews: AppReview[]
  news: NewsArticle[]
  tweets: SocialPost[]
  user_stories: UserStory[]
  use_cases: UseCaseGeneration[]
  ai_stories: AiUserStory[]
  ai_use_cases: UseCaseGeneration[]
}

export function ProjectSummary() {
  const { id } = useParams<{ id: string }>()
  const [summary, setSummary] = useState<ProjectSummaryData | null>(null)
  const [userStoryClusters, setUserStoryClusters] = useState<ClusteringData | null>(null)
  const [aiStoryClusters, setAiStoryClusters] = useState<ClusteringData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchSummary = async () => {
      try {
        setLoading(true)
        const [summaryData, userClusters, aiClusters] = await Promise.all([
          getProjectSummary({ project_id: id }),
          getClusteredUserStories({ project_id: id }),
          getClusteredAIUserStories({ project_id: id }),
        ])
        setSummary(summaryData as ProjectSummaryData)
        setUserStoryClusters(userClusters)
        setAiStoryClusters(aiClusters)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.")
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
          </CardContent>
        </Card>

        <div className="w-full space-y-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="border rounded-md p-4">
              <Skeleton className="h-6 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!summary) {
    return <div>No summary data available.</div>
  }

  const { project, apps, reviews, news, tweets, use_cases, ai_use_cases } = summary


  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'complete':
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Complete</Badge>
      case 'in progress':
        return <Badge variant="secondary">In Progress</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const renderFetchStatus = (source: keyof Project['fetchState']) => {
    const state = project.fetchState[source]
    if (state === true) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    }
    // Assuming false means not run or failed
    return <XCircle className="h-4 w-4 text-red-500" />
  }


  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">{project.name}</CardTitle>
              <CardDescription className="mt-1 max-w-2xl">{project.case_study}</CardDescription>
            </div>
            {getStatusBadge(project.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">Details</h4>
              <div className="flex items-center">
                <span className="text-gray-500 w-24 shrink-0">Created</span>
                <span className="text-gray-900 font-medium">{new Date(project.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">Search Queries</h4>
              <div className="flex flex-wrap gap-2">
                {project.queries.map(q => <Badge key={q} variant="outline">{q}</Badge>)}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">Data Sources & Status</h4>
              <TooltipProvider>
                <div className="space-y-2">
                  {apps && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-gray-500" />
                        <span>App Stores</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1.5 cursor-pointer">
                              {renderFetchStatus('appStores')}
                              <span className="text-xs">Apps</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent><p>App Details Fetch Status</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1.5 cursor-pointer">
                              {renderFetchStatus('reviews')}
                              <span className="text-xs">Reviews</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent><p>App Reviews Fetch Status</p></TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  )}
                  {news && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Newspaper className="h-4 w-4 text-gray-500" />
                        <span>News</span>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild><div className="cursor-pointer">{renderFetchStatus('news')}</div></TooltipTrigger>
                        <TooltipContent><p>News Fetch Status</p></TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                  {tweets && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-gray-500" />
                        <span>Social Media</span>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild><div className="cursor-pointer">{renderFetchStatus('socialMedia')}</div></TooltipTrigger>
                        <TooltipContent><p>Social Media Fetch Status</p></TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                </div>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>

      <Accordion type="multiple" className="w-full space-y-4">
        {
          apps && <AccordionItem value="apps">
            <AccordionTrigger className="text-xl font-semibold">Applications ({apps.length})</AccordionTrigger>
            <AccordionContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              {apps.map(app => (
                <AppCard key={app._id} app={app} reviewsPerApp={0} onGetReviews={() => { }} reviewsLoading={false} />
              ))}
            </AccordionContent>
          </AccordionItem>
        }

        {
          reviews && <AccordionItem value="reviews">
            <AccordionTrigger className="text-xl font-semibold">App Reviews ({reviews.length})</AccordionTrigger>
            <AccordionContent className="pt-4">
              <ReviewsList reviews={reviews} />
            </AccordionContent>
          </AccordionItem>
        }

        {
          news && <AccordionItem value="news">
            <AccordionTrigger className="text-xl font-semibold">News Articles ({news.length})</AccordionTrigger>
            <AccordionContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              {news.map(article => (
                <NewsArticleCard key={article._id} article={article} />
              ))}
            </AccordionContent>
          </AccordionItem>
        }

        {
          tweets && <AccordionItem value="tweets">
            <AccordionTrigger className="text-xl font-semibold">Social Posts ({tweets.length})</AccordionTrigger>
            <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {tweets.map(tweet => (
                <SocialPostCard key={tweet._id} post={tweet} />
              ))}
            </AccordionContent>
          </AccordionItem>
        }

        {
          userStoryClusters && <AccordionItem value="user_stories">
            <AccordionTrigger className="text-xl font-semibold">User Story Clusters ({userStoryClusters?.clusters.length || 0})</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              {userStoryClusters ? (
                <ClusterView data={userStoryClusters} />
              ) : (
                <p>No user story cluster data available.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        }

        {
          use_cases && use_cases.length > 0 && <AccordionItem value="use_cases">
            <AccordionTrigger className="text-xl font-semibold">
              Use Cases ({use_cases[0]?.diagrams_url?.length ?? 0})
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <DiagramsGrid key={use_cases[0]._id} data={use_cases[0]} />
            </AccordionContent>
          </AccordionItem>
        }

        {
          aiStoryClusters && <AccordionItem value="ai_stories">
            <AccordionTrigger className="text-xl font-semibold">AI-Generated User Story Clusters ({aiStoryClusters?.clusters.length || 0})</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              {aiStoryClusters ? (
                <ClusterView data={aiStoryClusters} />
              ) : (
                <p>No AI-generated user story cluster data available.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        }

        {
          ai_use_cases && ai_use_cases.length > 0 && <AccordionItem value="ai_use_cases">
            <AccordionTrigger className="text-xl font-semibold">
              AI-Generated Use Cases ({ai_use_cases[0]?.diagrams_url?.length ?? 0})
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              {ai_use_cases.map(uc => (
                <DiagramsGrid key={uc._id} data={uc} />
              ))}
            </AccordionContent>
          </AccordionItem>
        }

      </Accordion>
    </div>
  )
}