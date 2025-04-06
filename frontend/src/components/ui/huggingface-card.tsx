import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"
import { Heart, Download, ExternalLink, ChevronDown, Loader2 } from "lucide-react"

interface HuggingFaceCardProps {
  name: string
  description: string
  url: string
  metrics: {
    likes?: number
    downloads?: number
  }
  type?: string
  className?: string
  isLoading?: boolean
}

const HuggingFaceCard = React.forwardRef<HTMLDivElement, HuggingFaceCardProps>(
  ({ name, description, url, metrics, type, className, isLoading = false, ...props }, ref) => {
    const [isExpanded, setIsExpanded] = React.useState(false)

    return (
      <motion.div
        ref={ref}
        whileHover={{ scale: 1.02 }}
        className={cn(
          "relative bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 border border-zinc-800 rounded-lg p-4",
          "hover:border-zinc-700 transition-all duration-200 shadow-lg hover:shadow-xl",
          "flex flex-col",
          className
        )}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-zinc-900/50 rounded-lg flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}
        
        <div className="flex flex-col h-full">
          {/* Title and Source */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-200 line-clamp-2" aria-label={`Model: ${name}`}>
                {name}
              </h3>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-gray-400 ml-2">
              HuggingFace
            </span>
          </div>

          {/* Type Badge */}
          {type && (
            <div className="mb-3">
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                {type}
              </span>
            </div>
          )}
          
          {/* Description */}
          <div className="mb-4">
            <AnimatePresence>
              <motion.p
                initial={false}
                animate={{ height: isExpanded ? "auto" : "3em" }}
                className={cn(
                  "text-sm text-gray-400 overflow-hidden",
                  !isExpanded && "line-clamp-2"
                )}
              >
                {description}
              </motion.p>
            </AnimatePresence>
            {description && description.length > 100 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-primary hover:text-primary/80 mt-1 flex items-center"
                aria-label={isExpanded ? "Show less description" : "Show more description"}
              >
                {isExpanded ? "Show less" : "Show more"}
                <ChevronDown className={cn(
                  "w-3 h-3 ml-1 transition-transform duration-200",
                  isExpanded ? "rotate-180" : ""
                )} />
              </button>
            )}
          </div>

          {/* Metrics and View Button */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              {metrics.likes !== undefined && (
                <div className="flex items-center" aria-label={`${metrics.likes} likes`}>
                  <Heart className="w-4 h-4 mr-1" />
                  {metrics.likes.toLocaleString()}
                </div>
              )}
              {metrics.downloads !== undefined && (
                <div className="flex items-center" aria-label={`${metrics.downloads} downloads`}>
                  <Download className="w-4 h-4 mr-1" />
                  {metrics.downloads.toLocaleString()}
                </div>
              )}
            </div>
            
            <motion.a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`View ${name} on HuggingFace`}
            >
              View <ExternalLink className="w-4 h-4 ml-1" />
            </motion.a>
          </div>
        </div>
      </motion.div>
    )
  }
)
HuggingFaceCard.displayName = "HuggingFaceCard"

export { HuggingFaceCard } 