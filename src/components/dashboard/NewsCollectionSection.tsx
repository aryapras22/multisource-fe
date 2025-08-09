import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { NewsArticleCard } from "./NewsArticleCard"
import type { UseNewsCollection } from "@/hooks/useNewsCollection"

/**
 * Handles the news collection UI flow.
 */
export function NewsCollectionSection({ logic }: { logic: UseNewsCollection }) {
  const { news, newsCount, setNewsCount, fetchNews } = logic

  if (!news.loaded) {
    return (
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
            onClick={fetchNews}
            disabled={news.loading}
            className="bg-black hover:bg-gray-800 text-white disabled:bg-gray-200 disabled:text-gray-400"
          >
            {news.loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Fetching Articles...
              </>
            ) : (
              `Fetch ${newsCount} News Articles`
            )}
          </Button>
          {news.loading && (
            <p className="text-sm text-gray-500 mt-4">
              Searching news sources and generating summaries...
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {news.items.map(article => (
        <NewsArticleCard key={article._id} article={article} />
      ))}
    </div>
  )
}