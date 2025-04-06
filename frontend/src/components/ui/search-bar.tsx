"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"
import { useNavigate } from "react-router-dom"

interface SearchBarProps extends React.HTMLAttributes<HTMLDivElement> {
  onSearch?: (query: string) => void
}

const SearchBar = React.forwardRef<HTMLDivElement, SearchBarProps>(
  ({ className, onSearch, ...props }, ref) => {
    const [query, setQuery] = React.useState("")
    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSearch?.(query)
    }

    const handleDiscoverClick = () => {
      navigate('/discover')
    }

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className={cn("w-full max-w-2xl mt-6", className)}
        {...props}
      >
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search AI tools..."
              className="w-full mt-10 pl-12 pr-6 py-4 text-gray-300 bg-zinc-900/50 border border-zinc-800 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent placeholder-gray-500"
            />
            <div className="absolute left-4 top-[calc(50%+20px)] -translate-y-1/2 text-gray-400 pointer-events-none">
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
        <div className="flex justify-center space-x-6 mt-6">
          <motion.button
            type="submit"
            onClick={handleSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-primary/20 text-primary hover:bg-primary/30 rounded-full transition-all duration-200 font-bold text-sm tracking-wide shadow-lg shadow-primary/10 hover:shadow-primary/20"
          >
            Search
          </motion.button>
          <motion.button
            onClick={handleDiscoverClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-zinc-800 text-gray-300 hover:bg-zinc-700 rounded-full transition-all duration-200 font-bold text-sm tracking-wide shadow-lg shadow-zinc-900/10 hover:shadow-zinc-900/20"
          >
            Discover More
          </motion.button>
        </div>
      </motion.div>
    )
  }
)
SearchBar.displayName = "SearchBar"

export { SearchBar } 