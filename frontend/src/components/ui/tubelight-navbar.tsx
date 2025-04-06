import React from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { LucideIcon } from "lucide-react"
import { cn } from "../../lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = React.useState(0)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <nav
      className={cn(
        "flex items-center justify-center w-fit mx-auto bg-[linear-gradient(to_right,rgba(31,41,55,0.3),rgba(17,24,39,0.2))] backdrop-blur-md border border-gray-500/30 rounded-full p-2 font-raleway font-bold",
        className
      )}
    >
      <ul className="flex items-center justify-center space-x-1">
        {items.map((item, index) => {
          const Icon = item.icon
          return (
            <li key={item.name} className="relative">
              <Link
                to={item.url}
                className={cn(
                  "flex items-center justify-center px-8 py-2 rounded-full text-sm transition-colors duration-200",
                  activeTab === index
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-200"
                )}
                onClick={() => setActiveTab(index)}
              >
                <Icon className="w-5 h-5" />
                {!isMobile && <span className="ml-2">{item.name}</span>}
              </Link>
              {activeTab === index && (
                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[20px] h-0.5"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                >
                  {/* Main line */}
                  <div className="absolute inset-0 bg-blue-400" />
                  {/* Glow layers */}
                  <div className="absolute inset-0 bg-blue-400/60 blur-[2px]" />
                  <div className="absolute inset-0 bg-blue-400/40 blur-[4px]" />
                  <div className="absolute inset-0 bg-blue-400/20 blur-[6px]" />
                </motion.div>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
} 