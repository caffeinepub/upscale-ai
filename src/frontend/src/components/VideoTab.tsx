import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Download, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { FileType } from "../backend";
import { useAddHistoryRecord } from "../hooks/useQueries";
import { type ProcessProgress, processVideo } from "../utils/imageProcessing";
import ProcessingIndicator from "./ProcessingIndicator";
import SettingsPanel from "./SettingsPanel";
import UploadZone from "./UploadZone";

type Phase = "idle" | "ready" | "processing" | "done" | "error";

export default function VideoTab() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [progress, setProgress] = useState<ProcessProgress>({
    percent: 0,
    stage: "",
  });

  const [scaleFactor, setScaleFactor] = useState(2);
  const [sharpness, setSharpness] = useState(50);
  const [noiseReduction, setNoiseReduction] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const addHistory = useAddHistoryRecord();

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setProcessedUrl(null);
    setProcessedBlob(null);
    setPhase("ready");
    setErrorMsg("");
  }, []);

  const handleProcess = async () => {
    if (!file) return;
    setPhase("processing");
    setProgress({ percent: 0, stage: "Initializing…" });

    try {
      const blob = await processVideo(
        file,
        { scaleFactor, sharpness, noiseReduction },
        (p) => setProgress(p),
      );
      const url = URL.createObjectURL(blob);
      setProcessedUrl(url);
      setProcessedBlob(blob);
      setPhase("done");

      // Save to history
      try {
        const [origArrBuf, procArrBuf] = await Promise.all([
          file.arrayBuffer(),
          blob.arrayBuffer(),
        ]);
        await addHistory.mutateAsync({
          id: crypto.randomUUID(),
          filename: file.name,
          fileType: FileType.video,
          scaleFactor: BigInt(scaleFactor),
          sharpness: BigInt(sharpness),
          noiseReduction,
          originalBytes: new Uint8Array(origArrBuf) as Uint8Array<ArrayBuffer>,
          processedBytes: new Uint8Array(procArrBuf) as Uint8Array<ArrayBuffer>,
          fileSize: BigInt(file.size),
        });
        toast.success("Saved to history");
      } catch {
        // Non-critical
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err instanceof Error ? err.message : "Video processing failed",
      );
      setPhase("error");
      toast.error("Video processing failed");
    }
  };

  const handleDownload = () => {
    if (!processedBlob || !file) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(processedBlob);
    a.download = `upscaled_${scaleFactor}x_${file.name.replace(/\.[^.]+$/, "")}.webm`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success("Download started");
  };

  const handleReset = () => {
    if (processedUrl) URL.revokeObjectURL(processedUrl);
    setFile(null);
    setProcessedUrl(null);
    setProcessedBlob(null);
    setPhase("idle");
    setErrorMsg("");
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {/* IDLE */}
        {phase === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <UploadZone
              accept="video/mp4,video/quicktime,video/webm"
              type="video"
              onFile={handleFile}
            />
          </motion.div>
        )}

        {/* READY */}
        {phase === "ready" && file && (
          <motion.div
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="glass rounded-xl p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-neon-violet/10 border border-neon-violet/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🎬</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground font-mono mt-0.5">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB · {file.type}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-muted-foreground hover:text-foreground flex-shrink-0"
              >
                Change
              </Button>
            </div>

            <SettingsPanel
              scaleFactor={scaleFactor}
              sharpness={sharpness}
              noiseReduction={noiseReduction}
              onScaleChange={setScaleFactor}
              onSharpnessChange={setSharpness}
              onNoiseReductionChange={setNoiseReduction}
            />

            <div className="glass rounded-xl p-3 flex items-start gap-2.5">
              <span className="text-neon-violet text-base mt-0.5 flex-shrink-0">
                ⚠
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground/80">
                  Video processing runs in your browser.
                </strong>{" "}
                Large files may take several minutes. Keep this tab open during
                processing.
              </p>
            </div>

            <Button
              size="lg"
              className="w-full bg-neon-violet text-white hover:bg-neon-violet/90 font-semibold shadow-neon-violet h-12"
              onClick={handleProcess}
            >
              Upscale Video {scaleFactor}×
            </Button>
          </motion.div>
        )}

        {/* PROCESSING */}
        {phase === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProcessingIndicator
              percent={progress.percent}
              stage={progress.stage}
              type="video"
            />
          </motion.div>
        )}

        {/* DONE */}
        {phase === "done" && processedUrl && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 text-neon-cyan" />
              <span>Video upscaled {scaleFactor}× successfully</span>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              {/* biome-ignore lint/a11y/useMediaCaption: user-uploaded video content, captions not applicable */}
              <video
                src={processedUrl}
                controls
                className="w-full max-h-72 bg-black/40"
                aria-label="Processed video"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/5 text-foreground"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Process Another
              </Button>
              <Button
                className="bg-neon-cyan text-[oklch(0.08_0.01_260)] hover:bg-neon-cyan/90 font-semibold shadow-neon-cyan"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                Download WebM
              </Button>
            </div>
          </motion.div>
        )}

        {/* ERROR */}
        {phase === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass rounded-2xl p-8 flex flex-col items-center gap-4 text-center"
          >
            <AlertCircle className="w-12 h-12 text-destructive" />
            <div>
              <p className="font-semibold mb-1">Processing Failed</p>
              <p className="text-sm text-muted-foreground">{errorMsg}</p>
            </div>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-border hover:border-neon-cyan/40"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
