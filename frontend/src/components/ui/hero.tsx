"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"
import { TextShimmer } from "./text-shimmer"
import { Stats } from "./stats"
import { SearchBar } from "./search-bar"

interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  gradient?: boolean
  blur?: boolean
  title: string
  titleClassName?: string
  onSearch?: (query: string) => void
}

const Hero = React.forwardRef<HTMLElement, HeroProps>(
  (
    {
      className,
      gradient = true,
      blur = true,
      title,
      titleClassName,
      onSearch,
      ...props
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative z-0 flex min-h-[60vh] w-full flex-col items-center justify-start overflow-hidden rounded-md bg-zinc-950",
          className,
        )}
        {...props}
      >
        {gradient && (
          <div className="absolute top-0 isolate z-0 flex w-screen flex-1 items-start justify-center overflow-visible">
            {blur && (
              <div className="absolute top-0 z-50 h-48 w-screen bg-transparent opacity-10 backdrop-blur-md" />
            )}

            {/* Main glow */}
            <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-[-30%] rounded-full bg-primary/40 opacity-80 blur-3xl" />

            {/* Lamp effect */}
            <motion.div
              initial={{ width: "8rem" }}
              viewport={{ once: true }}
              transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
              whileInView={{ width: "16rem" }}
              className="absolute top-0 z-30 h-36 -translate-y-[20%] rounded-full bg-primary/40 blur-2xl"
            />

            {/* Top line */}
            <motion.div
              initial={{ width: "15rem" }}
              viewport={{ once: true }}
              transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
              whileInView={{ width: "30rem" }}
              className="absolute inset-auto z-50 h-0.5 -translate-y-[-10%] bg-primary/40"
            />

            {/* Left gradient cone */}
            <motion.div
              initial={{ opacity: 0.5, width: "15rem" }}
              whileInView={{ opacity: 1, width: "30rem" }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              style={{
                backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
              }}
              className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-primary/40 via-transparent to-transparent [--conic-position:from_70deg_at_center_top]"
            >
              <div className="absolute w-[100%] left-0 bg-zinc-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
              <div className="absolute w-40 h-[100%] left-0 bg-zinc-950 bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
            </motion.div>

            {/* Right gradient cone */}
            <motion.div
              initial={{ opacity: 0.5, width: "15rem" }}
              whileInView={{ opacity: 1, width: "30rem" }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              style={{
                backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
              }}
              className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-primary/40 [--conic-position:from_290deg_at_center_top]"
            >
              <div className="absolute w-40 h-[100%] right-0 bg-zinc-950 bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
              <div className="absolute w-[100%] right-0 bg-zinc-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
            </motion.div>
          </div>
        )}

        <motion.div
          initial={{ y: 100, opacity: 0.5 }}
          viewport={{ once: true }}
          transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
          whileInView={{ y: 0, opacity: 1 }}
          className="relative z-50 container flex justify-center flex-1 flex-col px-5 md:px-10 py-16"
        >
          <div className="flex flex-col items-center text-center space-y-8">
            <TextShimmer
              as="h1"
              duration={1.2}
              className={cn(
                "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-400 font-heading",
                titleClassName,
              )}
            >
              {title}
            </TextShimmer>
            <p className="text-lg text-gray-400/80 font-light tracking-wide font-sans">
              an archive for the latest AIs out there
            </p>
            <Stats />
            <SearchBar onSearch={onSearch} />
          </div>
        </motion.div>
      </section>
    )
  },
)
Hero.displayName = "Hero"

export { Hero } 