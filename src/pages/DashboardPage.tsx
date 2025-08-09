// filepath: src/pages/DashboardPage.tsx
// ...existing code...
import { useNavigate, useParams } from "react-router"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Settings, FileText, Target, Smartphone, Newspaper, MessageSquare } from "lucide-react"

import { useAppsCollection } from "@/hooks/useAppsCollection"
import { useNewsCollection } from "@/hooks/useNewsCollection"
import { useSocialCollection } from "@/hooks/useSocialCollection"

import { AppCollectionSection } from "@/components/dashboard/AppCollectionSection"
import { NewsCollectionSection } from "@/components/dashboard/NewsCollectionSection"
import { SocialCollectionSection } from "@/components/dashboard/SocialCollectionSection"
import { CollectionProgress } from "@/components/dashboard/CollectionProgress"
import { buildStatuses } from "@/lib/buildStatuses"

/**
 * DashboardPage now acts as a coordinator:
 * - Acquires route / navigation context
 * - Composes individual collection sections
 * - Computes overall readiness for generating requirements
 * All collection logic lives in custom hooks & components.
 */
export default function DashboardPage() {
  const { id } = useParams<{ id: string }>()

  const appsLogic = useAppsCollection(id)
  const newsLogic = useNewsCollection(id)
  const socialLogic = useSocialCollection()

  const navigate = useNavigate()


  const allCollectionsComplete =
    appsLogic.apps.loaded && newsLogic.news.loaded && socialLogic.social.loaded

  const handleGenerateRequirements = () => id && navigate(`/project/${id}/requirements`)
  const handleGenerateAIRequirements = () => id && navigate(`/project/${id}/ai-requirements`)
  const handleEditConfiguration = () => id && navigate(`/project/${id}/configure`)
  const handleBack = () => navigate("/")

  const statuses = buildStatuses({
    appsLoaded: appsLogic.apps.loaded,
    appsMeta: `${appsLogic.apps.items.length} apps • ${appsLogic.reviews.items.length} reviews`,
    newsLoaded: newsLogic.news.loaded,
    newsMeta: `${newsLogic.news.items.length} articles`,
    socialLoaded: socialLogic.social.loaded,
    socialMeta: `${socialLogic.social.items.length} posts`
  })

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleBack} className="border-gray-300 hover:bg-gray-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-black tracking-tight">Data Analysis Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Collect and analyze data from your configured sources to inform requirements generation.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={handleEditConfiguration}
              className="border-gray-300 hover:bg-gray-50 bg-transparent"
            >
              <Settings className="h-4 w-4 mr-2" />
              Edit Configuration
            </Button>
            <Button
              onClick={handleGenerateAIRequirements}
              disabled={!allCollectionsComplete}
              variant="outline"
              className="border-purple-300 hover:bg-purple-50 bg-transparent text-purple-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300"
            >
              <Target className="h-4 w-4 mr-2" />
              Generate Requirements Using AI
            </Button>
            <Button
              onClick={handleGenerateRequirements}
              disabled={!allCollectionsComplete}
              className="bg-black hover:bg-gray-800 text-white disabled:bg-gray-200 disabled:text-gray-400"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Requirements
            </Button>
          </div>
        </div>

        <CollectionProgress statuses={statuses} />

        <Tabs defaultValue="apps" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100">
            <TabsTrigger value="apps" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <Smartphone className="h-4 w-4 mr-2" />
              App Reviews
            </TabsTrigger>
            <TabsTrigger value="news" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <Newspaper className="h-4 w-4 mr-2" />
              Industry News
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <MessageSquare className="h-4 w-4 mr-2" />
              Social Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="apps" className="space-y-6">
            <AppCollectionSection logic={appsLogic} />
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <NewsCollectionSection logic={newsLogic} />
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <SocialCollectionSection logic={socialLogic} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
// ...existing code...