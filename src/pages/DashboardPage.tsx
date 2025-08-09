import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Settings,
  FileText,
  Loader2,
  CheckCircle,
  Star,
  ExternalLink,
  User,
  Heart,
  MessageCircle,
  Repeat2,
  Smartphone,
  Newspaper,
  MessageSquare,
  Target,
  Hash
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface App {
  id: string
  name: string
  developer: string
  rating: number
  icon: string
  description: string
  store: "apple" | "google"
  reviewsCollected: boolean
}

interface AppReview {
  _id: string
  reviewer: string
  rating: number
  review: string
  app_id: string
  store: "apple" | "google"
}

interface NewsArticle {
  _id: string
  title: string
  author: string
  link: string
  description: string
  content: string
  query: string
}

interface SocialPost {
  _id: string
  tweet_id: string
  url: string
  text: string
  retweet_count: number
  reply_count: number
  like_count: number
  quote_count: number
  created_at: string
  lang: string
  author: {
    username: string
    name: string
    id: string
    profile_picture: string
    description: string
    location: string
    followers: number
    following: number
    is_blue_verified: boolean
    verified_type: string | null
  }
  entities: {
    hashtags: { indices: number[]; text: string }[]
  }
  query: string
}

// Mock data
const mockApps: App[] = [
  {
    id: "app-1",
    name: "Samsung Food: Meal Planner",
    developer: "Whisk food",
    rating: 4.8,
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/1a/d3/6a/1ad36ad6-2fda-bd4e-58e5-e6358d1b59ee/AppIcon-0-0-1x_U007epad-0-1-85-220.png/100x100bb.jpg",
    description: "Comprehensive meal planning companion with AI-powered recipe suggestions",
    store: "apple",
    reviewsCollected: false
  },
  {
    id: "app-2",
    name: "Mealime Meal Plans",
    developer: "Mealime Inc",
    rating: 4.6,
    icon: "https://play-lh.googleusercontent.com/WWviQxIEoRtPycY3aI0AetX7KnqSnOnDiOeA5VsryvccdAfyg-6u5DGVXpVHGkyTABI",
    description: "Simple meal planning for busy families with healthy recipes",
    store: "google",
    reviewsCollected: false
  }
]

const mockReviews: AppReview[] = [
  {
    _id: "6890a7276862eb0ec3d68736",
    reviewer: "Unhappy807",
    rating: 1,
    review: "Please don’t waste your money or time. There is no free trial and the app does not work properly. No support. Complete junk app.",
    app_id: "676477650",
    store: "apple"
  },
  {
    _id: "rev-2-sample",
    reviewer: "Sarah M.",
    rating: 5,
    review: "Samsung Food has completely transformed my meal planning! The recipe import feature works flawlessly.",
    app_id: "app-1",
    store: "apple"
  }
]

const mockNews: NewsArticle[] = [
  {
    _id: "6891fec0d777fa89f353111c",
    title: "Motorola Introduces Ai Nutrition Labels For Safety Technologies",
    author: "Deepak",
    link: "https://www.snsmideast.com/motorola-introduces-ai-nutrition-labels-for-safety-technologies",
    description: "Motorola Solutions has announced it is introducing 'AI nutrition labels'...",
    content: "Motorola Solutions has announced it is introducing 'AI nutrition labels'...",
    query: "AI nutrition assistant"
  },
  {
    _id: "news-2",
    title: "AI-Powered Meal Planning Apps See 300% Growth in 2024",
    author: "Tech Food Weekly",
    link: "https://example.com/news-1",
    description: "The meal planning app market is experiencing unprecedented growth...",
    content: "The meal planning app market is experiencing unprecedented growth...",
    query: "AI meal plan customization"
  }
]

