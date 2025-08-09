import { useState } from "react"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Terminal } from 'lucide-react'

function CreateProjectPage() {
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSave = async () => {
    if (!projectName.trim() || !projectDescription.trim()) {
      alert("Please fill in both project name and description.")
      return
    }

    setIsLoading(true)

    try {
      const request = await fetch(
        `${import.meta.env.VITE_MULTISOURCE_SERVICE_API_ENDPOINT || 'http://127.0.0.1:8001'}/create-new-project`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: projectName.trim(),
            case_study: projectDescription.trim()
          })
        }
      )

      if (!request.ok) {
        throw new Error(`HTTP error! status: ${request.status}`)
      }

      const data = await request.json();

      if (!data.session_id || !data.queries) {
        throw new Error("Invalid response format from server");
      }

      sessionStorage.setItem('projectName', projectName);
      sessionStorage.setItem('caseStudies', projectDescription);
      sessionStorage.setItem('sessionId', data.session_id);
      sessionStorage.setItem('queries', JSON.stringify(data.queries));

      navigate(`/project/${data.session_id}/configure`)

    } catch (error) {
      console.error('Error fetching queries:', error);
      setError(`Failed to process your request: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  }

  const handleBack = () => {
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto py-8">
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
            <h1 className="text-4xl font-bold text-black tracking-tight">Create New Project</h1>
            <p className="text-gray-600 mt-2">
              Start by defining your project idea and scope. This information will be used to generate relevant search queries and guide the analysis process.
            </p>
          </div>
        </div>

        {
          error && (<Alert variant="destructive">
            <Terminal />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>)
        }

        {/* Project Form */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-black">Project Details</CardTitle>
            <CardDescription>
              Provide a clear project name and detailed description of your idea, problem statement, or case study.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="project-name" className="text-sm font-medium text-black">
                Project Name *
              </Label>
              <Input
                id="project-name"
                placeholder="e.g., AI-Powered Meal Planning App"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="border-gray-300 focus:border-black focus:ring-0"
                maxLength={100}
              />
              <p className="text-xs text-gray-500">
                Choose a clear and concise title for your project ({projectName.length}/100 characters)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-description" className="text-sm font-medium text-black">
                Project Description / Case Study *
              </Label>
              <Textarea
                id="project-description"
                placeholder="Describe your project idea in detail. Include the problem you're solving, target audience, key features you envision, and any specific requirements or constraints. The more detailed your description, the better the system can generate relevant search queries and analysis.

Example: I want to build a mobile app that uses AI to create personalized meal plans based on dietary restrictions and available ingredients. The app should help busy families reduce food waste while maintaining healthy eating habits. Key features should include ingredient scanning, recipe suggestions, grocery list generation, and nutritional tracking."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="min-h-[200px] border-gray-300 focus:border-black focus:ring-0 resize-none"
                maxLength={2000}
              />
              <p className="text-xs text-gray-500">
                Provide a comprehensive description of your project idea ({projectDescription.length}/2000 characters)
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Next Steps:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Configure search queries and data sources</li>
                    <li>• Collect and analyze relevant data</li>
                    <li>• Generate structured requirements</li>
                  </ul>
                </div>
                <Button
                  onClick={handleSave}
                  disabled={!projectName.trim() || !projectDescription.trim() || isLoading}
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
                      Save & Proceed
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="border border-blue-200 bg-blue-50 mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-blue-900">💡 Tips for Better Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• <strong>Be specific:</strong> Include details about your target users, key features, and technical constraints</li>
              <li>• <strong>Mention similar apps:</strong> Reference existing solutions you admire or want to improve upon</li>
              <li>• <strong>Include context:</strong> Describe the problem you're solving and why it matters</li>
              <li>• <strong>Think about scope:</strong> Mention if this is a mobile app, web platform, desktop software, etc.</li>
              <li>• <strong>Consider integrations:</strong> Note any third-party services or APIs you plan to use</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CreateProjectPage