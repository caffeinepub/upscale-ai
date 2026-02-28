import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Film, ImageIcon, Zap } from "lucide-react";
import { motion } from "motion/react";
import PhotoTab from "./PhotoTab";
import VideoTab from "./VideoTab";

export default function UpscalerTool() {
  return (
    <section id="upscaler" className="py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Section header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-neon-cyan/8 border border-neon-cyan/15 rounded-full px-4 py-1.5 text-xs font-mono text-neon-cyan mb-4">
              <Zap className="w-3 h-3" fill="currentColor" />
              Browser-native processing
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight mb-3">
              Start Upscaling
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
              Upload your file, choose your settings, and let UpScale AI do the
              rest — entirely in your browser.
            </p>
          </div>

          {/* Tool panel */}
          <div className="glass-strong rounded-3xl p-1 shadow-glass">
            <Tabs defaultValue="photo" className="w-full">
              <div className="px-5 pt-5">
                <TabsList className="grid grid-cols-2 bg-surface-1 p-1 rounded-xl h-11 w-full mb-6">
                  <TabsTrigger
                    value="photo"
                    className="rounded-lg text-sm font-medium data-[state=active]:bg-neon-cyan data-[state=active]:text-[oklch(0.08_0.01_260)] data-[state=active]:shadow-none transition-all flex items-center gap-2"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Photo
                  </TabsTrigger>
                  <TabsTrigger
                    value="video"
                    className="rounded-lg text-sm font-medium data-[state=active]:bg-neon-violet data-[state=active]:text-white data-[state=active]:shadow-none transition-all flex items-center gap-2"
                  >
                    <Film className="w-3.5 h-3.5" />
                    Video
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="photo" className="px-5 pb-5 mt-0">
                <PhotoTab />
              </TabsContent>

              <TabsContent value="video" className="px-5 pb-5 mt-0">
                <VideoTab />
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
