import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Source } from "@/types/requirements"
import { ExternalLink, FileText, MessageSquare, Newspaper, Star } from "lucide-react"

interface Props {
  source: Source // Changed to a single source
}

export function SourcesList({ source }: Props) {
  // Changed prop name
  return (
    <div className="space-y-3">
      {/* Render the single source directly */}
      <div className="border border-gray-200 rounded-lg p-4">
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
            <p
              className="text-sm text-gray-700 leading-relaxed line-clamp-3"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}
            >
              {source.content}
            </p>
            {source.link && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="mt-2 h-7 text-xs border-gray-300 hover:bg-gray-50 bg-transparent"
              >
                <a href={source.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  View Source
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getSourceIcon(type: Source["type"]) {
  switch (type) {
    case "news":
      return <Newspaper className="h-4 w-4" />
    case "review":
      return <Star className="h-4 w-4" />
    case "tweet":
      return <MessageSquare className="h-4 w-4" />
    default:
      return <FileText className="h-4 w-4" />
  }
}

function getSourceColor(type: Source["type"]) {
  switch (type) {
    case "news":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "review":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "tweet":
      return "bg-purple-100 text-purple-800 border-purple-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}
