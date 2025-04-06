"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "../../lib/utils"

interface StatsProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  className?: string
}

interface ToolsCount {
  total: number
  bySource: {
    github: number
    huggingface: number
    arxiv: number
  }
}

const Stats = React.forwardRef<HTMLDivElement, StatsProps>(
  ({ className, ...props }, ref) => {
    const [stats, setStats] = React.useState({
      totalModels: 0,
      newToolsToday: 0
    })

    React.useEffect(() => {
      const fetchStats = async () => {
        try {
          // Fetch total models count
          const countResponse = await fetch('http://localhost:3000/api/tools/count')
          if (!countResponse.ok) {
            throw new Error(`Count API error: ${countResponse.status}`)
          }
          const countData = await countResponse.json() as ToolsCount
          
          // Fetch latest digest for new tools count
          const digestResponse = await fetch('http://localhost:3000/api/digest/latest')
          if (!digestResponse.ok) {
            throw new Error(`Digest API error: ${digestResponse.status}`)
          }
          const digestData = await digestResponse.json()

          setStats({
            totalModels: countData.total,
            newToolsToday: digestData?.newTools || 0
          })
        } catch (error) {
          console.error('Error fetching stats:', error)
          // Set to 0 if there's an error
          setStats({
            totalModels: 0,
            newToolsToday: 0
          })
        }
      }

      fetchStats()
    }, [])

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className={cn("flex flex-col items-center space-y-2", className)}
        {...props}
      >
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-300 font-heading">{stats.totalModels}</p>
            <p className="text-sm text-gray-400">Models scraped</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-300 font-heading">{stats.newToolsToday}</p>
            <p className="text-sm text-gray-400">New tools today</p>
          </div>
        </div>
      </motion.div>
    )
  }
)
Stats.displayName = "Stats"

export { Stats } 