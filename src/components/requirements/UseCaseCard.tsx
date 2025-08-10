import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { UseCaseDiagram } from "@/types/requirements"

interface Props {
  diagram: UseCaseDiagram
  projectId?: string
  showProject?: boolean
}

export function UseCaseCard({ diagram, projectId, showProject }: Props) {
  const [showSrc, setShowSrc] = useState(false)

  return (
    <Card className="border border-gray-200">
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="font-mono text-[10px]">
            Part {diagram.part}/{diagram.total}
          </Badge>
          {showProject && projectId && (
            <Badge variant="secondary" className="font-mono text-[10px]">
              {projectId.slice(0, 8)}
            </Badge>
          )}
        </div>
        <CardTitle className="text-sm font-semibold text-black truncate">
          {diagram.rawTitle || `Diagram ${diagram.part}`}
        </CardTitle>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowSrc(s => !s)}
            className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
          >
            {showSrc ? "Hide PUML" : "Show PUML"}
          </button>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(diagram.puml)}
            className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
          >
            Copy
          </button>
          <a
            href={diagram.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
          >
            Open
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative w-full h-64 bg-gray-50 rounded-lg overflow-hidden border border-gray-200 p-2 flex items-center justify-center">
          {diagram.imageUrl ? (
            <img
              src={diagram.imageUrl}
              alt={`Use case diagram part ${diagram.part}`}
              className="object-contain w-full h-full"
              crossOrigin="anonymous"
              loading="lazy"
            />
          ) : (
            <div className="text-xs text-gray-400">No image URL</div>
          )}
        </div>
        {showSrc && (
          <pre className="text-[10px] leading-snug bg-black/90 text-green-200 p-2 rounded overflow-auto max-h-56">
            {diagram.puml}
          </pre>
        )}
      </CardContent>
    </Card>
  )
}