const mockSocialPosts: SocialPost[] = [
  {
    _id: "689350909f6179020e4a8d89",
    tweet_id: "1614295896640094208",
    url: "https://x.com/tiffany_peltier/status/1614295896640094208",
    text: "I just asked #ChatGPT to create a meal plan for 3 lunches and 4 dinners...",
    retweet_count: 27,
    reply_count: 19,
    like_count: 419,
    quote_count: 15,
    created_at: "Sat Jan 14 16:18:28 +0000 2023",
    lang: "en",
    author: {
      username: "tiffany_peltier",
      name: "Tiffany Peltier, Ph.D.🌸",
      id: "229271282",
      profile_picture: "https://pbs.twimg.com/profile_images/1398709247504945153/t2mezMYr_normal.jpg",
      description: "",
      location: "Norman, OK",
      followers: 9557,
      following: 4371,
      is_blue_verified: false,
      verified_type: null
    },
    entities: { hashtags: [{ indices: [13, 21], text: "ChatGPT" }] },
    query: "AI meal plan customization"
  },
  {
    _id: "social-2",
    tweet_id: "1614295896640094210",
    url: "https://x.com/foodtechinsider/status/1614295896640094210",
    text: "The future of nutrition is here! AI nutrition assistants are becoming incredibly sophisticated.",
    retweet_count: 234,
    reply_count: 67,
    like_count: 892,
    quote_count: 42,
    created_at: "Sat Jan 14 17:10:11 +0000 2023",
    lang: "en",
    author: {
      username: "foodtechinsider",
      name: "FoodTech Insider",
      id: "1122334455",
      profile_picture: "",
      description: "",
      location: "",
      followers: 12450,
      following: 120,
      is_blue_verified: false,
      verified_type: null
    },
    entities: { hashtags: [] },
    query: "AI nutrition assistant"
  }
]

