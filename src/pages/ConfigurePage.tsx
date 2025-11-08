import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Settings, Plus, Edit2, Trash2, Save } from 'lucide-react'

interface ProjectConfig {
  _id: string
  name: string
  case_study: string
  queries: string[]
  dataSources: {
    appStores: boolean
    news: boolean
    socialMedia: boolean
  }
}

const ENDPOINT = import.meta.env.VITE_MULTISOURCE_SERVICE_API_ENDPOINT

///## Future Implementation 
// data sources selection 

function ConfigurePage() {
  const [project, setProject] = useState<ProjectConfig>({
    "_id": "",
    "name": "",
    "case_study": "",
    "queries": [""],
    "dataSources": {
      appStores: true,
      news: true,
      socialMedia: true,
    }
  })
  const [queries, setQueries] = useState<string[]>([])
  const [newQuery, setNewQuery] = useState("")
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingText, setEditingText] = useState("")
  const [dataSources, setDataSources] = useState({
    appStores: true,
    news: true,
    socialMedia: true
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    // In a real app, fetch project data based on id
    const fetchProject = async () => {
      try {
        const endpoint = ENDPOINT
        if (!endpoint) {
          console.error("API endpoint is not configured")
          setIsLoading(false)
          return
        }

        const res = await fetch(`${endpoint}/get-project-data?id=${id}`)

        if (!res.ok) {
          throw new Error("Failed to fetch data from API")
        }

        const data = await res.json()
        setProject({ ...data })
        setQueries(data.queries)
        setDataSources(data.dataSources)
      } catch (error) {
        console.error("An error occured while fetching project", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()

  }, [id])

  const handleAddQuery = () => {
    if (newQuery.trim() && !queries.includes(newQuery.trim())) {
      setQueries([...queries, newQuery.trim()])
      setNewQuery("")
    }
  }

  const handleEditQuery = (index: number) => {
    setEditingIndex(index)
    setEditingText(queries[index])
  }

  const handleSaveEdit = () => {
    if (editingIndex !== null && editingText.trim()) {
      const updatedQueries = [...queries]
      updatedQueries[editingIndex] = editingText.trim()
      setQueries(updatedQueries)
      setEditingIndex(null)
      setEditingText("")
    }
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditingText("")
  }

  const handleDeleteQuery = (index: number) => {
    setQueries(queries.filter((_, i) => i !== index))
  }

  const handleDataSourceChange = (source: keyof typeof dataSources, checked: boolean) => {
    setDataSources(prev => ({
      ...prev,
      [source]: checked
    }))
  }

  const handleSaveAndContinue = async () => {
    if (queries.length === 0) {
      alert("Please add at least one search query.")
      return
    }

    const selectedSources = Object.values(dataSources).filter(Boolean).length
    if (selectedSources === 0) {
      alert("Please select at least one data source.")
      return
    }

    setIsLoading(true)

    try {
      const endpoint = ENDPOINT
      if (!endpoint) {
        console.error("API endpoint is not configured")
        setIsLoading(false)
        return
      }

      const res = await fetch(`${endpoint}/update-project-config`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          id,
          queries,
          dataSources
        })
      })

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} - ${msg}`)
      }

      const ct = res.headers.get('content-type') ?? ""
      const payload = res.status === 204 || !ct.includes("application/json") ? null : await res.json();

      console.log(payload)

      navigate(`/project/${id}/dashboard`)
    } catch (error) {
      console.error("update-project-config failed", error);
    } finally {
      setIsLoading(false)
    }

  }

  const handleBack = () => {
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-black tracking-tight flex items-center gap-3">
              <Settings className="h-8 w-8" />
              Configure Project
            </h1>
            <p className="text-gray-600 mt-2">
              Set up search queries and select data sources for analysis. This configuration will guide the data collection process.
            </p>
          </div>
        </div>

        {/* Project Info */}
        <Card className="border border-gray-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-black">{project.name}</CardTitle>
            <CardDescription className="text-sm text-gray-700 leading-relaxed">
              {project.case_study}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Query Management */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-black">Search Queries</CardTitle>
              <CardDescription>
                These queries will be used to search for relevant apps, news articles, and social media posts.
                You can edit the suggested queries or add your own.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Query */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a new search query..."
                  value={newQuery}
                  onChange={(e) => setNewQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddQuery()}
                  className="border-gray-300 focus:border-black focus:ring-0"
                />
                <Button
                  onClick={handleAddQuery}
                  disabled={!newQuery.trim()}
                  className="bg-black hover:bg-gray-800 text-white disabled:bg-gray-200 disabled:text-gray-400 shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Query List */}
              <div className="space-y-2">
                {queries.map((query, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 border border-gray-200 rounded-md">
                    {editingIndex === index ? (
                      <>
                        <Input
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                          className="flex-1 border-gray-300 focus:border-black focus:ring-0"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={handleSaveEdit}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="border-gray-300 hover:bg-gray-50"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-sm font-mono text-gray-700">{query}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditQuery(index)}
                          className="border-gray-300 hover:bg-gray-50"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteQuery(index)}
                          className="border-red-300 hover:bg-red-50 text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {queries.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No queries added yet. Add your first search query above.</p>
                </div>
              )}

              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  <strong>Tip:</strong> Use specific, descriptive queries that relate to your project domain.
                  Each query will be used to search across all selected data sources.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Source Selection */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-black">Data Sources</CardTitle>
              <CardDescription>
                Select which data sources you want to analyze. Each source will provide different types of insights
                for your requirements elicitation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-md">
                  <Checkbox
                    checked={dataSources.appStores}
                    onCheckedChange={(checked) => handleDataSourceChange('appStores', !!checked)}
                    className="border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-black">App Stores</h4>
                      <Badge variant="outline" className="text-xs">Recommended</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Analyze existing mobile and web applications from Apple App Store and Google Play Store.
                    </p>
                    <div className="text-xs text-gray-500">
                      <strong>Provides:</strong> Feature analysis, user reviews, ratings, competitive landscape
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-md">
                  <Checkbox
                    checked={dataSources.news}
                    onCheckedChange={(checked) => handleDataSourceChange('news', !!checked)}
                    className="border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-black">Industry News</h4>
                      <Badge variant="outline" className="text-xs">Trending</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Gather recent news articles, press releases, and industry reports related to your domain.
                    </p>
                    <div className="text-xs text-gray-500">
                      <strong>Provides:</strong> Market trends, emerging technologies, industry insights, regulatory changes
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-md">
                  <Checkbox
                    checked={dataSources.socialMedia}
                    onCheckedChange={(checked) => handleDataSourceChange('socialMedia', !!checked)}
                    className="border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-black">Social Media</h4>
                      <Badge variant="outline" className="text-xs">Real-time</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Analyze discussions, opinions, and feedback from Twitter/X and other social platforms.
                    </p>
                    <div className="text-xs text-gray-500">
                      <strong>Provides:</strong> User sentiment, pain points, feature requests, community discussions
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-1">Selected Sources: {Object.values(dataSources).filter(Boolean).length}/3</p>
                    <p className="text-xs">Each source will appear as a separate tab in your analysis dashboard.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">Configuration Summary:</p>
            <p className="text-xs">
              {queries.length} search queries • {Object.values(dataSources).filter(Boolean).length} data sources selected
            </p>
          </div>
          <Button
            onClick={handleSaveAndContinue}
            disabled={queries.length === 0 || Object.values(dataSources).filter(Boolean).length === 0 || isLoading}
            className="bg-black hover:bg-gray-800 text-white disabled:bg-gray-200 disabled:text-gray-400"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save & Continue to Dashboard
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfigurePage