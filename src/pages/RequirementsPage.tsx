import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Download,
  FileText,
  Loader2,
  User,
  Target,
  ExternalLink,
  MessageSquare,
  Star,
  Newspaper
} from "lucide-react"

interface UserStory {
  id: string
  title: string
  description: string
  sources: {
    type: "news" | "review" | "social"
    title: string
    author?: string
    content: string
    link?: string
    rating?: number
  }[]
}

interface UseCase {
  id: string
  title: string
  diagramUrl: string
}

const mockUserStories: UserStory[] = [
  {
    id: "US001",
    title: "Create Personalized Meal Plan",
    description:
      "As a health-conscious user, I want to create a personalized weekly meal plan based on my dietary restrictions and preferences, so that I can maintain a healthy diet that suits my lifestyle.",
    sources: [
      {
        type: "news",
        title: "AI-Powered Meal Planning Apps See 300% Growth in 2024",
        author: "Tech Food Weekly",
        content:
          "The meal planning app market is experiencing unprecedented growth as AI technology makes personalized nutrition more accessible to consumers.",
        link: "https://example.com/news-1"
      },
      {
        type: "review",
        title: "Samsung Food: Meal Planner",
        author: "Sarah M.",
        content:
          "Samsung Food has completely transformed my meal planning! The recipe import feature works flawlessly and the meal planning calendar is intuitive.",
        rating: 5
      },
      {
        type: "social",
        title: "@sarahchentech",
        author: "Sarah Chen",
        content:
          "Just tried the new AI-powered meal planning app and I'm blown away! 🤯 It analyzed my dietary restrictions and created a perfect weekly menu. The grocery list feature is a game-changer."
      }
    ]
  },
  {
    id: "US002",
    title: "AI-Powered Recipe Suggestions",
    description:
      "As a busy parent, I want to receive AI-powered recipe suggestions based on ingredients I have at home, so that I can reduce food waste and save time on meal planning.",
    sources: [
      {
        type: "news",
        title: "Smart Kitchen Technology Trends Shaping the Future",
        author: "Innovation Digest",
        content:
          "From ingredient recognition to automated meal planning, smart kitchen technologies are revolutionizing how we approach food preparation.",
        link: "https://example.com/news-2"
      },
      {
        type: "social",
        title: "@foodtechinsider",
        author: "FoodTech Insider",
        content:
          "The future of nutrition is here! AI nutrition assistants are becoming incredibly sophisticated. They can now analyze your health data and suggest optimal meals."
      }
    ]
  },
  {
    id: "US003",
    title: "Smart Grocery List Generation",
    description:
      "As a meal planner, I want the app to automatically generate a grocery list based on my meal plan, so that I can efficiently shop for all required ingredients.",
    sources: [
      {
        type: "review",
        title: "Mealime Meal Plans",
        author: "Amanda Foster",
        content:
          "Mealime has saved me so much time and money! The meal plans are realistic and the grocery lists are perfectly organized.",
        rating: 5
      }
    ]
  },
  {
    id: "US004",
    title: "Dietary Restriction Tracking",
    description:
      "As a user with food allergies, I want to track and manage my dietary restrictions, so that I can safely navigate food choices and avoid allergens.",
    sources: [
      {
        type: "social",
        title: "@alexr_wellness",
        author: "Alex Rodriguez",
        content:
          "As someone with multiple food allergies, dietary restriction tracking apps have been a lifesaver. The latest ones use AI to scan restaurant menus and warn about potential allergens."
      }
    ]
  }
]

const mockUseCases: UseCase[] = [
  {
    id: "UC001",
    title: "Generate AI-Powered Meal Plan",
    diagramUrl: "/placeholder.svg?height=400&width=600&text=Use+Case+Diagram:+Generate+AI-Powered+Meal+Plan"
  },
  {
    id: "UC002",
    title: "Scan and Identify Ingredients",
    diagramUrl: "/placeholder.svg?height=400&width=600&text=Use+Case+Diagram:+Scan+and+Identify+Ingredients"
  },
  {
    id: "UC003",
    title: "Manage Dietary Restrictions",
    diagramUrl: "/placeholder.svg?height=400&width=600&text=Use+Case+Diagram:+Manage+Dietary+Restrictions"
  },
  {
    id: "UC004",
    title: "Generate Shopping List",
    diagramUrl: "/placeholder.svg?height=400&width=600&text=Use+Case+Diagram:+Generate+Shopping+List"
  }
]

const generationSteps = [
  { name: "Analyzing App Data", description: "Processing collected app reviews and features" },
  { name: "Processing News Articles", description: "Extracting insights from industry trends" },
  { name: "Analyzing Social Media", description: "Understanding user sentiment and discussions" },
  { name: "Generating User Stories", description: "Creating user-centered requirements" },
  { name: "Creating Use Cases", description: "Defining system interactions and workflows" },
  { name: "Finalizing Requirements", description: "Organizing and structuring output" }
]

