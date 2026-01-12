import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, ExternalLink, MessageCircle, Repeat2, Heart, Hash, Trash2, Clipboard, Check } from "lucide-react"
import type { SocialPost } from "@/types/collections"
import { useState } from "react"

/**
 * Utility number formatter shared for social metrics.
 */
const formatNumber = (n: number) => (n >= 1000 ? (n / 1000).toFixed(1) + "K" : n.toString())

/**
 * Renders a single social media post card.
 */
export function SocialPostCard({ post, onDelete }: { post: SocialPost; onDelete?: (id: string) => Promise<void> }) {
  const [deleting, setDeleting] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleDelete = async () => {
    if (!onDelete) return

    const postPreview = post.text.length > 50 ? post.text.substring(0, 50) + '...' : post.text
    if (!confirm(`Delete post "${postPreview}"?\n\nThis action cannot be undone.`)) {
      return
    }

    setDeleting(true)
    try {
      await onDelete(post._id)
    } catch (error) {
      alert(`Failed to delete post: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setDeleting(false)
    }
  }
  const handleCopy = async () => {
    try {
      const normalizeUnicode = (s?: string) => (s || "").normalize ? (s || "").normalize("NFKC") : (s || "")
      const stripHtml = (s?: string) => (s || "").replace(/<[^>]+>/g, " ")
      const removeUrls = (s?: string) => (s || "").replace(/(?:https?:\/\/|www\.)[^\s<>'"\)]+/gi, " ")
      const removeHashtags = (s?: string) => (s || "").replace(/#[A-Za-z0-9_]+/g, " ")
      const removeEmojis = (s?: string) => {
        if (!s) return "";

        // Remove pictographic emoji codepoints, emoji modifiers, variation selectors and ZWJ
        // This handles sequences like 👩‍💻 (ZWJ) and emoji+VS16 (U+FE0F)
        try {
          return s
            .replace(/[\p{Extended_Pictographic}\p{Emoji_Modifier}\uFE0F\u200D]+/gu, " ")
            .replace(/\s+/g, " ")
            .trim();
        } catch (e) {
          // Fallback for environments without Unicode property escapes support
          return s.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, " ").replace(/\s+/g, " ").trim()
        }
      };
      const collapseWhitespace = (s?: string) => (s || "").replace(/\s+/g, " ").trim()

      const clean = (text?: string) => collapseWhitespace(removeEmojis(removeHashtags(removeUrls(stripHtml(normalizeUnicode(text))))))

      const text = `1. ${clean(post.text)}`
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      alert(`Failed to copy post text: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }
  return (
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
              <span className="font-bold text-black text-sm truncate">{post.author.name}</span>
              {
                post.entities.hashtags && (
                  <>
                    {post.entities.hashtags.slice(0, 1).map(h => (
                      <Badge key={h.text} className="text-xs bg-blue-100 text-blue-800">
                        #{h.text}
                      </Badge>
                    ))}
                  </>
                )
              }
            </div>
            <span className="text-xs text-gray-500">@{post.author.username}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-900 whitespace-pre-wrap">{post.text}</p>
        {
          post.entities.hashtags && <>
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
            )}</>
        }
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
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-7 text-xs border-gray-300 hover:bg-gray-50 bg-transparent"
            >
              <a href={post.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                View
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2 text-xs border-gray-300 hover:bg-gray-50 bg-transparent"
              aria-label="Copy post text"
            >
              {copied ? <Check className="h-3 w-3 text-green-600" /> : <Clipboard className="h-3 w-3" />}
            </Button>
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                className="h-7 px-2 text-xs border-red-300 hover:bg-red-50 hover:text-red-700 text-red-600 disabled:opacity-50"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}