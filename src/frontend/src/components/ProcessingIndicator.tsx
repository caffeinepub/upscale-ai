import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

interface ProcessingIndicatorProps {
  percent: number;
  stage: string;
  type?: "photo" | "video";
}

export default function ProcessingIndicator({
  percent,
  stage,
  type = "photo",
}: ProcessingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass rounded-2xl p-8 flex flex-col items-center gap-6"
    >
      {/* Animated icon */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-2 border-neon-cyan/20 flex items-center justify-center">
          <Loader2 className="w-9 h-9 text-neon-cyan animate-spin" />
        </div>
        {/* Rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-neon-cyan/50"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-transparent border-b-neon-violet/40"
          animate={{ rotate: -360 }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <div className="w-full max-w-sm space-y-3 text-center">
        <p className="font-display font-semibold text-foreground">
          {type === "video" ? "Processing Video" : "Upscaling Image"}
        </p>
        <p className="text-sm text-muted-foreground font-mono">{stage}</p>

        <div className="space-y-1.5">
          <Progress
            value={percent}
            className="h-2 bg-surface-3 [&>div]:bg-gradient-to-r [&>div]:from-neon-cyan [&>div]:to-neon-violet"
          />
          <p className="text-right text-xs font-mono text-neon-cyan">
            {percent}%
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground/60 text-center max-w-xs">
        {type === "video"
          ? "Video processing runs in your browser. Large files may take several minutes."
          : "All processing happens locally — your files never leave your device."}
      </p>
    </motion.div>
  );
}