export default function RequirementsPage() {
  const [isGenerating, setIsGenerating] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("user-stories")
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (isGenerating) {
      const generate = async () => {
        for (let i = 0; i < generationSteps.length; i++) {
          setCurrentStep(i)
          setProgress((i / generationSteps.length) * 100)
          await new Promise(res => setTimeout(res, 2000 + Math.random() * 1000))
        }
        setProgress(100)
        await new Promise(res => setTimeout(res, 1000))
        setIsGenerating(false)
      }
      generate()
    }
  }, [isGenerating])

  const getSourceIcon = (type: UserStory["sources"][number]["type"]) => {
    switch (type) {
      case "news":
        return <Newspaper className="h-4 w-4" />
      case "review":
        return <Star className="h-4 w-4" />
      case "social":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getSourceColor = (type: UserStory["sources"][number]["type"]) => {
    switch (type) {
      case "news":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "social":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleExport = () => {
    alert("This would export all generated requirements as PDF, DOCX, and PNG formats.")
  }

  const handleStartDevelopment = () => {
    alert("This would proceed to development planning with the generated requirements.")
  }

  const handleBack = () => {
    if (id) navigate(`/project/${id}/dashboard`)
    else navigate("/")
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-black tracking-tight mb-4">Generating Requirements</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI is analyzing all collected data to generate comprehensive user stories and use case diagrams for your
              project.
            </p>
          </div>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-black flex items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-black" />
                Processing Your Data
              </CardTitle>
              <CardDescription className="text-lg">
                Step {currentStep + 1} of {generationSteps.length}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-black">Overall Progress</span>
                  <span className="text-sm text-gray-600 font-mono">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3 bg-gray-100" />
              </div>

              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-bold text-black mb-2">{generationSteps[currentStep]?.name}</h3>
                <p className="text-sm text-gray-600">{generationSteps[currentStep]?.description}</p>
              </div>

              <div className="space-y-3">
                {generationSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-md ${index < currentStep
                        ? "bg-green-50 border border-green-200"
                        : index === currentStep
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                  >
                    <div className="shrink-0">
                      {index < currentStep ? (
                        <div className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center">
                          <div className="h-2 w-2 bg-white rounded-full" />
                        </div>
                      ) : index === currentStep ? (
                        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm font-medium ${index <= currentStep ? "text-black" : "text-gray-500"}`}>
                        {step.name}
                      </h4>
                      <p className={`text-xs ${index <= currentStep ? "text-gray-600" : "text-gray-400"}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleBack} className="border-gray-300 hover:bg-gray-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-black tracking-tight">Generated Requirements</h1>
              <p className="text-gray-600 mt-2">
                AI-generated user stories and use case diagrams based on your comprehensive data analysis.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExport} className="border-gray-300 hover:bg-gray-50 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export (PDF, DOCX, PNG)
            </Button>
            <Button onClick={handleStartDevelopment} className="bg-black hover:bg-gray-800 text-white">
              <Target className="h-4 w-4 mr-2" />
              Start Development Planning
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-black flex items-center gap-2">
                <User className="h-5 w-5" />
                User Stories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black mb-2">{mockUserStories.length}</div>
              <p className="text-sm text-gray-600">User-centered requirements with source traceability</p>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-black flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Use Case Diagrams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black mb-2">{mockUseCases.length}</div>
              <p className="text-sm text-gray-600">Visual system interaction diagrams</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger value="user-stories" className="data-[state=active]:bg-white data-[state=active]:text-black">
              User Stories ({mockUserStories.length})
            </TabsTrigger>
            <TabsTrigger value="use-cases" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Use Case Diagrams ({mockUseCases.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user-stories" className="mt-6">
            <div className="space-y-6">
              {mockUserStories.map(story => (
                <Card key={story.id} className="border border-gray-200">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {story.id}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg font-bold text-black">{story.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-black mb-2">User Story</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{story.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-black mb-3">Sources</h4>
                      <div className="space-y-3">
                        {story.sources.map((source, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="shrink-0">
                                <Badge className={`text-xs flex items-center gap-1 ${getSourceColor(source.type)}`}>
                                  {getSourceIcon(source.type)}
                                  {source.type}
                                </Badge>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <h5 className="font-medium text-black text-sm">{source.title}</h5>
                                  {source.rating && (
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span className="text-xs text-gray-600">{source.rating}</span>
                                    </div>
                                  )}
                                </div>
                                {source.author && <p className="text-xs text-gray-500 mb-2">by {source.author}</p>}
                                <p className="text-sm text-gray-700 leading-relaxed">{source.content}</p>
                                {source.link && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="mt-2 h-7 text-xs border-gray-300 hover:bg-gray-50 bg-transparent"
                                  >
                                    <a
                                      href={source.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      View Source
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="use-cases" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockUseCases.map(useCase => (
                <Card key={useCase.id} className="border border-gray-200">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {useCase.id}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold text-black">{useCase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative w-full h-64 bg-gray-50 rounded-lg overflow-hidden border border-gray-200 p-4 flex items-center justify-center">
                      <img
                        src={useCase.diagramUrl || "/placeholder.svg"}
                        alt={`Use case diagram for ${useCase.title}`}
                        className="object-contain w-full h-full"
                        crossOrigin="anonymous"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}