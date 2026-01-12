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

    const normalizeUnicode = (s?: string) => (s || "").normalize ? (s || "").normalize("NFKC") : (s || "")
    const stripHtml = (s?: string) => (s || "").replace(/<[^>]+>/g, " ")
    const removeUrls = (s?: string) => (s || "").replace(/(?:https?:\/\/|www\.)[^\s<>"')]+/gi, " ")
    const removeEmails = (s?: string) => (s || "").replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, " ")
    const removePhoneNumbers = (s?: string) => (s || "").replace(/(?:\+?\d[\d\s().-]{6,}\d)/g, " ")
    // preserve dots and commas (do not remove '.' or ',')
    const removePunctNumbersSymbols = (s?: string) => (s || "").replace(/[^A-Za-z\s.,]/g, " ")
    const collapseWhitespace = (s?: string) => (s || "").replace(/\s+/g, " ").trim()

    const clean = (text?: string) => {
      let t = normalizeUnicode(text)
      t = stripHtml(t)
      t = removeUrls(t)
      t = removeEmails(t)
      t = removePhoneNumbers(t)
      t = removePunctNumbersSymbols(t)
      return collapseWhitespace(t)
    }

    try {
      const payload = {
        _id: article._id,
        title: clean(article.title),
        author: clean(article.author),
        query: clean(article.query),
        link: article.link,
        cleaned: clean(article.content || article.description || ""),
        references: article.link ? [article.link] : [],
        published: article.published,
      }
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
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