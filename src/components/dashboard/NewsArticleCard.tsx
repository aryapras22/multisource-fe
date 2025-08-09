import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import type { NewsArticle } from "@/types/collections"

/**
 * Displays a single news article summary.
 */
export function NewsArticleCard({ article }: { article: NewsArticle }) {
  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-sm font-bold text-black line-clamp-2">{article.title}</CardTitle>
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
  )
}