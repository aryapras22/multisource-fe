import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, ExternalLink, MessageCircle, Repeat2, Heart, Hash } from "lucide-react"
import type { SocialPost } from "@/types/collections"

/**
 * Utility number formatter shared for social metrics.
 */
const formatNumber = (n: number) => (n >= 1000 ? (n / 1000).toFixed(1) + "K" : n.toString())

/**
 * Renders a single social media post card.
 */
export function SocialPostCard({ post }: { post: SocialPost }) {
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
        </div>
      </CardContent>
    </Card>
  )
}