import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Trash2, Clipboard, Check } from "lucide-react"
import type { NewsArticle } from "@/types/collections"
import { useState } from "react"

/**
 * Displays a single news article summary.
 */
export function NewsArticleCard({ article, onDelete }: { article: NewsArticle; onDelete?: (id: string) => Promise<void> }) {
  const [deleting, setDeleting] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleDelete = async () => {
    if (!onDelete) return

    if (!confirm(`Delete article "${article.title}"?\n\nThis action cannot be undone.`)) {
      return
    }

    setDeleting(true)
    try {
      await onDelete(article._id)
    } catch (error) {
      alert(`Failed to delete article: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setDeleting(false)
    }
  }
  const handleCopy = async () => {
    if (!article) return
    try {
      const text = `${article.title}\n\n${article.content || article.description || ""}`
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      alert(`Failed to copy article text: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 h-8 text-xs border-gray-300 hover:bg-gray-50"
          >
            <a href={article.link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-2" />
              Read Full Article
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-8 px-3 text-xs border-gray-300 hover:bg-gray-50"
            aria-label="Copy article text"
          >
            {copied ? <Check className="h-3 w-3 text-green-600 mr-1" /> : <Clipboard className="h-3 w-3 mr-1" />}
            <span>Copy</span>
          </Button>
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="h-8 px-3 text-xs border-red-300 hover:bg-red-50 hover:text-red-700 text-red-600 disabled:opacity-50"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}