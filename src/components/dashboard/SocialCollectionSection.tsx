import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { SocialPostCard } from "./SocialPostCard"
import type { UseSocialCollection } from "@/hooks/useSocialCollection"
import { useState } from "react"
import type { SocialPost } from "@/types/collections"

/**
 * Manages the social media scraping UI workflow.
 */
export function SocialCollectionSection({ logic }: { logic: UseSocialCollection }) {
  const { social, socialCount, setSocialCount, scrapeSocial } = logic

  const [sampledPosts, setSampledPosts] = useState<SocialPost[] | null>(null)
  const [sampleCopying, setSampleCopying] = useState(false)
  const [sampleCopied, setSampleCopied] = useState(false)

  if (!social.loaded) {
    return (
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
            onClick={scrapeSocial}
            disabled={social.loading}
            className="bg-black hover:bg-gray-800 text-white disabled:bg-gray-200 disabled:text-gray-400"
          >
            {social.loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Scraping Posts...
              </>
            ) : (
              `Scrape ${socialCount} Posts`
            )}
          </Button>
          {social.loading && (
            <p className="text-sm text-gray-500 mt-4">
              Collecting posts and extracting metadata...
            </p>
          )}
          {social.error && <p className="text-sm text-red-600">{social.error}</p>}

        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setSampledPosts(null)}>
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const input = prompt("Enter sample size (integer). Must be large enough to cover all authors.")
              if (input === null) return
              const n = parseInt(input, 10)
              if (Number.isNaN(n) || n <= 0) { alert("Invalid sample size"); return }

              const items = social.items
              const queries = Array.from(new Set(items.map(i => i.query).filter(Boolean))).sort()
              const minRequired = Math.max(queries.length, 1)
              if (n < minRequired) { alert(`Sample size too small. Need at least ${minRequired} to represent all queries.`); return }

              const byId = new Map<string, SocialPost>()
              const pickRandom = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

              // ensure at least one per query
              for (const q of queries) {
                const pool = items.filter(i => i.query === q)
                if (pool.length) {
                  const chosen = pickRandom(pool)
                  byId.set(chosen._id, chosen)
                }
              }

              // fill remainder randomly
              const remaining = items.filter(i => !byId.has(i._id))
              for (let i = remaining.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1))
                const tmp = remaining[i]; remaining[i] = remaining[j]; remaining[j] = tmp
              }
              for (const r of remaining) { if (byId.size >= n) break; byId.set(r._id, r) }

              const sample = Array.from(byId.values()).slice(0, n)
              setSampledPosts(sample)
              // auto-copy cleaned sample
              try { await copySampleContent(sample) } catch (_) { }
            }}
          >
            Generate Random Sample
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => sampledPosts && copySampleContent(sampledPosts)}
            disabled={!sampledPosts || sampleCopying}
          >
            {sampleCopied ? "Copied" : "Copy Sample"}
          </Button>
        </div>
        <div className="text-xs text-gray-500">
          Showing {(sampledPosts ?? social.items).length} of {social.items.length} posts
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(sampledPosts ?? social.items).map(p => (
          <SocialPostCard key={p._id} post={p} onDelete={logic.deleteSocial} />
        ))}
      </div>
    </div>
  )
}

// ---------- helpers: cleaning & copying ----------
const normalizeUnicode = (s?: string) => (s || "").normalize ? (s || "").normalize("NFKC") : (s || "")
const removeUrls = (s?: string) => (s || "").replace(/(?:https?:\/\/|www\.)[^\s<>'"\)]+/gi, " ")
const removeHashtags = (s?: string) => (s || "").replace(/#[A-Za-z0-9_]+/g, " ")
const stripHtml = (s?: string) => (s || "").replace(/<[^>]+>/g, " ")
const collapseWhitespace = (s?: string) => (s || "").replace(/\s+/g, " ").trim()

const cleanSocialText = (text?: string) => {
  let t = normalizeUnicode(text)
  t = stripHtml(t)
  t = removeUrls(t)
  t = removeHashtags(t)
  return collapseWhitespace(t)
}

const copySampleContent = async (source: SocialPost[]) => {
  if (!source || !source.length) return
  // Build numbered plain-text list of cleaned content
  const items = source.map((p, i) => `${i + 1}. ${cleanSocialText(p.text)}`)
  const content = items.join('\n\n')
  try {
    await navigator.clipboard.writeText(content)
  } catch (err) {
    alert(`Failed to copy social sample: ${err instanceof Error ? err.message : 'Unknown error'}`)
  }
}