import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"
import { Heart, Download, ExternalLink, ChevronDown, Loader2, Users, Code, Clock, Tag, Database } from "lucide-react"

interface HuggingFaceCardProps {
  name: string
  description: string
  url: string
  metrics: {
    likes?: number
    downloads?: number
    lastUpdated?: string
    contributors?: number
    tags?: string[]
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
          "relative bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 border border-zinc-800 rounded-lg p-3",
          "hover:border-zinc-700 transition-all duration-200 shadow-md hover:shadow-lg",
          "flex flex-col",
          className
        )}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-zinc-900/50 rounded-lg flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
        )}
        
        <div className="flex flex-col h-full">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-gray-200 line-clamp-1" aria-label={`Model: ${name}`}>
              {name}
            </h3>
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-zinc-800 text-gray-400 ml-2 flex items-center gap-1">
              <Database className="w-3 h-3" />
              HuggingFace
            </span>
          </div>

          {/* Type and Tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {type && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                <Code className="w-3 h-3" />
                {type}
              </span>
            )}
            {metrics.tags?.slice(0, 2).map((tag, index) => (
              <span key={index} className="text-xs px-1.5 py-0.5 rounded-full bg-zinc-800 text-gray-400 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
          
          {/* Description */}
          <div className="mb-3">
            <AnimatePresence>
              <motion.p
                initial={false}
                animate={{ height: isExpanded ? "auto" : "2.5em" }}
                className={cn(
                  "text-xs text-gray-400 overflow-hidden",
                  !isExpanded && "line-clamp-2"
                )}
              >
                {description}
              </motion.p>
            </AnimatePresence>
            {description && description.length > 100 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-primary hover:text-primary/80 mt-0.5 flex items-center"
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

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {metrics.likes !== undefined && (
              <div className="bg-zinc-800/50 rounded-lg p-2 flex items-center gap-1.5" aria-label={`${metrics.likes} likes`}>
                <Heart className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-gray-200">{metrics.likes.toLocaleString()}</span>
                <span className="text-xs text-gray-400">Likes</span>
              </div>
            )}
            {metrics.downloads !== undefined && (
              <div className="bg-zinc-800/50 rounded-lg p-2 flex items-center gap-1.5" aria-label={`${metrics.downloads} downloads`}>
                <Download className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-gray-200">{metrics.downloads.toLocaleString()}</span>
                <span className="text-xs text-gray-400">Downloads</span>
              </div>
            )}
            {metrics.contributors !== undefined && (
              <div className="bg-zinc-800/50 rounded-lg p-2 flex items-center gap-1.5" aria-label={`${metrics.contributors} contributors`}>
                <Users className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-gray-200">{metrics.contributors.toLocaleString()}</span>
                <span className="text-xs text-gray-400">Contributors</span>
              </div>
            )}
            {metrics.lastUpdated && (
              <div className="bg-zinc-800/50 rounded-lg p-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-gray-200">
                  {new Date(metrics.lastUpdated).toLocaleDateString()}
                </span>
                <span className="text-xs text-gray-400">Updated</span>
              </div>
            )}
          </div>

          {/* View Button */}
          <motion.a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-primary/10 hover:bg-primary/20 text-primary rounded-lg py-1.5 px-3 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label={`View ${name} on HuggingFace`}
          >
            View on HuggingFace
            <ExternalLink className="w-3.5 h-3.5" />
          </motion.a>
        </div>
      </motion.div>
    )
  }
)
HuggingFaceCard.displayName = "HuggingFaceCard"

export { HuggingFaceCard }