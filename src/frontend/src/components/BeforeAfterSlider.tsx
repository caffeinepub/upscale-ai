import { GripVertical } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface BeforeAfterSliderProps {
  originalUrl: string;
  processedUrl: string;
  originalLabel?: string;
  processedLabel?: string;
}

export default function BeforeAfterSlider({
  originalUrl,
  processedUrl,
  originalLabel = "Original",
  processedLabel = "Upscaled",
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      updatePosition(e.touches[0].clientX);
    },
    [isDragging, updatePosition],
  );

  const stopDrag = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", stopDrag);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopDrag);
    };
  }, [handleMouseMove, handleTouchMove, stopDrag]);

  return (
    <div
      ref={containerRef}
      className="comparison-slider relative rounded-xl overflow-hidden select-none"
      style={{ touchAction: "none" }}
    >
      {/* Processed (full width, underneath) */}
      <img
        src={processedUrl}
        alt={processedLabel}
        className="w-full h-full object-cover block"
        draggable={false}
      />

      {/* Original (clipped to left side) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={originalUrl}
          alt={originalLabel}
          className="absolute inset-0 w-full h-full object-cover block"
          style={{ width: `${100 / (position / 100)}%`, maxWidth: "none" }}
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-neon-cyan shadow-neon-cyan z-10"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        {/* Handle */}
        <motion.div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full
            bg-neon-cyan border-2 border-white/20 flex items-center justify-center cursor-col-resize
            shadow-neon-cyan"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onMouseDown={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onTouchStart={() => setIsDragging(true)}
        >
          <GripVertical className="w-4 h-4 text-[oklch(0.08_0.01_260)]" />
        </motion.div>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 text-xs font-mono bg-black/60 text-white/80 px-2 py-1 rounded-md backdrop-blur-sm">
        {originalLabel}
      </div>
      <div className="absolute top-3 right-3 text-xs font-mono bg-neon-cyan/20 text-neon-cyan px-2 py-1 rounded-md backdrop-blur-sm border border-neon-cyan/30">
        {processedLabel}
      </div>
    </div>
  );
}
