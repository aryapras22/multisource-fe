import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { NewsArticleCard } from "./NewsArticleCard"
import type { UseNewsCollection } from "@/hooks/useNewsCollection"
import { useState } from "react"
import type { NewsArticle } from "@/types/collections"

/**
 * Handles the news collection UI flow.
 */
export function NewsCollectionSection({ logic }: { logic: UseNewsCollection }) {
  const { news, newsCount, setNewsCount, fetchNews } = logic
  const [sampledArticles, setSampledArticles] = useState<NewsArticle[] | null>(null)
  const [sampleCopying, setSampleCopying] = useState(false)
  const [sampleCopied, setSampleCopied] = useState(false)

  if (!news.loaded) {
    return (
      <Card className="border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold text-black">Fetch News Articles</CardTitle>
          <CardDescription>Collect recent industry news by queries.</CardDescription>
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
          {news.error && <p className="text-sm text-red-600">{news.error}</p>}

        </CardContent>
      </Card>
    )
  }

  const pickRandom = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]
  // ---------- Frontend cleaning utilities (approx. preprocessing.py) ----------
  const normalizeUnicode = (s?: string) => (s || "").normalize ? (s || "").normalize("NFKC") : (s || "")

  const stripHtml = (s?: string) => (s || "").replace(/<[^>]+>/g, " ")

  const removeUrls = (s?: string) => (s || "").replace(/(?:https?:\/\/|www\.)[^\s<>"')]+/gi, " ")

  const removeEmails = (s?: string) => (s || "").replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, " ")

  const removePhoneNumbers = (s?: string) => (s || "").replace(/(?:\+?\d[\d\s().-]{6,}\d)/g, " ")

  const removeEmojis = (s?: string) => {
    if (!s) return ""
    // Broad unicode ranges for pictographs/emojis
    return s.replace(/[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1FAFF}\u2600-\u26FF\u2700-\u27BF]/gu, " ")
  }

  const NEWS_DATELINE_RE = /^([A-Z][A-Z]+(?:\s+[A-Z][A-Z]+)*)\s*\([A-Za-z .&-]+\)\s*-\s*/i
  const NEWS_TRAILER_RE = /(?:^|\s)(?:Reporting\s+by|Edited\s+by|Writing\s+by|With\s+reporting\s+by)[^.]*\./gi
  const NEWS_SOURCE_PHRASES = [
    '— reuters', '— ap', '— associated press', '— cnn', '— bbc', '— bloomberg', '(reuters)', '(ap)', '(afp)', 'copyright', 'all rights reserved'
  ]

  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

  const removeNewsBoilerplate = (s?: string) => {
    let t = s || ""
    t = t.replace(NEWS_DATELINE_RE, " ")
    t = t.replace(NEWS_TRAILER_RE, " ")
    // Remove known source phrases case-insensitively while preserving original case
    for (const p of NEWS_SOURCE_PHRASES) {
      const re = new RegExp(escapeRegExp(p), "gi")
      t = t.replace(re, " ")
    }
    return t
  }

  // preserve dots and commas (do not remove '.' or ',')
  const removePunctNumbersSymbols = (s?: string) => (s || "").replace(/[^A-Za-z\s.,]/g, " ")

  const collapseWhitespace = (s?: string) => (s || "").replace(/\s+/g, " ").trim()

  const cleanNewsContent = (text?: string) => {
    let t = normalizeUnicode(text)
    t = stripHtml(t)
    t = removeUrls(t)
    t = removeEmails(t)
    t = removePhoneNumbers(t)
    t = removeNewsBoilerplate(t)
    t = removeEmojis(t)
    t = removePunctNumbersSymbols(t)
    return collapseWhitespace(t)
  }

  const copySampleContent = async (source: NewsArticle[]) => {
    if (!source || !source.length) return
    // Build numbered plain-text list using cleaned news content
    const items = source.map((a, i) => {
      const main = cleanNewsContent(a.content || a.description || a.title || "")
      return `${i + 1}. ${main}`
    })
    const content = items.join('\n\n')
    try {
      setSampleCopying(true)
      await navigator.clipboard.writeText(content)
      setSampleCopied(true)
      setTimeout(() => setSampleCopied(false), 2000)
    } catch (err) {
      alert(`Failed to copy sample: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setSampleCopying(false)
    }
  }

  const handleGenerateSample = async () => {
    const input = prompt("Enter sample size (integer). Must be large enough to cover all queries present in the collection.")
    if (input === null) return
    const n = parseInt(input, 10)
    if (Number.isNaN(n) || n <= 0) {
      alert("Invalid sample size")
      return
    }

    const items = news.items
    const queries = Array.from(new Set(items.map(i => i.query).filter(Boolean))).sort()
    const minRequired = Math.max(queries.length, 1)
    if (n < minRequired) {
      alert(`Sample size too small. Need at least ${minRequired} to represent all queries.`)
      return
    }

    const byId = new Map<string, NewsArticle>()

    // Ensure at least one per query
    for (const q of queries) {
      const pool = items.filter(i => i.query === q)
      if (pool.length) {
        const chosen = pickRandom(pool)
        byId.set(chosen._id, chosen)
      }
    }

    // Fill remainder randomly
    const remaining = items.filter(i => !byId.has(i._id))
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = remaining[i]
      remaining[i] = remaining[j]
      remaining[j] = tmp
    }
    for (const a of remaining) {
      if (byId.size >= n) break
      byId.set(a._id, a)
    }

    const sample = Array.from(byId.values()).slice(0, n)
    setSampledArticles(sample)
    try { await copySampleContent(sample) } catch (_) { }
  }

  const source = sampledArticles ?? news.items

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setSampledArticles(null)}>
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={handleGenerateSample}>
            Generate Random Sample
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => sampledArticles && copySampleContent(sampledArticles)}
            disabled={!sampledArticles || sampleCopying}
          >
            {sampleCopied ? "Copied" : "Copy Sample"}
          </Button>
        </div>
        <div className="text-xs text-gray-500">
          Showing {source.length} of {news.items.length} articles
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {source.map(article => (
          <NewsArticleCard key={article._id} article={article} onDelete={logic.deleteNews} />
        ))}
      </div>
    </div>
  )
}