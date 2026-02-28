import { Zap } from "lucide-react";
import { motion } from "motion/react";

export default function AppHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 glass border-b border-white/5"
    >
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.72_0.18_200)] to-[oklch(0.62_0.25_290)] flex items-center justify-center neon-glow-cyan">
            <Zap
              className="w-4 h-4 text-[oklch(0.08_0.01_260)]"
              fill="currentColor"
            />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            <span className="text-gradient-cyan">UpScale</span>
            <span className="text-foreground/80"> AI</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {["Features", "Upscaler", "History"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-neon-cyan/70 bg-neon-cyan/5 border border-neon-cyan/20 rounded-full px-3 py-1">
            Free Forever
          </span>
        </div>
      </div>
    </motion.header>
  );
}
