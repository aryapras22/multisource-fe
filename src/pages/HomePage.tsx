import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Plus, Search, FolderOpen, Calendar, ArrowRight, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { apiGet } from "@/services/apiClient"

interface Project {
  _id: string
  name: string
  case_study: string
  created_at: string
  status: "draft" | "configured" | "analyzing" | "complete"
}

function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch projects data

    const fetchProjects = async () => {
      try {
        setError(null)
        const data = await apiGet<Project[]>('/get-projects')
        setProjects(data)
      } catch (error) {
        console.error("An error occurred while fetching projects:", error)
        setError(error instanceof Error ? error.message : "Failed to load projects. Please try again.")
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()

  }, [])

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.case_study.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800 border-gray-200"
      case "configured": return "bg-blue-100 text-blue-800 border-blue-200"
      case "analyzing": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "complete": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    })
  }

  const handleCreateProject = () => {
    navigate("/create-project")
  }

  const handleProjectClick = (project: Project) => {
    switch (project.status) {
      case "draft": navigate(`/project/${project._id}/configure`); break
      case "configured":
      case "analyzing": navigate(`/project/${project._id}/dashboard`); break
      case "complete": navigate(`/project/${project._id}/requirements`); break
      default: navigate(`/project/${project._id}/dashboard`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent mx-auto mb-4"></div>
          <p>Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black tracking-tight">Multisource Requirement Elicitation</h1>
            <p className="text-gray-600 mt-2">
              Transform your project ideas into structured software requirements through AI-powered analysis.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/analytics")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              Analytics Dashboard
            </Button>
            <Button
              onClick={handleCreateProject}
              className="bg-black hover:bg-gray-800 text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects by name or case study..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 focus:border-black focus:ring-0"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            {projects.length === 0 ? (
              <div className="space-y-4">
                <FolderOpen className="h-16 w-16 text-gray-300 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-black mb-2">No projects yet</h3>
                  <p className="text-gray-600 mb-6">Get started by creating your first requirements elicitation project.</p>
                  <Button
                    onClick={handleCreateProject}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Project
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Search className="h-16 w-16 text-gray-300 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-black mb-2">No projects found</h3>
                  <p className="text-gray-600">Try adjusting your search terms.</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project._id}
                className="border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => handleProjectClick(project)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-bold text-black line-clamp-1 group-hover:text-gray-700 transition-colors">
                        {project.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                          {getStatusText(project.status)}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {formatDate(project.created_at)}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-black transition-colors shrink-0" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                    {project.case_study}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage