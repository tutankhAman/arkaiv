"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

interface SearchBarProps extends React.HTMLAttributes<HTMLDivElement> {
  onSearch?: (query: string) => void
}

const SearchBar = React.forwardRef<HTMLDivElement, SearchBarProps>(
  ({ className, onSearch, ...props }, ref) => {
    const [query, setQuery] = React.useState("")

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSearch?.(query)
    }

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className={cn("w-full max-w-2xl mt-12", className)}
        {...props}
      >
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search AI tools..."
              className="w-full pl-12 pr-6 py-4 text-gray-300 bg-zinc-900/50 border border-zinc-800 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent placeholder-gray-500"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>
        </form>
      </motion.div>
    )
  }
)
SearchBar.displayName = "SearchBar"

export { SearchBar } 