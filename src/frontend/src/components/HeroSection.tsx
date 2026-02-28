import { Button } from "@/components/ui/button";
import { ArrowRight, Maximize2, Shield, Sparkles, Zap } from "lucide-react";
import { motion } from "motion/react";

const features = [
  { icon: Maximize2, label: "2x / 4x / 8x Upscale" },
  { icon: Sparkles, label: "Sharpen & Denoise" },
  { icon: Zap, label: "Free Forever" },
  { icon: Shield, label: "Privacy First" },
];

export default function HeroSection() {
  return (
    <section id="features" className="relative overflow-hidden">
      {/* Hero image */}
      <div className="relative h-[420px] sm:h-[500px]">
        <img
          src="/assets/generated/hero-banner.dim_1200x500.jpg"
          alt="UpScale AI hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
        <div className="absolute inset-0 grid-bg opacity-30" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 bg-neon-cyan/10 border border-neon-cyan/20 rounded-full px-4 py-1.5 text-xs font-mono text-neon-cyan mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse-neon" />
              Browser-native AI Processing
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight mb-4 leading-tight">
              Upscale Photos &amp; Videos
              <br />
              <span className="text-gradient-cyan">with AI</span>
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Free browser-based enhancement — no account needed, no uploads to
              the cloud. Your files stay private on your device.
            </p>

            <Button
              size="lg"
              className="bg-neon-cyan text-[oklch(0.08_0.01_260)] hover:bg-neon-cyan/90 font-semibold shadow-neon-cyan group"
              onClick={() =>
                document
                  .getElementById("upscaler")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Start Upscaling
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="container mx-auto px-4 sm:px-6 -mt-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, staggerChildren: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {features.map((feat, i) => (
            <motion.div
              key={feat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="glass rounded-xl p-4 flex items-center gap-3 hover:border-neon-cyan/25 transition-all duration-300 group"
            >
              <div className="w-9 h-9 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center flex-shrink-0 group-hover:bg-neon-cyan/15 transition-colors">
                <feat.icon className="w-4 h-4 text-neon-cyan" />
              </div>
              <span className="text-sm font-medium text-foreground/85">
                {feat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
