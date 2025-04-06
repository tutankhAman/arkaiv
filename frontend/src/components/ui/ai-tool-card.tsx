import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"
import { Star, Download, BookOpen, ExternalLink, ChevronDown } from "lucide-react"

interface AIToolCardProps {
  name: string
  description?: string
  url: string
  source: "GitHub" | "HuggingFace" | "arXiv"
  metrics: {
    stars?: number
    downloads?: number
    citations?: number
  }
  type?: string
  className?: string
}

const AIToolCard = React.forwardRef<HTMLDivElement, AIToolCardProps>(
  ({ name, description, url, source, metrics, type, className, ...props }, ref) => {
    const [isExpanded, setIsExpanded] = React.useState(false)
    const showDescription = source !== "arXiv"

    return (
      <motion.div
        ref={ref}
        whileHover={{ scale: 1.02 }}
        className={cn(
          "bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-all duration-200",
          "flex flex-col",
          className
        )}
        {...props}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-200 line-clamp-1">{name}</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-gray-400">
              {source}
            </span>
          </div>

          {type && (
            <div className="mb-2">
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                {type}
              </span>
            </div>
          )}
          
          {showDescription && (
            <div className="mb-3">
              <p className={cn(
                "text-sm text-gray-400",
                isExpanded ? "" : "line-clamp-2"
              )}>
                {description}
              </p>
              {description && description.length > 100 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs text-primary hover:text-primary/80 mt-1 flex items-center"
                >
                  {isExpanded ? "Show less" : "Show more"}
                  <ChevronDown className={cn(
                    "w-3 h-3 ml-1 transition-transform",
                    isExpanded ? "rotate-180" : ""
                  )} />
                </button>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              {metrics.stars !== undefined && (
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  {metrics.stars.toLocaleString()}
                </div>
              )}
              {metrics.downloads !== undefined && (
                <div className="flex items-center">
                  <Download className="w-4 h-4 mr-1" />
                  {metrics.downloads.toLocaleString()}
                </div>
              )}
              {metrics.citations !== undefined && (
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {metrics.citations.toLocaleString()}
                </div>
              )}
            </div>
            
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center"
            >
              View <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </motion.div>
    )
  }
)
AIToolCard.displayName = "AIToolCard"

export { AIToolCard } 