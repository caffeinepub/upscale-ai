import { cn } from "@/lib/utils";
import { Film, ImageIcon, Upload } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type ChangeEvent, type DragEvent, useRef, useState } from "react";

interface UploadZoneProps {
  accept: string;
  type: "photo" | "video";
  onFile: (file: File) => void;
}

export default function UploadZone({ accept, type, onFile }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  const Icon = type === "photo" ? ImageIcon : Film;
  const label = type === "photo" ? "JPG, PNG, WEBP" : "MP4, MOV, WEBM";

  return (
    <button
      type="button"
      aria-label={`Upload ${type}`}
      className={cn(
        "relative w-full rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer",
        "flex flex-col items-center justify-center gap-4 py-16 px-8",
        isDragging
          ? "border-neon-cyan bg-neon-cyan/5 shadow-neon-cyan"
          : "border-border hover:border-neon-cyan/40 hover:bg-neon-cyan/3",
      )}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 rounded-2xl bg-neon-cyan/5 border-2 border-neon-cyan"
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
        className="w-16 h-16 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/25 flex items-center justify-center"
      >
        <Icon className="w-7 h-7 text-neon-cyan" />
      </motion.div>

      <div className="text-center">
        <p className="font-semibold text-foreground mb-1">
          Drop your {type} here
        </p>
        <p className="text-sm text-muted-foreground">
          or{" "}
          <span className="text-neon-cyan underline underline-offset-2">
            browse files
          </span>
        </p>
        <p className="text-xs text-muted-foreground/60 mt-2 font-mono">
          {label}
        </p>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground/50">
        <span className="flex items-center gap-1.5">
          <Upload className="w-3 h-3" />
          Processed locally
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={handleChange}
      />
    </button>
  );
}