export default function DashboardPage() {
  const [apps, setApps] = useState<App[]>([])
  const [reviews, setReviews] = useState<AppReview[]>([])
  const [news, setNews] = useState<NewsArticle[]>([])
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([])

  const [appsLoading, setAppsLoading] = useState(false)
  const [newsLoading, setNewsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState(false)
  const [reviewsLoading, setReviewsLoading] = useState<string | null>(null)

  const [appsLoaded, setAppsLoaded] = useState(false)
  const [newsLoaded, setNewsLoaded] = useState(false)
  const [socialLoaded, setSocialLoaded] = useState(false)

  const [appCount, setAppCount] = useState(5)
  const [newsCount, setNewsCount] = useState(10)
  const [socialCount, setSocialCount] = useState(15)
  const [reviewsPerApp, setReviewsPerApp] = useState(20)

  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const handleFindApps = async () => {
    setAppsLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setApps(mockApps)
    setAppsLoaded(true)
    setAppsLoading(false)
  }

  const handleGetReviews = async (appId: string) => {
    setReviewsLoading(appId)
    await new Promise(r => setTimeout(r, 800))
    // Append only reviews matching that app or sample set
    setReviews(prev => [...prev, ...mockReviews.filter(r => r.app_id === appId || r.app_id === "app-1")])
    setApps(prev => prev.map(a => a.id === appId ? { ...a, reviewsCollected: true } : a))
    setReviewsLoading(null)
  }

  const handleFetchNews = async () => {
    setNewsLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setNews(mockNews.slice(0, newsCount))
    setNewsLoaded(true)
    setNewsLoading(false)
  }

  const handleScrapeTwitter = async () => {
    setSocialLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setSocialPosts(mockSocialPosts.slice(0, socialCount))
    setSocialLoaded(true)
    setSocialLoading(false)
  }

  const handleGenerateRequirements = () => id && navigate(`/project/${id}/requirements`)
  const handleGenerateAIRequirements = () => id && navigate(`/project/${id}/ai-requirements`)
  const handleEditConfiguration = () => id && navigate(`/project/${id}/configure`)
  const handleBack = () => navigate("/")

  const formatNumber = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + "K" : n.toString()

  const allCollectionsComplete = appsLoaded && newsLoaded && socialLoaded

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
            <Button variant="outline" onClick={handleEditConfiguration} className="border-gray-300 hover:bg-gray-50 bg-transparent">
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

        <Card className="border border-gray-200 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-black">Collection Progress</CardTitle>
            <CardDescription>
              Track your data collection progress across all configured sources. All primary collections must be complete to generate requirements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-black flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    App Reviews
                  </span>
                  <Badge className={appsLoaded ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {appsLoaded ? "Ready" : "Pending"}
                  </Badge>
                </div>
                <Progress value={appsLoaded ? 100 : 0} className="h-2" />
                <p className="text-xs text-gray-500">
                  {apps.length} apps • {reviews.length} reviews
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-black flex items-center gap-2">
                    <Newspaper className="h-4 w-4" />
                    Industry News
                  </span>
                  <Badge className={newsLoaded ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {newsLoaded ? "Complete" : "Pending"}
                  </Badge>
                </div>
                <Progress value={newsLoaded ? 100 : 0} className="h-2" />
                <p className="text-xs text-gray-500">{news.length} articles</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-black flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Social Media
                  </span>
                  <Badge className={socialLoaded ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {socialLoaded ? "Complete" : "Pending"}
                  </Badge>
                </div>
                <Progress value={socialLoaded ? 100 : 0} className="h-2" />
                <p className="text-xs text-gray-500">{socialPosts.length} posts</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
            {!appsLoaded ? (
              <Card className="border border-gray-200">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-bold text-black">Find Matching Apps</CardTitle>
                  <CardDescription>Search app stores for applications related to your project queries.</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="flex flex-col items-center gap-2">
                      <Label htmlFor="app-count" className="text-sm font-medium">
                        Number of apps:
                      </Label>
                      <Input
                        id="app-count"
                        type="number"
                        min={1}
                        max={20}
                        value={appCount}
                        onChange={e => setAppCount(parseInt(e.target.value) || 5)}
                        className="w-20 text-center"
                      />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Label htmlFor="reviews-per-app" className="text-sm font-medium">
                        Reviews per app:
                      </Label>
                      <Input
                        id="reviews-per-app"
                        type="number"
                        min={1}
                        max={100}
                        value={reviewsPerApp}
                        onChange={e => setReviewsPerApp(parseInt(e.target.value) || 20)}
                        className="w-20 text-center"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleFindApps}
                    disabled={appsLoading}
                    className="bg-black hover:bg-gray-800 text-white disabled:bg-gray-200 disabled:text-gray-400"
                  >
                    {appsLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Searching App Stores...
                      </>
                    ) : (
                      `Find ${appCount} Matching Apps`
                    )}
                  </Button>
                  {appsLoading && (
                    <p className="text-sm text-gray-500 mt-4">
                      This may take a few minutes as we search across multiple app stores...
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {apps.map(app => (
                    <Card key={app.id} className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                            <img
                              src={app.icon}
                              alt={app.name}
                              className="object-cover w-full h-full"
                              crossOrigin="anonymous"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-sm font-bold text-black line-clamp-2 mb-1">
                              {app.name}
                            </CardTitle>
                            <p className="text-xs text-gray-600 mb-2">{app.developer}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-medium">{app.rating}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {app.store === "apple" ? "iOS" : "Android"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-xs text-gray-700 line-clamp-2">{app.description}</p>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="w-full h-8 text-xs border-gray-300 hover:bg-gray-50 bg-transparent"
                          >
                            <a
                              href={`https://apps.apple.com/app/id${app.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View App
                            </a>
                          </Button>
                          <Button
                            onClick={() => handleGetReviews(app.id)}
                            disabled={app.reviewsCollected || reviewsLoading === app.id}
                            className="w-full h-8 text-xs bg-black hover:bg-gray-800 text-white disabled:bg-gray-200 disabled:text-gray-400"
                          >
                            {reviewsLoading === app.id ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                Getting {reviewsPerApp} Reviews...
                              </>
                            ) : app.reviewsCollected ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-2" />
                                Reviews Collected
                              </>
                            ) : (
                              `Get ${reviewsPerApp} Reviews`
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {apps.length > 0 && !apps.every(a => a.reviewsCollected) && (
                  <Card className="border border-gray-200">
                    <CardContent className="text-center py-6">
                      <Button
                        onClick={() => {
                          apps.forEach(a => {
                            if (!a.reviewsCollected) handleGetReviews(a.id)
                          })
                        }}
                        disabled={reviewsLoading !== null}
                        className="bg-black hover:bg-gray-800 text-white disabled:bg-gray-200 disabled:text-gray-400"
                      >
                        {reviewsLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Getting {reviewsPerApp} Reviews for All Apps...
                          </>
                        ) : (
                          `Get ${reviewsPerApp} Reviews for All Apps`
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {reviews.length > 0 && (
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-black">Collected Reviews</CardTitle>
                      <CardDescription>User feedback from app store reviews.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reviews.map(r => (
                          <div key={r._id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                <span className="font-medium text-black text-sm">{r.reviewer}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {r.store === "apple" ? "iOS" : "Android"}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs">{r.rating}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700">{r.review}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            {!newsLoaded ? (
              <Card className="border border-gray-200">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-bold text-black">Fetch News Articles</CardTitle>
                  <CardDescription>Collect recent industry news.</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <Label htmlFor="news-count" className="text-sm font-medium">
                      Number of articles:
                    </Label>
                    <Input
                      id="news-count"
                      type="number"
                      min={1}
                      max={50}
                      value={newsCount}
                      onChange={e => setNewsCount(parseInt(e.target.value) || 10)}
                      className="w-20 text-center"
                    />
                  </div>
                  <Button
                    onClick={handleFetchNews}
                    disabled={newsLoading}
                    className="bg-black hover:bg-gray-800 text-white disabled:bg-gray-200 disabled:text-gray-400"
                  >
                    {newsLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Fetching Articles...
                      </>
                    ) : (
                      `Fetch ${newsCount} News Articles`
                    )}
                  </Button>
                  {newsLoading && (
                    <p className="text-sm text-gray-500 mt-4">Searching news sources and generating summaries...</p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {news.map(article => (
                  <Card key={article._id} className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-sm font-bold text-black line-clamp-2">
                        {article.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{article.author}</span>
                        <span>•</span>
                        <span className="truncate max-w-[140px]">{article.query}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-700">{article.description}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full h-8 text-xs border-gray-300 hover:bg-gray-50"
                      >
                        <a href={article.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-2" />
                          Read Full Article
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            {!socialLoaded ? (
              <Card className="border border-gray-200">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-bold text-black">Scrape Twitter/X Posts</CardTitle>
                  <CardDescription>Analyze social media discussions.</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <Label htmlFor="social-count" className="text-sm font-medium">
                      Number of posts:
                    </Label>
                    <Input
                      id="social-count"
                      type="number"
                      min={1}
                      max={100}
                      value={socialCount}
                      onChange={e => setSocialCount(parseInt(e.target.value) || 15)}
                      className="w-20 text-center"
                    />
                  </div>
                  <Button
                    onClick={handleScrapeTwitter}
                    disabled={socialLoading}
                    className="bg-black hover:bg-gray-800 text-white disabled:bg-gray-200 disabled:text-gray-400"
                  >
                    {socialLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Scraping Posts...
                      </>
                    ) : (
                      `Scrape ${socialCount} Posts`
                    )}
                  </Button>
                  {socialLoading && (
                    <p className="text-sm text-gray-500 mt-4">
                      Collecting posts and extracting metadata...
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {socialPosts.map(post => (
                  <Card key={post._id} className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                          {post.author.profile_picture ? (
                            <img
                              src={post.author.profile_picture}
                              alt={post.author.username}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <User className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-black text-sm truncate">
                              {post.author.name}
                            </span>
                            {post.entities.hashtags.slice(0, 1).map(h => (
                              <Badge
                                key={h.text}
                                className="text-xs bg-blue-100 text-blue-800"
                              >
                                #{h.text}
                              </Badge>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">@{post.author.username}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{post.text}</p>
                      {post.entities.hashtags.length > 1 && (
                        <div className="flex flex-wrap gap-1">
                          {post.entities.hashtags.slice(1).map(h => (
                            <span
                              key={h.text}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-[10px] font-medium text-gray-600"
                            >
                              <Hash className="h-3 w-3" /> {h.text}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {formatNumber(post.reply_count)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Repeat2 className="h-3 w-3" />
                            {formatNumber(post.retweet_count)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {formatNumber(post.like_count)}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="h-7 text-xs border-gray-300 hover:bg-gray-50 bg-transparent"
                        >
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}