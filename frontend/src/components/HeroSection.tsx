import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import robotImage from "../assets/ai-robot.png";

export function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      aria-labelledby="hero-heading"
      className="relative overflow-hidden rounded-3xl bg-gradient-hero p-6 shadow-card sm:p-8"
    >
      <div className="relative z-10 max-w-xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-card/70 px-3 py-1 text-xs font-semibold text-accent-foreground dark:text-white">
          <Sparkles className="size-3.5" aria-hidden="true" />
          AI Study Assistant
        </span>
        <h2
          id="hero-heading"
          className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl dark:text-white "
        >
          Learn Smarter with AI
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base dark:text-white">
          Generate notes, solve GTU papers, practice viva, summarize PDFs and prepare faster than
          ever.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 dark:text-white">
          <button
            type="button"
            className=" inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:-translate-y-0.5 ring bg-color-primary"
          >
            Start Studying
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            Continue Learning
          </button>
        </div>
      </div>

      <motion.img
        src={robotImage}
        alt="AI study assistant robot"
        loading="lazy"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-4 bottom-0 hidden h-[110%] w-auto select-none object-contain md:block"
      />
    </motion.section>
  );
}

export default HeroSection;
